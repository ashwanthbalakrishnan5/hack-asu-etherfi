import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

// Simple in-memory cache (5 minutes TTL)
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Initialize Anthropic client
const anthropic = process.env.CLAUDE_API_KEY
  ? new Anthropic({ apiKey: process.env.CLAUDE_API_KEY })
  : null;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { question, difficulty, userStats } = body;

    if (!question) {
      return NextResponse.json(
        { error: 'Question is required' },
        { status: 400 }
      );
    }

    // Check cache first
    const cacheKey = `hint:${question}`;
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return NextResponse.json(cached.data);
    }

    // If no Anthropic API key, return mock data
    if (!anthropic) {
      console.warn('CLAUDE_API_KEY not set, returning mock probability hint');
      const mockHint = {
        probability: 0.5 + (Math.random() * 0.3 - 0.15), // Random between 0.35-0.65
        rationale: 'This is a demo response. Configure CLAUDE_API_KEY to get real Claude insights.',
        tip: 'Consider researching recent trends and data before placing your bet.',
      };
      return NextResponse.json(mockHint);
    }

    // Construct prompt for Claude
    const prompt = `You are an educational AI assistant helping users learn about prediction markets and probabilistic thinking. Analyze the following prediction market question and provide a probability estimate with educational context.

Question: "${question}"
Difficulty: ${difficulty || 'Unknown'}

IMPORTANT: You must respond with ONLY valid JSON in exactly this format, with no additional text:
{
  "probability": <number between 0 and 1>,
  "rationale": "<one concise sentence explaining your probability estimate>",
  "tip": "<one educational sentence about how to think about this type of prediction>"
}

Rules:
- Do NOT provide financial advice
- Focus on educational insights and critical thinking
- Keep rationale and tip to ONE sentence each
- Base probability on available public information and logical reasoning
- Acknowledge uncertainty where appropriate
- Encourage users to do their own research

Respond with only the JSON object, nothing else.`;

    // Call Claude API
    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 300,
      temperature: 0.7,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    // Extract JSON from response
    const responseText = message.content[0].type === 'text'
      ? message.content[0].text
      : '';

    // Try to parse JSON from response
    let hint;
    try {
      // Remove any markdown code blocks if present
      const jsonText = responseText
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();

      hint = JSON.parse(jsonText);

      // Validate structure
      if (
        typeof hint.probability !== 'number' ||
        hint.probability < 0 ||
        hint.probability > 1 ||
        typeof hint.rationale !== 'string' ||
        typeof hint.tip !== 'string'
      ) {
        throw new Error('Invalid hint structure');
      }
    } catch (parseError) {
      console.error('Failed to parse Claude response:', responseText);
      // Fallback to mock data if parsing fails
      hint = {
        probability: 0.5,
        rationale: 'Unable to generate probability estimate at this time.',
        tip: 'Consider researching multiple sources before making your prediction.',
      };
    }

    // Cache the result
    cache.set(cacheKey, { data: hint, timestamp: Date.now() });

    // Clean up old cache entries (simple cleanup)
    if (cache.size > 100) {
      const now = Date.now();
      for (const [key, value] of cache.entries()) {
        if (now - value.timestamp > CACHE_TTL) {
          cache.delete(key);
        }
      }
    }

    return NextResponse.json(hint);
  } catch (error) {
    console.error('Error getting probability hint:', error);

    // Return graceful fallback instead of error
    return NextResponse.json({
      probability: 0.5,
      rationale: 'Unable to generate probability estimate at this time.',
      tip: 'Do your own research and trust your analysis.',
    });
  }
}
