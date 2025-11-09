import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { ACHIEVEMENT_DEFINITIONS } from '@/lib/achievements';

const prisma = new PrismaClient();

// GET /api/achievements - Get user achievements
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userAddress = searchParams.get('userAddress');

    if (!userAddress) {
      return NextResponse.json(
        { error: 'userAddress parameter required' },
        { status: 400 }
      );
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { address: userAddress },
    });

    if (!user) {
      return NextResponse.json({
        earned: [],
        locked: Object.values(ACHIEVEMENT_DEFINITIONS),
      });
    }

    // Get earned achievements
    const earnedAchievements = await prisma.achievement.findMany({
      where: { userId: user.id },
      orderBy: { earnedAt: 'desc' },
    });

    const earnedTypes = new Set(earnedAchievements.map((a) => a.type));

    // Format earned achievements with definitions
    const earned = earnedAchievements.map((achievement) => ({
      ...ACHIEVEMENT_DEFINITIONS[achievement.type],
      earnedAt: achievement.earnedAt,
    }));

    // Get locked achievements
    const locked = Object.values(ACHIEVEMENT_DEFINITIONS).filter(
      (def) => !earnedTypes.has(def.type)
    );

    return NextResponse.json({
      earned,
      locked,
    });
  } catch (error) {
    console.error('Error fetching achievements:', error);
    return NextResponse.json(
      { error: 'Failed to fetch achievements' },
      { status: 500 }
    );
  }
}
