import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export type AchievementRarity = 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary';

export interface AchievementDefinition {
  type: string;
  name: string;
  description: string;
  rarity: AchievementRarity;
  icon: string;
}

export const ACHIEVEMENT_DEFINITIONS: Record<string, AchievementDefinition> = {
  FIRST_BLOOD: {
    type: 'FIRST_BLOOD',
    name: 'First Blood',
    description: 'Place your first bet',
    rarity: 'Common',
    icon: '🎯',
  },
  HAT_TRICK: {
    type: 'HAT_TRICK',
    name: 'Hat Trick',
    description: '3 wins in a row',
    rarity: 'Rare',
    icon: '🎩',
  },
  SHARPSHOOTER: {
    type: 'SHARPSHOOTER',
    name: 'Sharpshooter',
    description: '>60% accuracy with 10+ bets',
    rarity: 'Epic',
    icon: '🎖️',
  },
  QUEST_MASTER: {
    type: 'QUEST_MASTER',
    name: 'Quest Master',
    description: 'Complete 5 Claude quests',
    rarity: 'Rare',
    icon: '📜',
  },
  DIAMOND_HANDS: {
    type: 'DIAMOND_HANDS',
    name: 'Diamond Hands',
    description: 'Withdraw after 7 days',
    rarity: 'Uncommon',
    icon: '💎',
  },
  WHALE: {
    type: 'WHALE',
    name: 'Whale',
    description: 'Deposit >1 weETH',
    rarity: 'Rare',
    icon: '🐋',
  },
  ORACLE: {
    type: 'ORACLE',
    name: 'Oracle',
    description: '>75% accuracy with 20+ bets',
    rarity: 'Legendary',
    icon: '🔮',
  },
};

export interface CheckAchievementsParams {
  userId: string;
  userAddress: string;
}

/**
 * Check and award achievements based on user stats
 */
export async function checkAndAwardAchievements(params: CheckAchievementsParams) {
  const { userId, userAddress } = params;

  // Get user with stats
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    return [];
  }

  // Get existing achievements
  const existingAchievements = await prisma.achievement.findMany({
    where: { userId },
  });

  const existingTypes = new Set(existingAchievements.map((a) => a.type));
  const newAchievements: AchievementDefinition[] = [];

  // Check each achievement condition
  // FIRST_BLOOD: Place first bet
  if (user.totalBets >= 1 && !existingTypes.has('FIRST_BLOOD')) {
    await prisma.achievement.create({
      data: {
        userId,
        type: 'FIRST_BLOOD',
      },
    });
    newAchievements.push(ACHIEVEMENT_DEFINITIONS.FIRST_BLOOD);
  }

  // HAT_TRICK: 3 wins in a row
  if (user.streakCount >= 3 && !existingTypes.has('HAT_TRICK')) {
    await prisma.achievement.create({
      data: {
        userId,
        type: 'HAT_TRICK',
      },
    });
    newAchievements.push(ACHIEVEMENT_DEFINITIONS.HAT_TRICK);
  }

  // SHARPSHOOTER: >60% accuracy with 10+ bets
  if (user.totalBets >= 10 && user.accuracy > 60 && !existingTypes.has('SHARPSHOOTER')) {
    await prisma.achievement.create({
      data: {
        userId,
        type: 'SHARPSHOOTER',
      },
    });
    newAchievements.push(ACHIEVEMENT_DEFINITIONS.SHARPSHOOTER);
  }

  // QUEST_MASTER: Complete 5 Claude quests
  if (user.completedQuests >= 5 && !existingTypes.has('QUEST_MASTER')) {
    await prisma.achievement.create({
      data: {
        userId,
        type: 'QUEST_MASTER',
      },
    });
    newAchievements.push(ACHIEVEMENT_DEFINITIONS.QUEST_MASTER);
  }

  // DIAMOND_HANDS: Withdraw after 7 days
  if (
    user.firstDepositAt &&
    user.firstWithdrawAt &&
    !existingTypes.has('DIAMOND_HANDS')
  ) {
    const daysBetween =
      (user.firstWithdrawAt.getTime() - user.firstDepositAt.getTime()) /
      (1000 * 60 * 60 * 24);
    if (daysBetween >= 7) {
      await prisma.achievement.create({
        data: {
          userId,
          type: 'DIAMOND_HANDS',
        },
      });
      newAchievements.push(ACHIEVEMENT_DEFINITIONS.DIAMOND_HANDS);
    }
  }

  // WHALE: Deposit >1 weETH
  if (user.principal >= 1 && !existingTypes.has('WHALE')) {
    await prisma.achievement.create({
      data: {
        userId,
        type: 'WHALE',
      },
    });
    newAchievements.push(ACHIEVEMENT_DEFINITIONS.WHALE);
  }

  // ORACLE: >75% accuracy with 20+ bets
  if (user.totalBets >= 20 && user.accuracy > 75 && !existingTypes.has('ORACLE')) {
    await prisma.achievement.create({
      data: {
        userId,
        type: 'ORACLE',
      },
    });
    newAchievements.push(ACHIEVEMENT_DEFINITIONS.ORACLE);
  }

  return newAchievements;
}

/**
 * Calculate level from XP
 */
export function calculateLevel(xp: number): number {
  return Math.floor(Math.sqrt(xp / 100));
}

/**
 * Calculate XP required for next level
 */
export function calculateNextLevelXP(level: number): number {
  return (level + 1) ** 2 * 100;
}

/**
 * Calculate XP required for current level
 */
export function calculateCurrentLevelXP(level: number): number {
  return level ** 2 * 100;
}

/**
 * Calculate user's class based on behavior
 */
export function calculateUserClass(user: {
  accuracy: number;
  wisdomIndex: number;
  principal: number;
  ycSpent: number;
}): string {
  // Whale: high principal deposited (>1 weETH)
  if (user.principal >= 1) {
    return 'Whale';
  }

  // Oracle: high accuracy (>70%)
  if (user.accuracy > 70) {
    return 'Oracle';
  }

  // Analyst: high wisdom index (>60)
  if (user.wisdomIndex > 60) {
    return 'Analyst';
  }

  // Degen: high stakes, lower accuracy
  if (user.ycSpent > 100 && user.accuracy < 50) {
    return 'Degen';
  }

  return 'Novice';
}

/**
 * Calculate yield efficiency
 */
export function calculateYieldEfficiency(ycWon: number, ycSpent: number): number {
  if (ycSpent === 0) return 0;
  return ((ycWon - ycSpent) / ycSpent) * 100;
}

/**
 * Calculate wisdom index
 * Formula: (accuracy * 0.5) + (yieldEfficiency * 0.3) + (streakBonus * 0.2)
 */
export function calculateWisdomIndex(
  accuracy: number,
  yieldEfficiency: number,
  streakCount: number
): number {
  const streakBonus = Math.min(streakCount * 10, 100); // Max 100 from streaks
  return accuracy * 0.5 + yieldEfficiency * 0.3 + streakBonus * 0.2;
}
