import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// PATCH /api/markets/:id/resolve - Resolve a market with outcome
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { outcome, adminAddress } = body;

    // Validation
    if (!outcome || !['YES', 'NO', 'CANCEL'].includes(outcome)) {
      return NextResponse.json(
        { error: 'Invalid outcome. Must be YES, NO, or CANCEL' },
        { status: 400 }
      );
    }

    // TODO: Add proper admin authentication
    if (!adminAddress) {
      return NextResponse.json(
        { error: 'Admin address required' },
        { status: 401 }
      );
    }

    // Check if market exists
    const market = await prisma.market.findUnique({
      where: { id },
      include: {
        positions: true,
      },
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

    // Resolve the market
    const updatedMarket = await prisma.market.update({
      where: { id },
      data: {
        resolved: true,
        outcome,
      },
    });

    // If cancelled, refund all positions (YC will be returned via claim endpoint)
    // For YES/NO outcomes, winners can claim via the positions API

    return NextResponse.json({
      market: updatedMarket,
      message: `Market resolved with outcome: ${outcome}`,
    });
  } catch (error) {
    console.error('Error resolving market:', error);
    return NextResponse.json(
      { error: 'Failed to resolve market' },
      { status: 500 }
    );
  }
}
