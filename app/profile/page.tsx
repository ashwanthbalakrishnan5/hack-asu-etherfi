"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { Card, Button } from "@/components/ui";
import { WalletButton } from "@/components/wallet/WalletButton";
import { LevelBadge, AchievementBadge, PortfolioAnalytics } from "@/components/profile";
import { ACHIEVEMENT_DEFINITIONS } from "@/lib/achievements";

interface UserProfile {
  address: string;
  displayName?: string;
  xp: number;
  level: number;
  accuracy: number;
  wisdomIndex: number;
  yieldEfficiency: number;
  totalBets: number;
  wins: number;
  losses: number;
  ycBalance: number;
  ycSpent: number;
  ycWon: number;
  principal: number;
  streakCount: number;
  completedQuests: number;
  showOnLeaderboard: boolean;
  class: string;
  achievementsCount: number;
}

interface Achievement {
  type: string;
  name: string;
  description: string;
  rarity: string;
  icon: string;
  earnedAt?: Date;
}

export default function ProfilePage() {
  const { isConnected, address } = useAccount();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [achievements, setAchievements] = useState<{
    earned: Achievement[];
    locked: Achievement[];
  }>({ earned: [], locked: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [showOnLeaderboard, setShowOnLeaderboard] = useState(true);

  useEffect(() => {
    if (isConnected && address) {
      setLoading(true);
      setError(null);
      fetchProfile();
      fetchAchievements();
    } else {
      setLoading(false);
    }
  }, [isConnected, address]);

  async function fetchProfile() {
    try {
      const response = await fetch(`/api/users/${address}`);
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
        setDisplayName(data.displayName || "");
        setShowOnLeaderboard(data.showOnLeaderboard);
        setError(null);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to load profile');
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      setError('Failed to load profile. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function fetchAchievements() {
    try {
      const response = await fetch(
        `/api/achievements?userAddress=${address}`
      );
      if (response.ok) {
        const data = await response.json();
        setAchievements(data);
      }
    } catch (error) {
      console.error("Error fetching achievements:", error);
    }
  }

  async function savePreferences() {
    try {
      const response = await fetch(`/api/users/${address}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ displayName, showOnLeaderboard }),
      });

      if (response.ok) {
        setEditMode(false);
        fetchProfile();
      }
    } catch (error) {
      console.error("Error saving preferences:", error);
    }
  }

  if (!isConnected) {
    return (
      <div className="flex min-h-[calc(100vh-200px)] items-center justify-center px-6 py-16 mx-auto" style={{ maxWidth: '1800px' }}>
        <Card className="max-w-md text-center">
          <h2 className="mb-4 text-2xl font-bold text-foreground">
            Connect Your Wallet
          </h2>
          <p className="mb-6 text-foreground/70">
            Connect your wallet to view your profile and achievements.
          </p>
          <WalletButton />
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="w-full px-6 py-8 mx-auto" style={{ maxWidth: '1800px' }}>
        <div className="animate-pulse space-y-6">
          <div className="h-48 rounded-lg bg-gray-800" />
          <div className="h-64 rounded-lg bg-gray-800" />
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex min-h-[calc(100vh-200px)] items-center justify-center px-6 py-16 mx-auto" style={{ maxWidth: '1800px' }}>
        <Card className="max-w-md text-center">
          <h2 className="mb-4 text-2xl font-bold text-foreground">
            {error || 'Profile Not Found'}
          </h2>
          <p className="mb-6 text-foreground/70">
            {error
              ? 'There was an error loading your profile. Please try again.'
              : 'Unable to load profile data.'}
          </p>
          <Button onClick={() => fetchProfile()}>Retry</Button>
        </Card>
      </div>
    );
  }

  const classColors: Record<string, string> = {
    Whale: "text-blue-400",
    Oracle: "text-purple-400",
    Analyst: "text-green-400",
    Degen: "text-orange-400",
    Novice: "text-gray-400",
  };

  const shortenAddress = (addr: string) =>
    `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  return (
    <div className="w-full px-6 py-8 mx-auto" style={{ maxWidth: '1800px' }}>
      <div className="space-y-6">
        {/* Profile Header */}
        <Card>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              {/* Avatar placeholder */}
              <div className="h-20 w-20 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-2xl font-bold text-white">
                {profile.displayName
                  ? profile.displayName[0].toUpperCase()
                  : address && address.length > 2
                    ? address[2].toUpperCase()
                    : '?'}
              </div>

              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  {profile.displayName || (address ? shortenAddress(address) : 'Unknown User')}
                </h2>
                {profile.displayName && address && (
                  <p className="text-sm text-foreground/70">
                    {shortenAddress(address)}
                  </p>
                )}
                <div className="mt-1 flex items-center gap-2">
                  <span
                    className={`text-sm font-semibold ${classColors[profile.class]}`}
                  >
                    {profile.class}
                  </span>
                  <span className="text-sm text-foreground/50">•</span>
                  <span className="text-sm text-foreground/70">
                    {profile.achievementsCount} Achievements
                  </span>
                </div>
              </div>
            </div>

            <Button
              onClick={() => setEditMode(!editMode)}
              variant="default"
              size="sm"
            >
              {editMode ? "Cancel" : "Edit Profile"}
            </Button>
          </div>

          {/* Edit Mode */}
          {editMode && (
            <div className="mt-6 space-y-4 border-t border-gray-700 pt-4">
              <div>
                <label className="block text-sm font-medium text-foreground/70 mb-2">
                  Display Name
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Enter display name"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="showOnLeaderboard"
                  checked={showOnLeaderboard}
                  onChange={(e) => setShowOnLeaderboard(e.target.checked)}
                  className="w-4 h-4"
                />
                <label
                  htmlFor="showOnLeaderboard"
                  className="text-sm text-foreground/70"
                >
                  Show on leaderboard
                </label>
              </div>

              <Button onClick={savePreferences}>Save Changes</Button>
            </div>
          )}
        </Card>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Level & XP */}
          <Card>
            <h3 className="text-lg font-bold text-foreground mb-4">
              Level & XP
            </h3>
            <LevelBadge level={profile.level} xp={profile.xp} showProgress />
          </Card>

          {/* Key Metrics */}
          <Card>
            <h3 className="text-lg font-bold text-foreground mb-4">
              Key Metrics
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-foreground/70">Accuracy</p>
                <p className="text-2xl font-bold text-cyan-400">
                  {profile.accuracy.toFixed(1)}%
                </p>
              </div>
              <div>
                <p className="text-sm text-foreground/70">Wisdom Index</p>
                <p className="text-2xl font-bold text-purple-400">
                  {profile.wisdomIndex.toFixed(1)}
                </p>
              </div>
              <div>
                <p className="text-sm text-foreground/70">Win Streak</p>
                <p className="text-2xl font-bold text-green-400">
                  {profile.streakCount}
                </p>
              </div>
              <div>
                <p className="text-sm text-foreground/70">Yield Efficiency</p>
                <p className="text-2xl font-bold text-yellow-400">
                  {profile.yieldEfficiency.toFixed(1)}%
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Detailed Stats */}
        <Card>
          <h3 className="text-lg font-bold text-foreground mb-4">
            Detailed Stats
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-foreground/70">Total Bets</p>
              <p className="text-xl font-bold text-foreground">
                {profile.totalBets}
              </p>
            </div>
            <div>
              <p className="text-sm text-foreground/70">Wins</p>
              <p className="text-xl font-bold text-green-400">{profile.wins}</p>
            </div>
            <div>
              <p className="text-sm text-foreground/70">Losses</p>
              <p className="text-xl font-bold text-red-400">{profile.losses}</p>
            </div>
            <div>
              <p className="text-sm text-foreground/70">YC Balance</p>
              <p className="text-xl font-bold text-cyan-400">
                {profile.ycBalance.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-sm text-foreground/70">YC Spent</p>
              <p className="text-xl font-bold text-foreground">
                {profile.ycSpent.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-sm text-foreground/70">YC Won</p>
              <p className="text-xl font-bold text-green-400">
                {profile.ycWon.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-sm text-foreground/70">YC Profit</p>
              <p
                className={`text-xl font-bold ${
                  profile.ycWon - profile.ycSpent >= 0
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                {(profile.ycWon - profile.ycSpent).toFixed(2)}
              </p>
            </div>
          </div>
        </Card>

        {/* Portfolio Analytics */}
        {address && <PortfolioAnalytics address={address} />}

        {/* Achievements */}
        <Card>
          <h3 className="text-lg font-bold text-foreground mb-4">
            Achievements ({achievements.earned.length} /{" "}
            {achievements.earned.length + achievements.locked.length})
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {achievements.earned.map((achievement) => (
              <AchievementBadge
                key={achievement.type}
                icon={achievement.icon}
                name={achievement.name}
                description={achievement.description}
                rarity={achievement.rarity as any}
                earned={true}
                earnedAt={achievement.earnedAt}
              />
            ))}
            {achievements.locked.map((achievement) => (
              <AchievementBadge
                key={achievement.type}
                icon={achievement.icon}
                name={achievement.name}
                description={achievement.description}
                rarity={achievement.rarity as any}
                earned={false}
              />
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
