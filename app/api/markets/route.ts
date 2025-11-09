import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/markets - List all markets with optional filtering
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const filter = searchParams.get('filter'); // 'active', 'resolved', or null for all

    const where: any = {};

    if (filter === 'active') {
      where.resolved = false;
      where.closeTime = { gt: new Date() };
    } else if (filter === 'resolved') {
      where.resolved = true;
    }

    const markets = await prisma.market.findMany({
      where,
      orderBy: [
        { resolved: 'asc' }, // Active markets first
        { closeTime: 'asc' }, // Soonest closing first
      ],
      include: {
        positions: {
          select: {
            id: true,
            userId: true,
            side: true,
            amount: true,
            claimed: true,
          },
        },
      },
    });

    // Calculate additional metrics for each market
    const marketsWithMetrics = markets.map(market => {
      const totalPool = market.yesPool + market.noPool;
      const yesOdds = totalPool > 0 ? market.yesPool / totalPool : 0.5;
      const noOdds = totalPool > 0 ? market.noPool / totalPool : 0.5;

      return {
        ...market,
        totalPool,
        yesOdds,
        noOdds,
        isActive: !market.resolved && new Date(market.closeTime) > new Date(),
        isClosingSoon: !market.resolved && new Date(market.closeTime).getTime() - Date.now() < 24 * 60 * 60 * 1000,
      };
    });

    return NextResponse.json(marketsWithMetrics);
  } catch (error) {
    console.error('Error fetching markets:', error);
    return NextResponse.json(
      { error: 'Failed to fetch markets' },
      { status: 500 }
    );
  }
}

// POST /api/markets - Create a new market (admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { question, closeTime, difficulty, adminAddress } = body;

    // Validation
    if (!question || !closeTime || !difficulty) {
      return NextResponse.json(
        { error: 'Missing required fields: question, closeTime, difficulty' },
        { status: 400 }
      );
    }

    if (difficulty < 1 || difficulty > 5) {
      return NextResponse.json(
        { error: 'Difficulty must be between 1 and 5' },
        { status: 400 }
      );
    }

    // TODO: Add proper admin authentication
    // For now, we'll accept any request with an adminAddress
    if (!adminAddress) {
      return NextResponse.json(
        { error: 'Admin address required' },
        { status: 401 }
      );
    }

    const market = await prisma.market.create({
      data: {
        question,
        closeTime: new Date(closeTime),
        difficulty,
        yesPool: 0,
        noPool: 0,
        resolved: false,
      },
    });

    return NextResponse.json(market, { status: 201 });
  } catch (error) {
    console.error('Error creating market:', error);
    return NextResponse.json(
      { error: 'Failed to create market' },
      { status: 500 }
    );
  }
}
