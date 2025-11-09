import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import Anthropic from "@anthropic-ai/sdk";
import { checkAndAwardAchievements } from "@/lib/achievements";

const prisma = new PrismaClient();

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { questId, address } = await request.json();

    if (!questId || !address) {
      return NextResponse.json(
        { error: "Quest ID and address are required" },
        { status: 400 }
      );
    }

    // Get the quest
    const quest = await prisma.quest.findUnique({
      where: { id: questId },
    });

    if (!quest) {
      return NextResponse.json({ error: "Quest not found" }, { status: 404 });
    }

    // Verify user owns this quest
    const user = await prisma.user.findUnique({
      where: { address },
    });

    if (!user || quest.userId !== user.id) {
      return NextResponse.json(
        { error: "Quest does not belong to this user" },
        { status: 403 }
      );
    }

    // Check if quest is accepted and has a market
    if (!quest.accepted || !quest.marketId) {
      return NextResponse.json(
        { error: "Quest not accepted or no market linked" },
        { status: 400 }
      );
    }

    // Get the market
    const market = await prisma.market.findUnique({
      where: { id: quest.marketId },
    });

    if (!market) {
      return NextResponse.json({ error: "Market not found" }, { status: 404 });
    }

    // Check if market is resolved
    if (!market.resolved || !market.outcome) {
      return NextResponse.json(
        { error: "Market not yet resolved" },
        { status: 400 }
      );
    }

    // Get user's position for this market
    const position = await prisma.position.findFirst({
      where: {
        userId: user.id,
        marketId: market.id,
      },
    });

    if (!position) {
      return NextResponse.json(
        { error: "No position found for this quest" },
        { status: 404 }
      );
    }

    // Determine if user won
    const won = position.side === market.outcome;

    // Get user stats for context
    const accuracy = user.totalBets > 0 ? (user.wins / user.totalBets) * 100 : 0;

    // Generate feedback using Claude
    const prompt = `You are an adaptive Game Master providing educational feedback on a prediction game quest.

User Stats:
- Total Bets: ${user.totalBets}
- Wins: ${user.wins}
- Losses: ${user.losses}
- Accuracy: ${accuracy.toFixed(1)}%
- Level: ${user.level}

Quest Details:
- Question: ${quest.question}
- Difficulty: ${quest.difficulty}/5
- Learning Outcome Goal: ${quest.learningOutcome}
- User bet: ${position.side}
- Actual outcome: ${market.outcome}
- Result: ${won ? "WON" : "LOST"}

Task: Provide personalized educational feedback to help the user improve their prediction skills.

Rules:
1. Return ONLY valid JSON (no other text)
2. Be encouraging but honest
3. If they won: Explain what they did right, what patterns to look for
4. If they lost: Explain what might have been missed, what to consider next time
5. Focus on educational value, not financial advice
6. Keep feedback constructive and specific to this quest
7. Suggest one micro-action they can take to improve

Return this exact JSON structure:
{
  "feedback": "One paragraph (3-5 sentences) analyzing their decision and outcome",
  "suggestion": "One actionable tip or micro-quest idea for future improvement"
}`;

    const message = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1000,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const responseText = message.content[0].type === "text" ? message.content[0].text : "";

    // Parse Claude's response
    let feedbackData: { feedback: string; suggestion: string };
    try {
      feedbackData = JSON.parse(responseText);
    } catch (parseError) {
      console.error("Failed to parse Claude response:", responseText);
      return NextResponse.json(
        { error: "Invalid response format from AI" },
        { status: 500 }
      );
    }

    // Update quest with feedback and mark as completed
    const updatedQuest = await prisma.quest.update({
      where: { id: questId },
      data: {
        completed: true,
        outcome: market.outcome,
        feedback: feedbackData.feedback,
        suggestion: feedbackData.suggestion,
      },
    });

    // Award XP for completing a quest and increment completedQuests
    await prisma.user.update({
      where: { id: user.id },
      data: {
        xp: user.xp + 30, // +30 XP for completing a Claude quest
        completedQuests: { increment: 1 },
      },
    });

    // Check achievements (for Quest Master)
    const newAchievements = await checkAndAwardAchievements({
      userId: user.id,
      userAddress: address,
    });

    return NextResponse.json(
      {
        quest: updatedQuest,
        feedback: feedbackData,
        newAchievements,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error generating quest feedback:", error);
    return NextResponse.json(
      { error: "Failed to generate feedback" },
      { status: 500 }
    );
  }
}
