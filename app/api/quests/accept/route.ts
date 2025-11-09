import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";


export async function POST(request: NextRequest) {
  try {
    const { questId, address } = await request.json();

    if (!questId || !address) {
      return NextResponse.json(
        { error: "Quest ID and address are required" },
        { status: 400 }
      );
    }

    const normalizedAddress = address.toLowerCase();

    // Get the quest
    const quest = await prisma.quest.findUnique({
      where: { id: questId },
    });

    if (!quest) {
      return NextResponse.json({ error: "Quest not found" }, { status: 404 });
    }

    // Check if quest belongs to the user
    const user = await prisma.user.findUnique({
      where: { address: normalizedAddress },
    });

    if (!user || quest.userId !== user.id) {
      return NextResponse.json(
        { error: "Quest does not belong to this user" },
        { status: 403 }
      );
    }

    // Check if quest is already accepted
    if (quest.accepted) {
      return NextResponse.json(
        { error: "Quest already accepted" },
        { status: 400 }
      );
    }

    // Create or find a market for this quest
    // First check if a market with the same question already exists
    let market = await prisma.market.findFirst({
      where: {
        question: quest.question,
        resolved: false,
      },
    });

    // If no market exists, create one
    if (!market) {
      market = await prisma.market.create({
        data: {
          question: quest.question,
          closeTime: quest.closeTime,
          difficulty: quest.difficulty,
          yesPool: 0,
          noPool: 0,
          resolved: false,
        },
      });
    }

    // Update quest to mark as accepted and link to market
    const updatedQuest = await prisma.quest.update({
      where: { id: questId },
      data: {
        accepted: true,
        marketId: market.id,
      },
    });

    return NextResponse.json(
      {
        quest: updatedQuest,
        market,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error accepting quest:", error);
    return NextResponse.json(
      { error: "Failed to accept quest" },
      { status: 500 }
    );
  }
}
