import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { calculateUserClass } from '@/lib/achievements';


// Generate dummy data for demo purposes
function generateDummyUserData() {
  // Generate random but realistic stats
  const totalBets = Math.floor(Math.random() * 20) + 10; // 10-30 bets
  const accuracy = Math.random() * 30 + 50; // 50-80% accuracy
  const wins = Math.floor(totalBets * (accuracy / 100));
  const losses = totalBets - wins;
  const ycSpent = totalBets * (Math.random() * 50 + 50); // 50-100 YC per bet
  const ycWon = ycSpent * (accuracy / 100) * (Math.random() * 0.5 + 1.5); // Some variation
  const yieldEfficiency = ((ycWon - ycSpent) / ycSpent) * 100;
  const wisdomIndex = (accuracy * 0.5) + (Math.max(0, yieldEfficiency) * 0.3) + (Math.random() * 20);
  const xp = totalBets * 30 + wins * 20 + Math.floor(Math.random() * 200);
  const level = Math.floor(Math.sqrt(xp / 100)) + 1;
  const streakCount = Math.floor(Math.random() * 5);

  return {
    totalBets,
    wins,
    losses,
    accuracy,
    ycSpent,
    ycWon,
    yieldEfficiency,
    wisdomIndex,
    xp,
    level,
    streakCount,
  };
}

// Create some dummy achievements for demo
async function createDummyAchievements(userId: string) {
  const commonAchievements = ['FIRST_BET', 'HAT_TRICK'];

  for (const type of commonAchievements) {
    try {
      await prisma.achievement.create({
        data: {
          userId,
          type,
          earnedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Random time in last week
        },
      });
    } catch (error) {
      // Ignore duplicate errors
      console.log(`Achievement ${type} may already exist for user ${userId}`);
    }
  }
}

// GET /api/users/:address - Get user profile
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ address: string }> }
) {
  try {
    const { address } = await params;
    const normalizedAddress = address.toLowerCase();

    // Get or create user
    let user = await prisma.user.findUnique({
      where: { address: normalizedAddress },
    });

    if (!user) {
      // Create new user with dummy data for demo purposes
      const dummyData = generateDummyUserData();

      user = await prisma.user.create({
        data: {
          address: normalizedAddress,
          ycBalance: 1000, // Demo: Start with 1000 YC
          principal: 0,
          lastAccrualTime: new Date(),
          // Add dummy stats for demo
          xp: dummyData.xp,
          level: dummyData.level,
          accuracy: dummyData.accuracy,
          totalBets: dummyData.totalBets,
          wins: dummyData.wins,
          losses: dummyData.losses,
          streakCount: dummyData.streakCount,
          ycSpent: dummyData.ycSpent,
          ycWon: dummyData.ycWon,
          yieldEfficiency: dummyData.yieldEfficiency,
          wisdomIndex: dummyData.wisdomIndex,
        },
      });

      // Create some dummy achievements
      await createDummyAchievements(user.id);
    }

    // Calculate user class
    const userClass = calculateUserClass({
      accuracy: user.accuracy,
      wisdomIndex: user.wisdomIndex,
      principal: user.principal,
      ycSpent: user.ycSpent,
    });

    // Get achievements count
    const achievementsCount = await prisma.achievement.count({
      where: { userId: user.id },
    });

    return NextResponse.json({
      ...user,
      class: userClass,
      achievementsCount,
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user profile' },
      { status: 500 }
    );
  }
}

// PATCH /api/users/:address - Update user profile
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ address: string }> }
) {
  try {
    const { address } = await params;
    const normalizedAddress = address.toLowerCase();
    const body = await request.json();

    const user = await prisma.user.findUnique({
      where: { address: normalizedAddress },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Only allow updating specific fields
    const allowedFields = ['displayName', 'showOnLeaderboard'];
    const updateData: any = {};

    for (const field of allowedFields) {
      if (field in body) {
        updateData[field] = body[field];
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: updateData,
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json(
      { error: 'Failed to update user profile' },
      { status: 500 }
    );
  }
}
