import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/rewards/daily - Check daily reward status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address');

    if (!address) {
      return NextResponse.json(
        { error: 'Address is required' },
        { status: 400 }
      );
    }

    const normalizedAddress = address.toLowerCase();

    // Get or create user
    let user = await prisma.user.findUnique({
      where: { address: normalizedAddress },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          address: normalizedAddress,
          ycBalance: 1000,
          principal: 0,
          lastAccrualTime: new Date(),
        },
      });
    }

    // Check last claim time (stored in user metadata - you may want to add a field to schema)
    // For demo, we'll use createdAt as reference
    const now = new Date();
    const lastClaim = user.updatedAt; // In production, use a dedicated lastDailyClaimAt field
    const hoursSinceLastClaim = (now.getTime() - lastClaim.getTime()) / (1000 * 60 * 60);

    // Can claim if more than 20 hours have passed (allowing for timezone flexibility)
    const canClaim = hoursSinceLastClaim >= 20;

    // Calculate streak (for demo, using a simple calculation)
    // In production, store this in user record
    const streak = Math.min(Math.floor(hoursSinceLastClaim / 24), 7);

    return NextResponse.json({
      canClaim,
      streak,
      lastClaimTime: lastClaim,
      nextClaimTime: new Date(lastClaim.getTime() + 24 * 60 * 60 * 1000),
    });
  } catch (error) {
    console.error('Error checking daily reward:', error);
    return NextResponse.json(
      { error: 'Failed to check daily reward status' },
      { status: 500 }
    );
  }
}
