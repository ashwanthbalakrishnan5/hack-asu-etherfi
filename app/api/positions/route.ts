import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { checkAndAwardAchievements } from '@/lib/achievements';

const prisma = new PrismaClient();

// POST /api/positions - Place a bet on a market
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userAddress, marketId, side, amount } = body;

    // Validation
    if (!userAddress || !marketId || !side || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields: userAddress, marketId, side, amount' },
        { status: 400 }
      );
    }

    if (!['YES', 'NO'].includes(side)) {
      return NextResponse.json(
        { error: 'Side must be YES or NO' },
        { status: 400 }
      );
    }

    if (amount <= 0) {
      return NextResponse.json(
        { error: 'Amount must be greater than 0' },
        { status: 400 }
      );
    }

    // Get or create user
    let user = await prisma.user.findUnique({
      where: { address: userAddress },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          address: userAddress,
        },
      });
    }

    // Check YC balance
    if (user.ycBalance < amount) {
      return NextResponse.json(
        { error: 'Insufficient YC balance', balance: user.ycBalance, required: amount },
        { status: 400 }
      );
    }

    // Check if market exists and is active
    const market = await prisma.market.findUnique({
      where: { id: marketId },
    });

    if (!market) {
      return NextResponse.json(
        { error: 'Market not found' },
        { status: 404 }
      );
    }

    if (market.resolved) {
      return NextResponse.json(
        { error: 'Market already resolved' },
        { status: 400 }
      );
    }

    if (new Date(market.closeTime) < new Date()) {
      return NextResponse.json(
        { error: 'Market has closed' },
        { status: 400 }
      );
    }

    // Create position and update market pools in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Deduct YC from user and track ycSpent
      const updatedUser = await tx.user.update({
        where: { id: user!.id },
        data: {
          ycBalance: { decrement: amount },
          totalBets: { increment: 1 },
          ycSpent: { increment: amount },
          xp: { increment: 10 }, // Award XP for placing bet
        },
      });

      // Update market pool
      const poolUpdate = side === 'YES'
        ? { yesPool: { increment: amount } }
        : { noPool: { increment: amount } };

      const updatedMarket = await tx.market.update({
        where: { id: marketId },
        data: poolUpdate,
      });

      // Create position
      const position = await tx.position.create({
        data: {
          userId: user!.id,
          marketId,
          side,
          amount,
        },
      });

      return { position, user: updatedUser, market: updatedMarket };
    });

    // Check achievements (for First Blood)
    const newAchievements = await checkAndAwardAchievements({
      userId: user.id,
      userAddress,
    });

    return NextResponse.json({
      position: result.position,
      newYCBalance: result.user.ycBalance,
      market: result.market,
      xpEarned: 10,
      newAchievements,
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating position:', error);
    return NextResponse.json(
      { error: 'Failed to create position' },
      { status: 500 }
    );
  }
}

// GET /api/positions - Get user positions
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

    const user = await prisma.user.findUnique({
      where: { address: userAddress },
    });

    if (!user) {
      return NextResponse.json([]);
    }

    const positions = await prisma.position.findMany({
      where: { userId: user.id },
      include: {
        market: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(positions);
  } catch (error) {
    console.error('Error fetching positions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch positions' },
      { status: 500 }
    );
  }
}
