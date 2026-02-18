import { useMemo } from 'react';
import type { Tables } from '@/integrations/supabase/types';

type Profile = Tables<'profiles'>;

interface CompatibilityResult {
  score: number;
  breakdown: {
    interests: number;
    location: number;
    relationshipGoal: number;
    ageRange: number;
  };
  matchReasons: string[];
}

export function useCompatibility(
  currentProfile: Profile | null,
  targetProfile: Profile | null
): CompatibilityResult {
  return useMemo(() => {
    if (!currentProfile || !targetProfile) {
      return {
        score: 0,
        breakdown: { interests: 0, location: 0, relationshipGoal: 0, ageRange: 0 },
        matchReasons: []
      };
    }

    const breakdown = {
      interests: 0,
      location: 0,
      relationshipGoal: 0,
      ageRange: 0
    };
    const matchReasons: string[] = [];

    // 1. Shared interests (35% weight)
    const currentInterests = (currentProfile.interests || []).map(i => i.toLowerCase());
    const targetInterests = (targetProfile.interests || []).map(i => i.toLowerCase());
    const sharedInterests = currentInterests.filter(i => targetInterests.includes(i));

    if (currentInterests.length > 0 && targetInterests.length > 0) {
      // Use Jaccard similarity: intersection / union
      const union = new Set([...currentInterests, ...targetInterests]).size;
      const jaccardScore = sharedInterests.length / union;
      breakdown.interests = Math.round(jaccardScore * 35);

      if (sharedInterests.length >= 3) {
        matchReasons.push(`${sharedInterests.length} תחומי עניין משותפים`);
      } else if (sharedInterests.length > 0) {
        matchReasons.push(`תחומי עניין משותפים`);
      }
    } else {
      // Neutral if no interests data
      breakdown.interests = 12;
    }

    // 2. Location match (20% weight)
    if (currentProfile.city && targetProfile.city) {
      if (currentProfile.city.toLowerCase() === targetProfile.city.toLowerCase()) {
        breakdown.location = 20;
        matchReasons.push(`גרים באותה עיר`);
      } else {
        breakdown.location = 5;
      }
    } else {
      breakdown.location = 8;
    }

    // 3. Relationship goal match (25% weight) - boosted, core compatibility signal
    if (currentProfile.relationship_goal && targetProfile.relationship_goal) {
      if (currentProfile.relationship_goal === targetProfile.relationship_goal) {
        breakdown.relationshipGoal = 25;
        matchReasons.push(`מחפשים אותו דבר`);
      } else {
        // Partial match: long-term & serious are closer than long-term & casual
        const longTermGoals = ['long_term', 'serious', 'marriage'];
        const casualGoals = ['casual', 'friendship', 'short_term'];
        const bothLong = longTermGoals.includes(currentProfile.relationship_goal) && longTermGoals.includes(targetProfile.relationship_goal);
        const bothCasual = casualGoals.includes(currentProfile.relationship_goal) && casualGoals.includes(targetProfile.relationship_goal);
        breakdown.relationshipGoal = (bothLong || bothCasual) ? 15 : 5;
      }
    } else {
      breakdown.relationshipGoal = 12; // Neutral if unspecified
    }

    // 4. looking_for gender match (5% bonus)
    if (currentProfile.looking_for && targetProfile.gender) {
      if (currentProfile.looking_for === targetProfile.gender) {
        breakdown.ageRange += 5; // small bonus for gender preference match
      }
    }

    // 5. Age compatibility (15% weight)
    const ageDiff = Math.abs(currentProfile.age - targetProfile.age);
    if (ageDiff <= 2) {
      breakdown.ageRange += 15;
      matchReasons.push(`גיל זהה כמעט`);
    } else if (ageDiff <= 5) {
      breakdown.ageRange += 12;
      matchReasons.push(`גיל קרוב`);
    } else if (ageDiff <= 10) {
      breakdown.ageRange += 7;
    } else if (ageDiff <= 15) {
      breakdown.ageRange += 3;
    }

    // Calculate total score
    const score = breakdown.interests + breakdown.location + breakdown.relationshipGoal + breakdown.ageRange;

    return {
      score: Math.min(score, 100),
      breakdown,
      matchReasons
    };
  }, [currentProfile, targetProfile]);
}

// Calculate compatibility score between two profiles (standalone, no hooks)
export function calculateCompatibility(
  profile1: Partial<Profile>,
  profile2: Partial<Profile>
): number {
  let score = 0;

  // Shared interests (35%) - Jaccard similarity
  const interests1 = (profile1.interests || []).map(i => i.toLowerCase());
  const interests2 = (profile2.interests || []).map(i => i.toLowerCase());
  const shared = interests1.filter(i => interests2.includes(i));
  if (interests1.length > 0 && interests2.length > 0) {
    const union = new Set([...interests1, ...interests2]).size;
    score += Math.round((shared.length / union) * 35);
  } else {
    score += 12; // neutral
  }

  // Same city (20%)
  if (profile1.city && profile2.city &&
      profile1.city.toLowerCase() === profile2.city.toLowerCase()) {
    score += 20;
  } else {
    score += 5;
  }

  // Same relationship goal (25%)
  if (profile1.relationship_goal && profile2.relationship_goal) {
    if (profile1.relationship_goal === profile2.relationship_goal) {
      score += 25;
    } else {
      const longTerm = ['long_term', 'serious', 'marriage'];
      const casual = ['casual', 'friendship', 'short_term'];
      const close = (longTerm.includes(profile1.relationship_goal) && longTerm.includes(profile2.relationship_goal)) ||
                    (casual.includes(profile1.relationship_goal) && casual.includes(profile2.relationship_goal));
      score += close ? 15 : 5;
    }
  } else {
    score += 12; // neutral
  }

  // looking_for bonus (5%)
  if (profile1.looking_for && profile2.gender && profile1.looking_for === profile2.gender) {
    score += 5;
  }

  // Age compatibility (15%)
  if (profile1.age && profile2.age) {
    const ageDiff = Math.abs(profile1.age - profile2.age);
    if (ageDiff <= 2) score += 15;
    else if (ageDiff <= 5) score += 12;
    else if (ageDiff <= 10) score += 7;
    else if (ageDiff <= 15) score += 3;
  }

  return Math.min(score, 100);
}
