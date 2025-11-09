import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';


/**
 * POST /api/demo/setup
 * Initialize demo mode for testing without real weETH
 * - Creates/updates user with demo YC balance and principal
 * - Seeds markets if needed
 * - Returns user data ready for testing
 */
export async function POST(request: NextRequest) {
  try {
    const { address } = await request.json();

    if (!address) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      );
    }

    // Check if markets exist, if not seed them
    const marketCount = await prisma.market.count();

    if (marketCount === 0) {
      // Seed demo markets
      const demoMarkets = [
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
      ];

      for (const market of demoMarkets) {
        const closeTime = new Date();
        closeTime.setDate(closeTime.getDate() + market.daysUntilClose);

        await prisma.market.create({
          data: {
            question: market.question,
            closeTime,
            difficulty: market.difficulty,
            yesPool: Math.random() * 500 + 100, // Random pool sizes for realism
            noPool: Math.random() * 500 + 100,
            resolved: false,
          },
        });
      }
    }

    // Create or update user with demo balances
    const user = await prisma.user.upsert({
      where: { address },
      create: {
        address,
        ycBalance: 1000, // Start with 1000 YC for testing
        principal: 1.5, // Simulate 1.5 weETH deposited
        xp: 0,
        level: 1,
        accuracy: 0,
        totalBets: 0,
        wins: 0,
        losses: 0,
        streakCount: 0,
        ycSpent: 0,
        ycWon: 0,
        yieldEfficiency: 0,
        wisdomIndex: 0,
        lastAccrualTime: new Date(),
        showOnLeaderboard: true,
      },
      update: {
        // If user exists, just give them more YC for testing
        ycBalance: { increment: 500 },
        principal: Math.max(1.5, 0), // Ensure at least 1.5 principal
      },
    });

    return NextResponse.json({
      message: 'Demo mode initialized successfully! You can now test the game.',
      user: {
        address: user.address,
        ycBalance: user.ycBalance,
        principal: user.principal,
        level: user.level,
        xp: user.xp,
      },
      instructions: [
        '✓ Your account has been credited with demo YC (Yield Credits)',
        '✓ Markets have been seeded for testing',
        '✓ You can now place bets, accept quests, and explore the game',
        '✓ No real weETH required - this is demo mode!',
      ],
    }, { status: 200 });
  } catch (error) {
    console.error('Error setting up demo:', error);
    return NextResponse.json(
      { error: 'Failed to initialize demo mode' },
      { status: 500 }
    );
  }
}
