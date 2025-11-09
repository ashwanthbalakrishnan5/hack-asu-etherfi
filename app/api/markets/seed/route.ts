import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const DEMO_MARKETS = [
  {
    question: 'Will Bitcoin reach $100,000 by end of 2025?',
    difficulty: 3,
    daysUntilClose: 30,
  },
  {
    question: 'Will Ethereum transition to full rollup-centric roadmap in 2025?',
    difficulty: 4,
    daysUntilClose: 45,
  },
  {
    question: 'Will AI agents manage over $1B in DeFi assets by 2026?',
    difficulty: 5,
    daysUntilClose: 60,
  },
  {
    question: 'Will the S&P 500 reach 7000 before end of 2025?',
    difficulty: 2,
    daysUntilClose: 20,
  },
  {
    question: 'Will a prediction market platform reach 1M daily active users in 2025?',
    difficulty: 4,
    daysUntilClose: 50,
  },
  {
    question: 'Will OpenAI release GPT-5 in Q1 2025?',
    difficulty: 3,
    daysUntilClose: 15,
  },
  {
    question: 'Will Tesla deliver over 500k Cybertrucks in 2025?',
    difficulty: 2,
    daysUntilClose: 25,
  },
  {
    question: 'Will the Fed cut interest rates at least 3 times in 2025?',
    difficulty: 3,
    daysUntilClose: 35,
  },
  {
    question: 'Will a new L1 blockchain enter top 10 by market cap in 2025?',
    difficulty: 4,
    daysUntilClose: 40,
  },
  {
    question: 'Will global inflation average below 3% in major economies by end of 2025?',
    difficulty: 3,
    daysUntilClose: 30,
  },
];

// POST /api/markets/seed - Seed demo markets (admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { adminAddress } = body;

    // TODO: Add proper admin authentication
    if (!adminAddress) {
      return NextResponse.json(
        { error: 'Admin address required' },
        { status: 401 }
      );
    }

    // Check if markets already exist
    const existingCount = await prisma.market.count();

    if (existingCount > 0) {
      return NextResponse.json(
        { error: `Database already has ${existingCount} markets. Clear them first if you want to reseed.`, count: existingCount },
        { status: 400 }
      );
    }

    // Create all demo markets
    const createdMarkets = [];

    for (const market of DEMO_MARKETS) {
      const closeTime = new Date();
      closeTime.setDate(closeTime.getDate() + market.daysUntilClose);

      const created = await prisma.market.create({
        data: {
          question: market.question,
          closeTime,
          difficulty: market.difficulty,
          yesPool: 0,
          noPool: 0,
          resolved: false,
        },
      });

      createdMarkets.push(created);
    }

    return NextResponse.json({
      message: `Successfully seeded ${createdMarkets.length} demo markets`,
      markets: createdMarkets,
    }, { status: 201 });
  } catch (error) {
    console.error('Error seeding markets:', error);
    return NextResponse.json(
      { error: 'Failed to seed markets' },
      { status: 500 }
    );
  }
}

// DELETE /api/markets/seed - Clear all markets (admin only, for development)
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { adminAddress } = body;

    if (!adminAddress) {
      return NextResponse.json(
        { error: 'Admin address required' },
        { status: 401 }
      );
    }

    // Delete all positions first (due to foreign key constraint)
    await prisma.position.deleteMany({});

    // Delete all markets
    const result = await prisma.market.deleteMany({});

    return NextResponse.json({
      message: `Successfully deleted ${result.count} markets`,
      count: result.count,
    });
  } catch (error) {
    console.error('Error clearing markets:', error);
    return NextResponse.json(
      { error: 'Failed to clear markets' },
      { status: 500 }
    );
  }
}
