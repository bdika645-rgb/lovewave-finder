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

    // 1. Shared interests (30% weight) — Jaccard similarity
    const currentInterests = (currentProfile.interests || []).map(i => i.toLowerCase());
    const targetInterests = (targetProfile.interests || []).map(i => i.toLowerCase());
    const sharedInterests = currentInterests.filter(i => targetInterests.includes(i));

    if (currentInterests.length > 0 && targetInterests.length > 0) {
      const union = new Set([...currentInterests, ...targetInterests]).size;
      const jaccardScore = sharedInterests.length / union;
      breakdown.interests = Math.round(jaccardScore * 30);

      if (sharedInterests.length >= 3) {
        matchReasons.push(`${sharedInterests.length} תחומי עניין משותפים`);
      } else if (sharedInterests.length > 0) {
        matchReasons.push(`תחומי עניין משותפים`);
      }
    } else {
      breakdown.interests = 10; // neutral
    }

    // 2. Location match (15% weight)
    if (currentProfile.city && targetProfile.city) {
      if (currentProfile.city.toLowerCase() === targetProfile.city.toLowerCase()) {
        breakdown.location = 15;
        matchReasons.push(`גרים באותה עיר`);
      } else {
        breakdown.location = 4;
      }
    } else {
      breakdown.location = 7;
    }

    // 3. Relationship goal match (25% weight) — core compatibility signal
    if (currentProfile.relationship_goal && targetProfile.relationship_goal) {
      if (currentProfile.relationship_goal === targetProfile.relationship_goal) {
        breakdown.relationshipGoal = 25;
        matchReasons.push(`מחפשים אותו דבר`);
      } else {
        const longTermGoals = ['long_term', 'serious', 'marriage'];
        const casualGoals = ['casual', 'friendship', 'short_term'];
        const bothLong = longTermGoals.includes(currentProfile.relationship_goal) && longTermGoals.includes(targetProfile.relationship_goal);
        const bothCasual = casualGoals.includes(currentProfile.relationship_goal) && casualGoals.includes(targetProfile.relationship_goal);
        breakdown.relationshipGoal = (bothLong || bothCasual) ? 15 : 3;
      }
    } else {
      breakdown.relationshipGoal = 10; // neutral
    }

    // 4. Gender preference bonus (5%)
    if (currentProfile.looking_for && targetProfile.gender) {
      if (currentProfile.looking_for === targetProfile.gender) {
        breakdown.ageRange += 5;
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

    // 6. Education match bonus (5%)
    if (currentProfile.education && targetProfile.education) {
      if (currentProfile.education === targetProfile.education) {
        breakdown.ageRange += 5;
        matchReasons.push(`רמת השכלה זהה`);
      } else {
        // Partial: academic levels are closer to each other
        const academic = ['bachelors', 'masters', 'doctorate', 'phd'];
        const bothAcademic = academic.includes(currentProfile.education) && academic.includes(targetProfile.education);
        if (bothAcademic) breakdown.ageRange += 2;
      }
    }

    // 7. Smoking compatibility (5%) — non-smokers strongly prefer non-smokers
    if (currentProfile.smoking && targetProfile.smoking) {
      if (currentProfile.smoking === targetProfile.smoking) {
        breakdown.ageRange += 5;
        if (currentProfile.smoking === 'never') matchReasons.push(`שניכם לא מעשנים`);
      } else if (currentProfile.smoking === 'never' && targetProfile.smoking === 'smoker') {
        breakdown.ageRange -= 3; // mismatch penalty
      }
    }

    // Calculate total score — clamp 0–100
    const score = breakdown.interests + breakdown.location + breakdown.relationshipGoal + breakdown.ageRange;

    return {
      score: Math.max(0, Math.min(score, 100)),
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

  // Shared interests (30%) — Jaccard similarity
  const interests1 = (profile1.interests || []).map(i => i.toLowerCase());
  const interests2 = (profile2.interests || []).map(i => i.toLowerCase());
  const shared = interests1.filter(i => interests2.includes(i));
  if (interests1.length > 0 && interests2.length > 0) {
    const union = new Set([...interests1, ...interests2]).size;
    score += Math.round((shared.length / union) * 30);
  } else {
    score += 10;
  }

  // Same city (15%)
  if (profile1.city && profile2.city &&
      profile1.city.toLowerCase() === profile2.city.toLowerCase()) {
    score += 15;
  } else {
    score += 4;
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
      score += close ? 15 : 3;
    }
  } else {
    score += 10;
  }

  // Gender preference (5%)
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

  // Education match (5%)
  if (profile1.education && profile2.education) {
    if (profile1.education === profile2.education) {
      score += 5;
    } else {
      const academic = ['bachelors', 'masters', 'doctorate', 'phd'];
      if (academic.includes(profile1.education) && academic.includes(profile2.education)) score += 2;
    }
  }

  // Smoking compatibility (5%)
  if (profile1.smoking && profile2.smoking) {
    if (profile1.smoking === profile2.smoking) score += 5;
    else if (profile1.smoking === 'never' && profile2.smoking === 'smoker') score -= 3;
  }

  return Math.max(0, Math.min(score, 100));
}
