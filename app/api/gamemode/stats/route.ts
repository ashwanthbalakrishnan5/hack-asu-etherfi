import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';


// GET /api/gamemode/stats - Get automated betting stats
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address');

    if (!address) {
      return NextResponse.json({ error: 'Address is required' }, { status: 400 });
    }

    const normalizedAddress = address.toLowerCase();

    // Get user
    const user = await prisma.user.findUnique({
      where: { address: normalizedAddress },
    });

    if (!user) {
      return NextResponse.json({
        activeBets: 0,
        totalYcDeployed: 0,
        estimatedReturn: 0,
      });
    }

    // Get active positions (unclaimed bets on unresolved markets)
    const activePositions = await prisma.position.findMany({
      where: {
        userId: user.id,
        claimed: false,
      },
      include: {
        market: true,
      },
    });

    // Filter for unresolved markets
    const unresolvedPositions = activePositions.filter(p => !p.market.resolved);

    // Calculate stats
    const totalYcDeployed = unresolvedPositions.reduce((sum, p) => sum + p.amount, 0);

    // Estimate return based on current pools
    let estimatedReturn = 0;
    unresolvedPositions.forEach(position => {
      const market = position.market;
      const totalPool = market.yesPool + market.noPool;
      const sidePool = position.side === 'YES' ? market.yesPool : market.noPool;

      if (sidePool > 0) {
        const expectedPayout = (position.amount * totalPool) / sidePool;
        estimatedReturn += (expectedPayout - position.amount);
      }
    });

    return NextResponse.json({
      activeBets: unresolvedPositions.length,
      totalYcDeployed: Math.round(totalYcDeployed),
      estimatedReturn: Math.round(estimatedReturn),
    });
  } catch (error) {
    console.error('Error fetching automated stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
