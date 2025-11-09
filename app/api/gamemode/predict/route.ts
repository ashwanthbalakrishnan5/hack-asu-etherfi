import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import Anthropic from '@anthropic-ai/sdk';

const prisma = new PrismaClient();

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// POST /api/gamemode/predict - Automated prediction and betting
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { address, marketId, riskLevel = 'medium' } = body;

    if (!address || !marketId) {
      return NextResponse.json(
        { error: 'Address and marketId are required' },
        { status: 400 }
      );
    }

    const normalizedAddress = address.toLowerCase();

    // Get user and market
    const user = await prisma.user.findUnique({
      where: { address: normalizedAddress },
    });

    const market = await prisma.market.findUnique({
      where: { id: marketId },
    });

    if (!user || !market) {
      return NextResponse.json(
        { error: 'User or market not found' },
        { status: 404 }
      );
    }

    if (market.resolved) {
      return NextResponse.json(
        { error: 'Market is already resolved' },
        { status: 400 }
      );
    }

    // Check if user has enough YC
    if (user.ycBalance <= 0) {
      return NextResponse.json(
        { error: 'Insufficient YC balance' },
        { status: 400 }
      );
    }

    // Call Claude to research and make prediction
    const prompt = `You are an AI prediction market analyst. Research the following question and provide a detailed analysis:

Question: ${market.question}
Close Time: ${market.closeTime}
Difficulty: ${market.difficulty}/5

Your task:
1. Analyze the question and identify key factors that would influence the outcome
2. Consider recent trends, data, and information that might be relevant
3. Provide a prediction (YES or NO) with a confidence level (0-100%)
4. Explain your reasoning in 2-3 sentences

Risk Level: ${riskLevel}
${riskLevel === 'low' ? 'Only recommend bets with >70% confidence' : ''}
${riskLevel === 'medium' ? 'Recommend bets with >60% confidence' : ''}
${riskLevel === 'high' ? 'Recommend bets with >50% confidence' : ''}

Return your analysis in the following JSON format only:
{
  "prediction": "YES" or "NO",
  "confidence": 0-100,
  "reasoning": "brief explanation",
  "shouldBet": true or false,
  "suggestedAmount": number (in YC, based on risk level and confidence)
}`;

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    // Parse Claude's response
    const responseText = message.content[0].type === 'text' ? message.content[0].text : '';

    // Extract JSON from response (handle markdown code blocks)
    let analysis;
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('Error parsing Claude response:', responseText);
      return NextResponse.json(
        { error: 'Failed to parse prediction analysis' },
        { status: 500 }
      );
    }

    // Validate and cap the suggested amount
    const maxAmount = Math.min(
      user.ycBalance * 0.2, // Max 20% of balance per bet
      riskLevel === 'low' ? 50 : riskLevel === 'medium' ? 100 : 200
    );
    const suggestedAmount = Math.min(analysis.suggestedAmount || 50, maxAmount);

    // If Claude recommends betting, place the bet automatically
    if (analysis.shouldBet && analysis.confidence >= 50) {
      // Check balance again
      if (user.ycBalance < suggestedAmount) {
        return NextResponse.json({
          ...analysis,
          placed: false,
          reason: 'Insufficient YC balance',
        });
      }

      // Place the bet
      const totalPool = market.yesPool + market.noPool;
      const sidePool = analysis.prediction === 'YES' ? market.yesPool : market.noPool;
      const expectedPayout = sidePool > 0 ? (suggestedAmount * (totalPool + suggestedAmount)) / (sidePool + suggestedAmount) : suggestedAmount * 2;

      // Create position
      await prisma.position.create({
        data: {
          userId: user.id,
          marketId: market.id,
          side: analysis.prediction,
          amount: suggestedAmount,
        },
      });

      // Update user balance
      await prisma.user.update({
        where: { id: user.id },
        data: {
          ycBalance: user.ycBalance - suggestedAmount,
          ycSpent: user.ycSpent + suggestedAmount,
          totalBets: user.totalBets + 1,
        },
      });

      // Update market pools
      await prisma.market.update({
        where: { id: market.id },
        data: {
          yesPool: analysis.prediction === 'YES' ? market.yesPool + suggestedAmount : market.yesPool,
          noPool: analysis.prediction === 'NO' ? market.noPool + suggestedAmount : market.noPool,
        },
      });

      // Award XP for placing bet
      await prisma.user.update({
        where: { id: user.id },
        data: {
          xp: user.xp + 10,
        },
      });

      return NextResponse.json({
        ...analysis,
        placed: true,
        amount: suggestedAmount,
        expectedPayout,
        marketQuestion: market.question,
      });
    } else {
      return NextResponse.json({
        ...analysis,
        placed: false,
        reason: analysis.shouldBet ? 'Confidence too low' : 'Not recommended',
      });
    }
  } catch (error) {
    console.error('Error in automated prediction:', error);
    return NextResponse.json(
      { error: 'Failed to make automated prediction' },
      { status: 500 }
    );
  }
}
