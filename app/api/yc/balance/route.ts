import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const address = searchParams.get("address");

    if (!address) {
      return NextResponse.json({ error: "Address is required" }, { status: 400 });
    }

    // Get or create user using upsert to avoid race conditions
    const user = await prisma.user.upsert({
      where: { address: address.toLowerCase() },
      update: {}, // Don't update anything if user exists
      create: {
        address: address.toLowerCase(),
        ycBalance: 1000, // New users get 1000 YC to start playing immediately (demo mode)
        principal: 0,
        lastAccrualTime: new Date(),
      },
    });

    return NextResponse.json({
      balance: user.ycBalance,
      lastAccrualTime: user.lastAccrualTime.toISOString(),
      accruedSinceLastFetch: 0,
    });
  } catch (error) {
    console.error("Error fetching YC balance:", error);
    return NextResponse.json(
      { error: "Failed to fetch YC balance" },
      { status: 500 }
    );
  }
}
