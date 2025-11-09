import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';


// GET /api/leaderboard - Get leaderboard data
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type') || 'accuracy';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search');

    const skip = (page - 1) * limit;

    // Minimum participation threshold
    const minBets = 10;

    // Build where clause
    let whereClause: any = {
      totalBets: { gte: minBets },
      showOnLeaderboard: true,
    };

    // Add search filter if provided
    if (search) {
      whereClause.OR = [
        { address: { contains: search, mode: 'insensitive' } },
        { displayName: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Determine sort order based on type
    let orderBy: any;
    switch (type) {
      case 'accuracy':
        orderBy = { accuracy: 'desc' };
        break;
      case 'wisdom':
        orderBy = { wisdomIndex: 'desc' };
        break;
      case 'quests':
        orderBy = { completedQuests: 'desc' };
        break;
      default:
        orderBy = { accuracy: 'desc' };
    }

    // Get total count for pagination
    const total = await prisma.user.count({ where: whereClause });

    // Get users
    const users = await prisma.user.findMany({
      where: whereClause,
      orderBy,
      skip,
      take: limit,
      select: {
        address: true,
        displayName: true,
        accuracy: true,
        wisdomIndex: true,
        completedQuests: true,
        totalBets: true,
        wins: true,
        losses: true,
        xp: true,
        level: true,
      },
    });

    // Add rank to each user
    const rankedUsers = users.map((user, index) => ({
      ...user,
      rank: skip + index + 1,
    }));

    return NextResponse.json({
      users: rankedUsers,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard' },
      { status: 500 }
    );
  }
}
