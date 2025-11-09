import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { calculateUserClass } from '@/lib/achievements';

const prisma = new PrismaClient();

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
      // Create new user with default values
      user = await prisma.user.create({
        data: {
          address: normalizedAddress,
          ycBalance: 1000, // Demo: Start with 1000 YC
          principal: 0,
          lastAccrualTime: new Date(),
        },
      });
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
