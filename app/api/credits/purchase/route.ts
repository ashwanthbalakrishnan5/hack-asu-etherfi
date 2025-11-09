import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// POST /api/credits/purchase - Purchase credits
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { address, packageId, amount } = body;

    if (!address || !amount) {
      return NextResponse.json(
        { error: 'Address and amount are required' },
        { status: 400 }
      );
    }

    const normalizedAddress = address.toLowerCase();

    // Get or create user using upsert to avoid race conditions
    let user = await prisma.user.upsert({
      where: { address: normalizedAddress },
      update: {},
      create: {
        address: normalizedAddress,
        ycBalance: 0,
        principal: 0,
        lastAccrualTime: new Date(),
      },
    });

    // TODO: Implement actual payment verification (crypto payment)
    // For demo, we'll just add the credits

    // Add credits to user balance
    await prisma.user.update({
      where: { id: user.id },
      data: {
        ycBalance: user.ycBalance + amount,
      },
    });

    // Award XP for purchase
    await prisma.user.update({
      where: { id: user.id },
      data: {
        xp: user.xp + 50,
      },
    });

    return NextResponse.json({
      success: true,
      newBalance: user.ycBalance + amount,
      message: `Successfully purchased ${amount} credits`,
    });
  } catch (error) {
    console.error('Error purchasing credits:', error);
    return NextResponse.json(
      { error: 'Failed to purchase credits' },
      { status: 500 }
    );
  }
}
