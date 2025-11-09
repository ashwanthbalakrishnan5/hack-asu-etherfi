import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const address = searchParams.get("address");

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

    return NextResponse.json({
      balance: user.ycBalance.toFixed(4),
      lastAccrualTime: user.lastAccrualTime.toISOString(),
      accruedSinceLastFetch: "0",
    });
  } catch (error) {
    console.error("Error fetching YC balance:", error);
    return NextResponse.json(
      { error: "Failed to fetch YC balance" },
      { status: 500 }
    );
  }
}
