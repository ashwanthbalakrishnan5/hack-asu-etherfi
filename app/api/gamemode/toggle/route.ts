import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// POST /api/gamemode/toggle - Toggle automated mode
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { address, enabled, settings } = body;

    if (!address) {
      return NextResponse.json({ error: 'Address is required' }, { status: 400 });
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

    // Store automated settings in user metadata (you may want to add these fields to schema)
    // For now, we'll just log the toggle
    console.log(`Automated mode ${enabled ? 'enabled' : 'disabled'} for ${address}`);
    console.log('Settings:', settings);

    if (enabled) {
      // Start automated betting process
      // This would trigger Claude to start researching and placing bets
      // Implementation depends on your architecture (background job, webhook, etc.)
      console.log('Starting automated betting process...');
    } else {
      // Stop automated betting
      console.log('Stopping automated betting process...');
    }

    return NextResponse.json({
      success: true,
      enabled,
      message: enabled
        ? 'Automated mode enabled. Claude will start researching markets and placing bets.'
        : 'Automated mode disabled.',
    });
  } catch (error) {
    console.error('Error toggling automated mode:', error);
    return NextResponse.json(
      { error: 'Failed to toggle automated mode' },
      { status: 500 }
    );
  }
}
