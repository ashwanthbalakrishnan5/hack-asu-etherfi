import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const SIMULATED_APR = parseFloat(process.env.NEXT_PUBLIC_SIMULATED_APR || "5") / 100;
const SECONDS_PER_YEAR = 31536000;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { address } = body;

    if (!address) {
      return NextResponse.json({ error: "Address is required" }, { status: 400 });
    }

    // Get or create user
    let user = await prisma.user.findUnique({
      where: { address: address.toLowerCase() },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          address: address.toLowerCase(),
          ycBalance: 0,
          principal: 0,
          lastAccrualTime: new Date(),
        },
      });
    }

    // Calculate time elapsed since last accrual
    const now = new Date();
    const lastAccrualTime = new Date(user.lastAccrualTime);
    const timeElapsedSeconds = (now.getTime() - lastAccrualTime.getTime()) / 1000;

    // Calculate accrued YC based on principal
    // Formula: principal * APR * timeElapsed / SECONDS_PER_YEAR
    const accruedYC = user.principal * SIMULATED_APR * (timeElapsedSeconds / SECONDS_PER_YEAR);
    const newYCBalance = user.ycBalance + accruedYC;

    // Update user
    const updatedUser = await prisma.user.update({
      where: { address: address.toLowerCase() },
      data: {
        ycBalance: newYCBalance,
        lastAccrualTime: now,
      },
    });

    return NextResponse.json({
      balance: updatedUser.ycBalance.toFixed(4),
      lastAccrualTime: updatedUser.lastAccrualTime.toISOString(),
      accruedSinceLastFetch: accruedYC.toFixed(4),
    });
  } catch (error) {
    console.error("Error accruing YC:", error);
    return NextResponse.json(
      { error: "Failed to accrue YC" },
      { status: 500 }
    );
  }
}
