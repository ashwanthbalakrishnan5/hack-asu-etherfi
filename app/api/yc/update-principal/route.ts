import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkAndAwardAchievements } from "@/lib/achievements";

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

    const newPrincipal = parseFloat(principal);

    // Get or create user
    let user = await prisma.user.findUnique({
      where: { address: address.toLowerCase() },
    });

    const isDeposit = !user || newPrincipal > user.principal;
    const isWithdrawal = user && newPrincipal < user.principal;

    if (!user) {
      user = await prisma.user.create({
        data: {
          address: address.toLowerCase(),
          ycBalance: 0,
          principal: newPrincipal,
          lastAccrualTime: new Date(),
          firstDepositAt: new Date(),
        },
      });

      // Award XP for first deposit (+15)
      await prisma.user.update({
        where: { id: user.id },
        data: { xp: { increment: 15 } },
      });
    } else {
      // Update principal and track deposit/withdrawal times
      const updateData: any = {
        principal: newPrincipal,
      };

      if (isDeposit && !user.firstDepositAt) {
        updateData.firstDepositAt = new Date();
        updateData.xp = { increment: 15 }; // Award XP for first deposit
      }

      if (isWithdrawal && !user.firstWithdrawAt) {
        updateData.firstWithdrawAt = new Date();
        updateData.xp = { increment: 10 }; // Award XP for first withdrawal
      }

      user = await prisma.user.update({
        where: { address: address.toLowerCase() },
        data: updateData,
      });
    }

    // Check achievements (for Whale and Diamond Hands)
    const newAchievements = await checkAndAwardAchievements({
      userId: user.id,
      userAddress: address.toLowerCase(),
    });

    return NextResponse.json({
      success: true,
      principal: user.principal,
      newAchievements,
    });
  } catch (error) {
    console.error("Error updating principal:", error);
    return NextResponse.json(
      { error: "Failed to update principal" },
      { status: 500 }
    );
  }
}
