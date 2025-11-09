import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// POST /api/positions/:id/claim - Claim winnings from a resolved market
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { userAddress } = body;

    if (!userAddress) {
      return NextResponse.json(
        { error: 'userAddress required' },
        { status: 400 }
      );
    }

    // Get position with market details
    const position = await prisma.position.findUnique({
      where: { id },
      include: {
        market: true,
      },
    });

    if (!position) {
      return NextResponse.json(
        { error: 'Position not found' },
        { status: 404 }
      );
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { address: userAddress },
    });

    if (!user || user.id !== position.userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if market is resolved
    if (!position.market.resolved) {
      return NextResponse.json(
        { error: 'Market not yet resolved' },
        { status: 400 }
      );
    }

    // Check if already claimed
    if (position.claimed) {
      return NextResponse.json(
        { error: 'Position already claimed' },
        { status: 400 }
      );
    }

    const { market } = position;
    let payout = 0;
    let won = false;
    let xpEarned = 0;

    // Calculate payout based on outcome
    if (market.outcome === 'CANCEL') {
      // Refund original amount
      payout = position.amount;
    } else if (market.outcome === position.side) {
      // User won
      won = true;
      const totalPool = market.yesPool + market.noPool;
      const winningSidePool = position.side === 'YES' ? market.yesPool : market.noPool;

      if (winningSidePool > 0) {
        // Payout = user's stake * (total pool / winning side pool)
        payout = position.amount * (totalPool / winningSidePool);
      } else {
        // Should not happen, but fallback to refund
        payout = position.amount;
      }

      // Award XP for winning (+20)
      xpEarned += 20;

      // Check for streak bonus
      const recentPositions = await prisma.position.findMany({
        where: {
          userId: user.id,
        },
        include: {
          market: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 3,
      });

      const recentWins = recentPositions.filter(
        p => p.market.resolved && p.market.outcome === p.side && p.claimed
      );

      if (recentWins.length >= 2) {
        // 3-win streak bonus
        xpEarned += 50;
      }
    } else {
      // User lost - no payout
      payout = 0;
    }

    // Update position, user balance, and stats in transaction
    const result = await prisma.$transaction(async (tx) => {
      // Mark position as claimed
      const updatedPosition = await tx.position.update({
        where: { id },
        data: { claimed: true },
      });

      // Update user
      const totalBets = user.totalBets;
      const wins = won ? user.wins + 1 : user.wins;
      const losses = won ? user.losses : user.losses + 1;
      const accuracy = totalBets > 0 ? (wins / totalBets) * 100 : 0;

      const updatedUser = await tx.user.update({
        where: { id: user.id },
        data: {
          ycBalance: { increment: payout },
          wins: won ? { increment: 1 } : undefined,
          losses: !won && market.outcome !== 'CANCEL' ? { increment: 1 } : undefined,
          accuracy,
          xp: { increment: xpEarned },
        },
      });

      return { position: updatedPosition, user: updatedUser };
    });

    return NextResponse.json({
      claimed: true,
      won,
      payout,
      newYCBalance: result.user.ycBalance,
      xpEarned,
      outcome: market.outcome,
    });
  } catch (error) {
    console.error('Error claiming position:', error);
    return NextResponse.json(
      { error: 'Failed to claim position' },
      { status: 500 }
    );
  }
}
