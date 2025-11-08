// Core Types
export type Address = `0x${string}`;

// User Types
export interface User {
  address: Address;
  ycBalance: number;
  principal: number;
  lastAccrualTime: number;
  xp: number;
  level: number;
  displayName?: string;
  ensName?: string;
  showOnLeaderboard: boolean;
}

export interface UserStats {
  accuracy: number;
  yieldEfficiency: number;
  wisdomIndex: number;
  totalBets: number;
  wins: number;
  losses: number;
  currentStreak: number;
  ycProfit: number;
}

// Market Types
export interface Market {
  id: string;
  question: string;
  closeTime: number;
  difficulty: 1 | 2 | 3 | 4 | 5;
  yesPool: number;
  noPool: number;
  resolved: boolean;
  outcome?: "YES" | "NO" | "CANCEL";
  source?: string;
  createdAt: number;
}

export type MarketStatus = "active" | "closing-soon" | "resolved";

// Position Types
export interface Position {
  id: string;
  userId: Address;
  marketId: string;
  side: "YES" | "NO";
  amount: number;
  expectedPayout: number;
  claimed: boolean;
  won?: boolean;
  createdAt: number;
}

// Quest Types
export interface Quest {
  id: string;
  userId: Address;
  marketId?: string;
  title: string;
  question: string;
  suggestedStake: number;
  difficulty: 1 | 2 | 3 | 4 | 5;
  learningOutcome: string;
  closeTime: number;
  status: "generated" | "accepted" | "completed";
  feedback?: QuestFeedback;
  createdAt: number;
}

export interface QuestFeedback {
  feedback: string;
  suggestion: string;
}

// Claude Integration Types
export interface ClaudeQuestResponse {
  title: string;
  question: string;
  suggestedStake: number;
  difficulty: 1 | 2 | 3 | 4 | 5;
  learningOutcome: string;
  closeTime: string;
}

export interface ClaudeProbabilityHint {
  probability: number;
  rationale: string;
  tip: string;
}

// Achievement Types
export type AchievementType =
  | "FIRST_BET"
  | "HAT_TRICK"
  | "SHARPSHOOTER"
  | "QUEST_MASTER"
  | "DIAMOND_HANDS"
  | "WHALE"
  | "ORACLE";

export type AchievementRarity = "Common" | "Uncommon" | "Rare" | "Epic" | "Legendary";

export interface Achievement {
  id: string;
  userId: Address;
  type: AchievementType;
  name: string;
  description: string;
  rarity: AchievementRarity;
  icon: string;
  earnedAt: number;
}

// Player Class Types
export type PlayerClass = "Oracle" | "Degen" | "Analyst" | "Whale";

// Analytics Types
export interface TimeSeriesDataPoint {
  date: number;
  principal: number;
  yc: number;
}

export interface AllocationData {
  yes: number;
  no: number;
}

export interface OutcomesSummary {
  spent: number;
  won: number;
  net: number;
}

export interface AnalyticsData {
  timeSeries: TimeSeriesDataPoint[];
  allocation: AllocationData;
  outcomes: OutcomesSummary;
  insights: string[];
}

// Leaderboard Types
export type LeaderboardTab = "accuracy" | "wisdom" | "quests";

export interface LeaderboardEntry {
  rank: number;
  address: Address;
  ensName?: string;
  avatar?: string;
  value: number;
  change: "up" | "down" | "same";
}

// Transaction Types
export type TransactionStatus = "idle" | "pending" | "success" | "error";

export interface TransactionState {
  status: TransactionStatus;
  hash?: string;
  error?: string;
}
