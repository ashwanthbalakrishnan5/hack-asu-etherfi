import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import Anthropic from "@anthropic-ai/sdk";

const prisma = new PrismaClient();

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

interface QuestData {
  title: string;
  question: string;
  suggestedStake: number;
  difficulty: number;
  learningOutcome: string;
  closeTime: string;
}

export async function POST(request: NextRequest) {
  try {
    const { address } = await request.json();

    if (!address) {
      return NextResponse.json(
        { error: "Address is required" },
        { status: 400 }
      );
    }

    const normalizedAddress = address.toLowerCase();

    // Get user stats for adaptive quest generation
    const user = await prisma.user.findUnique({
      where: { address: normalizedAddress },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Calculate user profile metrics
    const accuracy = user.totalBets > 0 ? (user.wins / user.totalBets) * 100 : 0;
    const avgStake = user.ycBalance > 0 ? user.ycBalance / Math.max(user.totalBets, 1) : 10;

    // Generate quests using Claude
    const prompt = `You are an adaptive Game Master for a prediction game. Generate exactly 3 personalized quests for a user with the following stats:
- Total Bets: ${user.totalBets}
- Wins: ${user.wins}
- Losses: ${user.losses}
- Accuracy: ${accuracy.toFixed(1)}%
- Level: ${user.level}
- Average YC Stake: ${avgStake.toFixed(1)}

Rules:
1. Return ONLY valid JSON (no other text)
2. Adapt difficulty based on accuracy:
   - If accuracy > 70%: Include harder quests (difficulty 4-5)
   - If accuracy < 50%: Include easier quests (difficulty 1-3)
   - Otherwise: Mix of difficulties (2-4)
3. Vary topics: finance, sports, politics, technology, culture, science
4. Set closeTime between 1-7 days from now
5. Suggest stakes based on user's average (±30%)
6. Each quest should teach a specific prediction skill
7. NO financial advice - only educational hints
8. Make questions specific and verifiable

Return this exact JSON structure:
{
  "quests": [
    {
      "title": "Brief catchy title",
      "question": "Clear YES/NO question",
      "suggestedStake": number (YC amount),
      "difficulty": 1-5,
      "learningOutcome": "One sentence explaining what skill this practices",
      "closeTime": "ISO 8601 timestamp"
    }
  ]
}

Current date: ${new Date().toISOString()}`;

    const message = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 2000,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const responseText = message.content[0].type === "text" ? message.content[0].text : "";

    // Parse Claude's response
    let questsData: { quests: QuestData[] };
    try {
      questsData = JSON.parse(responseText);
    } catch (parseError) {
      console.error("Failed to parse Claude response:", responseText);
      return NextResponse.json(
        { error: "Invalid response format from AI" },
        { status: 500 }
      );
    }

    // Validate we got exactly 3 quests
    if (!questsData.quests || questsData.quests.length !== 3) {
      console.error("Invalid number of quests:", questsData);
      return NextResponse.json(
        { error: "Expected 3 quests from AI" },
        { status: 500 }
      );
    }

    // Save quests to database
    const savedQuests = await Promise.all(
      questsData.quests.map((quest) =>
        prisma.quest.create({
          data: {
            userId: address.toLowerCase(),
            title: quest.title,
            question: quest.question,
            suggestedStake: quest.suggestedStake,
            difficulty: quest.difficulty,
            learningOutcome: quest.learningOutcome,
            closeTime: new Date(quest.closeTime),
          },
        })
      )
    );

    return NextResponse.json({ quests: savedQuests }, { status: 200 });
  } catch (error) {
    console.error("Error generating quests:", error);
    return NextResponse.json(
      { error: "Failed to generate quests" },
      { status: 500 }
    );
  }
}
