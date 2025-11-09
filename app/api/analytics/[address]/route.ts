import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';


/**
 * GET /api/analytics/:address
 * Get portfolio analytics for a user
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ address: string }> }
) {
  try {
    const { address } = await params;

    // Get user
    const user = await prisma.user.findUnique({
      where: { address },
    });

    if (!user) {
      return NextResponse.json(
        {
          timeSeries: [],
          allocation: { yes: 0, no: 0 },
          summary: { totalSpent: 0, totalWon: 0, netChange: 0 },
          insights: [],
        },
        { status: 200 }
      );
    }

    // Get positions to calculate allocation
    const positions = await prisma.position.findMany({
      where: { userId: user.id },
      include: { market: true },
    });

    // Calculate allocation
    let yesTotal = 0;
    let noTotal = 0;

    positions.forEach((position) => {
      if (position.side === 'YES') {
        yesTotal += position.amount;
      } else {
        noTotal += position.amount;
      }
    });

    // Generate time series data (mock for demo - in production, track daily snapshots)
    const now = new Date();
    const timeSeries = [];

    // Create 7 days of data
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);

      // Simulate principal staying constant and YC growing
      const principalValue = user.principal;
      const ycValue = user.ycBalance - (user.ycBalance * i * 0.1); // Simulate growth

      timeSeries.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        principal: parseFloat(principalValue.toFixed(2)),
        yc: Math.max(0, parseFloat(ycValue.toFixed(2))),
      });
    }

    // Summary
    const summary = {
      totalSpent: user.ycSpent,
      totalWon: user.ycWon,
      netChange: user.ycWon - user.ycSpent,
    };

    // Generate AI insights based on user behavior
    const insights = generateInsights(user, positions);

    return NextResponse.json({
      timeSeries,
      allocation: {
        yes: yesTotal,
        no: noTotal,
      },
      summary,
      insights,
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}

function generateInsights(
  user: any,
  positions: any[]
): string[] {
  const insights: string[] = [];

  // Check for bias
  const yesBets = positions.filter((p) => p.side === 'YES').length;
  const noBets = positions.filter((p) => p.side === 'NO').length;
  const totalBets = yesBets + noBets;

  if (totalBets >= 5) {
    const yesRatio = yesBets / totalBets;
    if (yesRatio > 0.7) {
      insights.push(
        'You tend to favor YES bets (optimistic bias). Consider diversifying your predictions to balance your portfolio.'
      );
    } else if (yesRatio < 0.3) {
      insights.push(
        'You tend to favor NO bets (pessimistic bias). Consider evaluating if this aligns with actual probabilities.'
      );
    } else {
      insights.push(
        'Good balance between YES and NO bets! This diversification helps manage risk.'
      );
    }
  }

  // Check accuracy and suggest improvement
  if (user.totalBets >= 5) {
    if (user.accuracy < 50) {
      insights.push(
        'Your accuracy is below 50%. Consider taking more time to research before placing bets, or try Claude\'s probability hints.'
      );
    } else if (user.accuracy > 70) {
      insights.push(
        'Excellent accuracy! Consider taking on harder difficulty markets to maximize your YC earnings.'
      );
    }
  }

  // Check stake consistency
  if (positions.length >= 5) {
    const stakes = positions.map((p) => p.amount);
    const avgStake = stakes.reduce((a, b) => a + b, 0) / stakes.length;
    const maxStake = Math.max(...stakes);

    if (maxStake > avgStake * 3) {
      insights.push(
        'You have significant variance in your bet sizes. Consider setting a maximum stake limit to manage risk better.'
      );
    }
  }

  // If no specific insights, provide general tips
  if (insights.length === 0) {
    if (user.totalBets < 5) {
      insights.push(
        'Place more bets to unlock personalized insights about your prediction strategy!'
      );
    } else {
      insights.push(
        'Keep up the good work! Your betting strategy looks balanced and thoughtful.'
      );
    }
  }

  return insights.slice(0, 2); // Return max 2 insights
}
