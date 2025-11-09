import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const DAILY_REWARDS = [50, 75, 100, 150, 200, 300, 500];

// POST /api/rewards/daily/claim - Claim daily reward
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { address } = body;

    if (!address) {
      return NextResponse.json(
        { error: 'Address is required' },
        { status: 400 }
      );
    }

    const normalizedAddress = address.toLowerCase();

    // Get user
    const user = await prisma.user.findUnique({
      where: { address: normalizedAddress },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if can claim (more than 20 hours since last claim)
    const now = new Date();
    const lastClaim = user.updatedAt;
    const hoursSinceLastClaim = (now.getTime() - lastClaim.getTime()) / (1000 * 60 * 60);

    if (hoursSinceLastClaim < 20) {
      return NextResponse.json(
        { error: 'Already claimed today. Come back tomorrow!' },
        { status: 400 }
      );
    }

    // Calculate current streak day (0-6)
    const streakDay = Math.min(Math.floor(hoursSinceLastClaim / 24), 6);
    const rewardAmount = DAILY_REWARDS[streakDay];

    // Add reward to balance
    await prisma.user.update({
      where: { id: user.id },
      data: {
        ycBalance: user.ycBalance + rewardAmount,
        xp: user.xp + 10, // Bonus XP for logging in
        updatedAt: now, // Update claim time
      },
    });

    // Check for streak achievement
    if (streakDay === 6) {
      // 7-day streak completed
      try {
        await prisma.achievement.create({
          data: {
            userId: user.id,
            type: 'DIAMOND_HANDS',
          },
        });
      } catch (error) {
        // Achievement already exists
      }
    }

    return NextResponse.json({
      success: true,
      reward: rewardAmount,
      newBalance: user.ycBalance + rewardAmount,
      streak: streakDay + 1,
      message: `Claimed ${rewardAmount} credits!`,
    });
  } catch (error) {
    console.error('Error claiming daily reward:', error);
    return NextResponse.json(
      { error: 'Failed to claim daily reward' },
      { status: 500 }
    );
  }
}
