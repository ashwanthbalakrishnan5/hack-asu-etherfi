import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { checkAndAwardAchievements } from '@/lib/achievements';

const prisma = new PrismaClient();

// POST /api/achievements/check - Check and award achievements for a user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userAddress } = body;

    if (!userAddress) {
      return NextResponse.json(
        { error: 'userAddress required' },
        { status: 400 }
      );
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { address: userAddress },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check and award achievements
    const newAchievements = await checkAndAwardAchievements({
      userId: user.id,
      userAddress,
    });

    return NextResponse.json({
      newAchievements,
    });
  } catch (error) {
    console.error('Error checking achievements:', error);
    return NextResponse.json(
      { error: 'Failed to check achievements' },
      { status: 500 }
    );
  }
}
