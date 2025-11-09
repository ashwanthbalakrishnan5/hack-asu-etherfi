import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { address, principal } = body;

    if (!address || principal === undefined) {
      return NextResponse.json(
        { error: "Address and principal are required" },
        { status: 400 }
      );
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
          principal: parseFloat(principal),
          lastAccrualTime: new Date(),
        },
      });
    } else {
      // Update principal
      user = await prisma.user.update({
        where: { address: address.toLowerCase() },
        data: {
          principal: parseFloat(principal),
        },
      });
    }

    return NextResponse.json({
      success: true,
      principal: user.principal,
    });
  } catch (error) {
    console.error("Error updating principal:", error);
    return NextResponse.json(
      { error: "Failed to update principal" },
      { status: 500 }
    );
  }
}
