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

    // 1. Shared interests (40% weight)
    const currentInterests = currentProfile.interests || [];
    const targetInterests = targetProfile.interests || [];
    const sharedInterests = currentInterests.filter(i => 
      targetInterests.includes(i)
    );
    
    if (currentInterests.length > 0 && targetInterests.length > 0) {
      const maxPossible = Math.min(currentInterests.length, targetInterests.length);
      breakdown.interests = Math.round((sharedInterests.length / Math.max(maxPossible, 1)) * 40);
      
      if (sharedInterests.length >= 3) {
        matchReasons.push(`${sharedInterests.length} תחומי עניין משותפים`);
      } else if (sharedInterests.length > 0) {
        matchReasons.push(`יש לכם תחומי עניין משותפים`);
      }
    }

    // 2. Location match (25% weight)
    if (currentProfile.city && targetProfile.city) {
      if (currentProfile.city.toLowerCase() === targetProfile.city.toLowerCase()) {
        breakdown.location = 25;
        matchReasons.push(`גרים באותה עיר`);
      } else {
        // Partial match for nearby cities (simplified - would need geo data for real impl)
        breakdown.location = 10;
      }
    }

    // 3. Relationship goal match (20% weight)
    if (currentProfile.relationship_goal && targetProfile.relationship_goal) {
      if (currentProfile.relationship_goal === targetProfile.relationship_goal) {
        breakdown.relationshipGoal = 20;
        matchReasons.push(`מחפשים אותו דבר`);
      } else {
        breakdown.relationshipGoal = 5;
      }
    } else {
      // Give some points if no goal specified
      breakdown.relationshipGoal = 10;
    }

    // 4. Age compatibility (15% weight)
    const ageDiff = Math.abs(currentProfile.age - targetProfile.age);
    if (ageDiff <= 3) {
      breakdown.ageRange = 15;
      matchReasons.push(`גיל קרוב`);
    } else if (ageDiff <= 7) {
      breakdown.ageRange = 10;
    } else if (ageDiff <= 12) {
      breakdown.ageRange = 5;
    } else {
      breakdown.ageRange = 0;
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

// Calculate compatibility score between two profiles
export function calculateCompatibility(
  profile1: Partial<Profile>,
  profile2: Partial<Profile>
): number {
  let score = 0;

  // Shared interests (40%)
  const interests1 = profile1.interests || [];
  const interests2 = profile2.interests || [];
  const sharedInterests = interests1.filter(i => interests2.includes(i));
  if (interests1.length > 0 && interests2.length > 0) {
    score += Math.round((sharedInterests.length / Math.min(interests1.length, interests2.length)) * 40);
  }

  // Same city (25%)
  if (profile1.city && profile2.city && 
      profile1.city.toLowerCase() === profile2.city.toLowerCase()) {
    score += 25;
  }

  // Same relationship goal (20%)
  if (profile1.relationship_goal && profile2.relationship_goal &&
      profile1.relationship_goal === profile2.relationship_goal) {
    score += 20;
  } else if (!profile1.relationship_goal || !profile2.relationship_goal) {
    score += 10;
  }

  // Age compatibility (15%)
  if (profile1.age && profile2.age) {
    const ageDiff = Math.abs(profile1.age - profile2.age);
    if (ageDiff <= 3) score += 15;
    else if (ageDiff <= 7) score += 10;
    else if (ageDiff <= 12) score += 5;
  }

  return Math.min(score, 100);
}
