import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';


// POST /api/yc/withdraw - Withdraw YC to wallet (convert to some token or just reduce balance)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { address, amount } = body;

    if (!address || !amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Valid address and amount are required' },
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

    // Check if user has enough YC
    if (user.ycBalance < amount) {
      return NextResponse.json(
        { error: 'Insufficient YC balance' },
        { status: 400 }
      );
    }

    // Deduct YC from balance
    await prisma.user.update({
      where: { id: user.id },
      data: {
        ycBalance: user.ycBalance - amount,
      },
    });

    // TODO: In production, mint tokens or transfer to user's wallet
    // For demo, we just reduce the balance

    return NextResponse.json({
      success: true,
      withdrawn: amount,
      newBalance: user.ycBalance - amount,
      message: `Successfully withdrawn ${amount} YC`,
    });
  } catch (error) {
    console.error('Error withdrawing YC:', error);
    return NextResponse.json(
      { error: 'Failed to withdraw YC' },
      { status: 500 }
    );
  }
}
