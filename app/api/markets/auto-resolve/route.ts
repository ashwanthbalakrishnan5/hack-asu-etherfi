import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Auto-resolve markets that have passed their close time
 * This simulates oracle-based resolution for demo purposes
 */
export async function POST() {
  try {
    const now = new Date();

    // Find markets that should be resolved
    const marketsToResolve = await prisma.market.findMany({
      where: {
        resolved: false,
        closeTime: {
          lte: now,
        },
      },
    });

    if (marketsToResolve.length === 0) {
      return NextResponse.json({
        message: "No markets to resolve",
        resolved: 0,
      });
    }

    // Resolve each market with a simulated outcome
    const resolvedMarkets = await Promise.all(
      marketsToResolve.map(async (market) => {
        // Simulate oracle outcome based on pool sizes (more realistic)
        // Favor the side with more YC slightly, but add randomness
        const totalPool = market.yesPool + market.noPool;
        const yesWeight = totalPool > 0 ? market.yesPool / totalPool : 0.5;

        // Add randomness: 60% chance favors pool size, 40% is random
        const random = Math.random();
        const outcome = random < yesWeight * 0.6 + 0.2 ? "YES" : "NO";

        // Update market
        const updated = await prisma.market.update({
          where: { id: market.id },
          data: {
            resolved: true,
            outcome,
          },
        });

        // Get all positions for this market
        const positions = await prisma.position.findMany({
          where: { marketId: market.id },
        });

        // Calculate and distribute winnings
        const winningSide = outcome;
        const winningPool = winningSide === "YES" ? market.yesPool : market.noPool;
        const losingPool = winningSide === "YES" ? market.noPool : market.yesPool;

        // Process each position
        for (const position of positions) {
          if (position.side === winningSide && !position.claimed) {
            // Calculate payout: (stake * totalPool) / winningPool
            const payout =
              winningPool > 0
                ? (position.amount * (market.yesPool + market.noPool)) / winningPool
                : position.amount;

            // Award XP to the user
            const user = await prisma.user.findUnique({
              where: { address: position.userId },
            });

            if (user) {
              const xpGain = 20; // Base XP for correct prediction
              const newXp = user.xp + xpGain;
              const newLevel = Math.floor(Math.sqrt(newXp / 100)) + 1;
              const newWins = user.wins + 1;
              const newTotalBets = user.totalBets;
              const newAccuracy = newTotalBets > 0 ? (newWins / newTotalBets) * 100 : 0;

              await prisma.user.update({
                where: { address: position.userId },
                data: {
                  xp: newXp,
                  level: newLevel,
                  wins: newWins,
                  accuracy: newAccuracy,
                },
              });
            }
          }
        }

        return updated;
      })
    );

    return NextResponse.json({
      message: `Resolved ${resolvedMarkets.length} markets`,
      resolved: resolvedMarkets.length,
      markets: resolvedMarkets.map((m) => ({
        id: m.id,
        question: m.question,
        outcome: m.outcome,
      })),
    });
  } catch (error) {
    console.error("Error auto-resolving markets:", error);
    return NextResponse.json(
      { error: "Failed to auto-resolve markets" },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Also allow GET requests for easier testing
  return POST();
}
