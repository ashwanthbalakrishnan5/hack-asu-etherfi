import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data
  await prisma.achievement.deleteMany();
  await prisma.quest.deleteMany();
  await prisma.position.deleteMany();
  await prisma.market.deleteMany();
  await prisma.user.deleteMany();

  console.log('✅ Cleared existing data');

  // Create demo users with varying stats
  const demoUsers = [
    {
      address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1',
      displayName: 'Oracle Master',
      ycBalance: 2250.5,
      principal: 5.0,
      xp: 2500,
      level: 5,
      accuracy: 78.5,
      totalBets: 45,
      wins: 35,
      losses: 10,
      streakCount: 5,
      ycSpent: 3200,
      ycWon: 4450.5,
      yieldEfficiency: 39.1,
      wisdomIndex: 82.3,
      completedQuests: 12,
      showOnLeaderboard: true,
    },
    {
      address: '0x9876543210987654321098765432109876543210',
      displayName: 'Prediction Pro',
      ycBalance: 1980.25,
      principal: 3.5,
      xp: 1800,
      level: 4,
      accuracy: 72.3,
      totalBets: 38,
      wins: 27,
      losses: 11,
      streakCount: 3,
      ycSpent: 2500,
      ycWon: 3480.25,
      yieldEfficiency: 39.2,
      wisdomIndex: 75.8,
      completedQuests: 9,
      showOnLeaderboard: true,
    },
    {
      address: '0x5555555555555555555555555555555555555555',
      displayName: 'Market Analyst',
      ycBalance: 1750.8,
      principal: 2.8,
      xp: 1200,
      level: 3,
      accuracy: 65.5,
      totalBets: 29,
      wins: 19,
      losses: 10,
      streakCount: 2,
      ycSpent: 1800,
      ycWon: 2550.8,
      yieldEfficiency: 41.7,
      wisdomIndex: 68.2,
      completedQuests: 7,
      showOnLeaderboard: true,
    },
    {
      address: '0x1111111111111111111111111111111111111111',
      displayName: 'Yield Seeker',
      ycBalance: 1520.3,
      principal: 1.5,
      xp: 800,
      level: 2,
      accuracy: 58.3,
      totalBets: 24,
      wins: 14,
      losses: 10,
      streakCount: 1,
      ycSpent: 1200,
      ycWon: 1720.3,
      yieldEfficiency: 43.4,
      wisdomIndex: 61.5,
      completedQuests: 5,
      showOnLeaderboard: true,
    },
    {
      address: '0x2222222222222222222222222222222222222222',
      displayName: 'Risk Taker',
      ycBalance: 1320.5,
      principal: 1.0,
      xp: 500,
      level: 2,
      accuracy: 52.0,
      totalBets: 25,
      wins: 13,
      losses: 12,
      streakCount: 0,
      ycSpent: 1500,
      ycWon: 1820.5,
      yieldEfficiency: 21.4,
      wisdomIndex: 55.2,
      completedQuests: 3,
      showOnLeaderboard: true,
    },
  ];

  const users = await Promise.all(
    demoUsers.map((userData) =>
      prisma.user.create({
        data: userData,
      })
    )
  );

  console.log(`✅ Created ${users.length} demo users`);

  // Create diverse and interesting markets
  const now = new Date();
  const markets = [
    // Active Markets - Tech & AI
    {
      question: 'Will GPT-5 be released before June 2025?',
      closeTime: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000), // 30 days
      difficulty: 4,
      yesPool: 2500,
      noPool: 1800,
      resolved: false,
    },
    {
      question: 'Will Apple announce a foldable iPhone in 2025?',
      closeTime: new Date(now.getTime() + 45 * 24 * 60 * 60 * 1000),
      difficulty: 3,
      yesPool: 1200,
      noPool: 2100,
      resolved: false,
    },
    {
      question: 'Will Tesla stock hit $300 before end of Q1 2025?',
      closeTime: new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000),
      difficulty: 4,
      yesPool: 3200,
      noPool: 2800,
      resolved: false,
    },

    // Active Markets - Crypto & Web3
    {
      question: 'Will Ethereum reach $3,500 in December 2024?',
      closeTime: new Date(now.getTime() + 22 * 24 * 60 * 60 * 1000),
      difficulty: 3,
      yesPool: 4100,
      noPool: 3300,
      resolved: false,
    },
    {
      question: 'Will a Bitcoin ETF approval cause BTC to exceed $50k?',
      closeTime: new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000),
      difficulty: 2,
      yesPool: 2800,
      noPool: 1900,
      resolved: false,
    },

    // Active Markets - Science & Climate
    {
      question: 'Will 2024 be the hottest year on record?',
      closeTime: new Date(now.getTime() + 53 * 24 * 60 * 60 * 1000),
      difficulty: 2,
      yesPool: 1800,
      noPool: 900,
      resolved: false,
    },
    {
      question: 'Will SpaceX successfully land on Mars in 2025?',
      closeTime: new Date(now.getTime() + 120 * 24 * 60 * 60 * 1000),
      difficulty: 5,
      yesPool: 800,
      noPool: 2200,
      resolved: false,
    },

    // Active Markets - Sports & Entertainment
    {
      question: 'Will Lionel Messi win his 9th Ballon d\'Or in 2025?',
      closeTime: new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000),
      difficulty: 3,
      yesPool: 1500,
      noPool: 1700,
      resolved: false,
    },
    {
      question: 'Will the 2025 Oscar for Best Picture go to a sci-fi film?',
      closeTime: new Date(now.getTime() + 100 * 24 * 60 * 60 * 1000),
      difficulty: 4,
      yesPool: 900,
      noPool: 1400,
      resolved: false,
    },

    // Active Markets - Politics & Economics
    {
      question: 'Will inflation in the US fall below 3% by March 2025?',
      closeTime: new Date(now.getTime() + 110 * 24 * 60 * 60 * 1000),
      difficulty: 3,
      yesPool: 2200,
      noPool: 1600,
      resolved: false,
    },
    {
      question: 'Will the Federal Reserve cut interest rates in Q1 2025?',
      closeTime: new Date(now.getTime() + 85 * 24 * 60 * 60 * 1000),
      difficulty: 3,
      yesPool: 3100,
      noPool: 2400,
      resolved: false,
    },

    // Resolved Markets (Recent History)
    {
      question: 'Did Bitcoin reach $40,000 in November 2024?',
      closeTime: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
      difficulty: 2,
      yesPool: 3500,
      noPool: 1500,
      resolved: true,
      outcome: 'YES',
    },
    {
      question: 'Will the new iPhone 16 have USB-C charging?',
      closeTime: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000),
      difficulty: 1,
      yesPool: 4200,
      noPool: 800,
      resolved: true,
      outcome: 'YES',
    },
    {
      question: 'Did Ethereum successfully complete the Dencun upgrade?',
      closeTime: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000),
      difficulty: 2,
      yesPool: 2800,
      noPool: 1200,
      resolved: true,
      outcome: 'YES',
    },
    {
      question: 'Will Google announce a new Pixel Fold in October 2024?',
      closeTime: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000),
      difficulty: 3,
      yesPool: 1200,
      noPool: 2300,
      resolved: true,
      outcome: 'NO',
    },
    {
      question: 'Did Meta release Llama 3 before November 2024?',
      closeTime: new Date(now.getTime() - 25 * 24 * 60 * 60 * 1000),
      difficulty: 2,
      yesPool: 2500,
      noPool: 1000,
      resolved: true,
      outcome: 'YES',
    },
  ];

  const createdMarkets = await Promise.all(
    markets.map((market) =>
      prisma.market.create({
        data: market,
      })
    )
  );

  console.log(`✅ Created ${createdMarkets.length} markets`);

  // Create positions for demo users on resolved markets
  const resolvedMarkets = createdMarkets.filter((m) => m.resolved);
  const positions = [];

  for (const market of resolvedMarkets) {
    // Create 2-4 random positions per market
    const numPositions = Math.floor(Math.random() * 3) + 2;
    for (let i = 0; i < numPositions; i++) {
      const user = users[Math.floor(Math.random() * users.length)];
      const side = Math.random() > 0.5 ? 'YES' : 'NO';
      const amount = Math.floor(Math.random() * 200) + 50;
      const won = side === market.outcome;

      positions.push({
        userId: user.address,
        marketId: market.id,
        side,
        amount,
        claimed: won,
      });
    }
  }

  await Promise.all(
    positions.map((position) =>
      prisma.position.create({
        data: position,
      })
    )
  );

  console.log(`✅ Created ${positions.length} positions`);

  // Create some achievements for top users
  const achievementTypes = [
    'FIRST_BET',
    'HAT_TRICK',
    'SHARPSHOOTER',
    'QUEST_MASTER',
    'DIAMOND_HANDS',
    'WHALE',
  ];

  const achievements = [];
  for (let i = 0; i < 3; i++) {
    const user = users[i];
    const numAchievements = Math.min(achievementTypes.length, 3 + i);
    for (let j = 0; j < numAchievements; j++) {
      achievements.push({
        userId: user.address,
        type: achievementTypes[j],
      });
    }
  }

  await Promise.all(
    achievements.map((achievement) =>
      prisma.achievement.create({
        data: achievement,
      })
    )
  );

  console.log(`✅ Created ${achievements.length} achievements`);

  console.log('🎉 Database seeded successfully!');
  console.log(`
📊 Summary:
  - ${users.length} Users
  - ${createdMarkets.length} Markets (${createdMarkets.filter((m) => !m.resolved).length} active, ${resolvedMarkets.length} resolved)
  - ${positions.length} Positions
  - ${achievements.length} Achievements
  `);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
