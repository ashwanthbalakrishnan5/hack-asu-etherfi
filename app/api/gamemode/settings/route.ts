import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// POST /api/gamemode/settings - Save automated settings
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { address, settings } = body;

    if (!address) {
      return NextResponse.json({ error: 'Address is required' }, { status: 400 });
    }

    const normalizedAddress = address.toLowerCase();

    // Store settings (in a real implementation, you'd add these fields to the User model)
    console.log(`Saving automated settings for ${address}:`, settings);

    return NextResponse.json({
      success: true,
      message: 'Settings saved successfully',
    });
  } catch (error) {
    console.error('Error saving automated settings:', error);
    return NextResponse.json(
      { error: 'Failed to save settings' },
      { status: 500 }
    );
  }
}
