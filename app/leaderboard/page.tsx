"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { Card, Button } from "@/components/ui";

interface LeaderboardUser {
  address: string;
  displayName?: string;
  accuracy: number;
  wisdomIndex: number;
  completedQuests: number;
  totalBets: number;
  wins: number;
  losses: number;
  xp: number;
  level: number;
  rank: number;
}

interface LeaderboardData {
  users: LeaderboardUser[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

type LeaderboardType = 'accuracy' | 'wisdom' | 'quests';

export default function LeaderboardPage() {
  const { address } = useAccount();
  const [activeTab, setActiveTab] = useState<LeaderboardType>('accuracy');
  const [data, setData] = useState<LeaderboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    fetchLeaderboard();
  }, [activeTab, page, search]);

  async function fetchLeaderboard() {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        type: activeTab,
        page: page.toString(),
        limit: '20',
      });

      if (search) {
        params.append('search', search);
      }

      const response = await fetch(`/api/leaderboard?${params}`);
      if (response.ok) {
        const data = await response.json();
        setData(data);
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  }

  function handleSearch() {
    setSearch(searchInput);
    setPage(1);
  }

  function handleTabChange(tab: LeaderboardType) {
    setActiveTab(tab);
    setPage(1);
  }

  const shortenAddress = (addr: string) =>
    `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  const isCurrentUser = (userAddress: string) =>
    address?.toLowerCase() === userAddress.toLowerCase();

  const tabs = [
    { key: 'accuracy' as LeaderboardType, label: 'Accuracy Leaders', metric: 'Accuracy' },
    { key: 'wisdom' as LeaderboardType, label: 'Wisdom Index Leaders', metric: 'Wisdom' },
    { key: 'quests' as LeaderboardType, label: 'Quest Masters', metric: 'Quests' },
  ];

  return (
    <div className="w-full px-6 py-8 mx-auto" style={{ maxWidth: '1800px' }}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Leaderboard
          </h1>
          <p className="text-foreground/70">
            Compete with other players based on accuracy, wisdom, and quest completion
          </p>
        </div>

        {/* Search */}
        <Card>
          <div className="flex gap-2">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search by address or display name..."
              className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            <Button onClick={handleSearch}>Search</Button>
            {search && (
              <Button
                onClick={() => {
                  setSearch('');
                  setSearchInput('');
                }}
                variant="default"
              >
                Clear
              </Button>
            )}
          </div>
        </Card>

        {/* Tabs */}
        <Card>
          <div className="flex border-b border-gray-700 mb-4">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => handleTabChange(tab.key)}
                className={`px-4 py-2 font-medium transition-colors ${
                  activeTab === tab.key
                    ? 'text-cyan-400 border-b-2 border-cyan-400'
                    : 'text-foreground/70 hover:text-foreground'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Leaderboard Table */}
          {loading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-16 bg-gray-800 rounded animate-pulse" />
              ))}
            </div>
          ) : data && data.users.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-sm text-foreground/70 border-b border-gray-700">
                      <th className="pb-3 font-medium">Rank</th>
                      <th className="pb-3 font-medium">Player</th>
                      <th className="pb-3 font-medium">Level</th>
                      <th className="pb-3 font-medium">
                        {tabs.find((t) => t.key === activeTab)?.metric}
                      </th>
                      <th className="pb-3 font-medium">Bets</th>
                      <th className="pb-3 font-medium">Win Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.users.map((user, index) => (
                      <tr
                        key={user.address}
                        className={`border-b border-gray-800 hover:bg-gray-800/50 transition-colors ${
                          isCurrentUser(user.address) ? 'bg-cyan-900/20' : ''
                        }`}
                      >
                        <td className="py-4">
                          <div className="flex items-center gap-2">
                            {user.rank <= 3 && (
                              <span className="text-xl">
                                {user.rank === 1
                                  ? '🥇'
                                  : user.rank === 2
                                  ? '🥈'
                                  : '🥉'}
                              </span>
                            )}
                            <span className="font-bold text-foreground">
                              #{user.rank}
                            </span>
                          </div>
                        </td>
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-sm font-bold text-white">
                              {user.displayName?.[0]?.toUpperCase() ||
                                user.address[2].toUpperCase()}
                            </div>
                            <div>
                              <p className="font-medium text-foreground">
                                {user.displayName || shortenAddress(user.address)}
                                {isCurrentUser(user.address) && (
                                  <span className="ml-2 text-xs text-cyan-400">
                                    (You)
                                  </span>
                                )}
                              </p>
                              {user.displayName && (
                                <p className="text-xs text-foreground/70">
                                  {shortenAddress(user.address)}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-4">
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-sm font-bold text-white">
                              {user.level}
                            </div>
                          </div>
                        </td>
                        <td className="py-4">
                          <span className="font-bold text-cyan-400">
                            {activeTab === 'accuracy'
                              ? `${user.accuracy.toFixed(1)}%`
                              : activeTab === 'wisdom'
                              ? user.wisdomIndex.toFixed(1)
                              : user.completedQuests}
                          </span>
                        </td>
                        <td className="py-4 text-foreground/70">
                          {user.totalBets}
                        </td>
                        <td className="py-4">
                          <span className="text-green-400">
                            {user.totalBets > 0
                              ? ((user.wins / user.totalBets) * 100).toFixed(1)
                              : '0.0'}
                            %
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {data.totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-700">
                  <p className="text-sm text-foreground/70">
                    Showing {(page - 1) * data.limit + 1} to{' '}
                    {Math.min(page * data.limit, data.total)} of {data.total}{' '}
                    players
                  </p>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => setPage(page - 1)}
                      disabled={page === 1}
                      variant="default"
                      size="sm"
                    >
                      Previous
                    </Button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, data.totalPages) }).map(
                        (_, i) => {
                          let pageNum;
                          if (data.totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (page <= 3) {
                            pageNum = i + 1;
                          } else if (page >= data.totalPages - 2) {
                            pageNum = data.totalPages - 4 + i;
                          } else {
                            pageNum = page - 2 + i;
                          }

                          return (
                            <Button
                              key={pageNum}
                              onClick={() => setPage(pageNum)}
                              variant={page === pageNum ? 'primary' : 'secondary'}
                              size="sm"
                            >
                              {pageNum}
                            </Button>
                          );
                        }
                      )}
                    </div>
                    <Button
                      onClick={() => setPage(page + 1)}
                      disabled={page === data.totalPages}
                      variant="default"
                      size="sm"
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl text-foreground/70 mb-2">
                {search
                  ? 'No players found'
                  : 'Not enough participants yet'}
              </p>
              <p className="text-sm text-foreground/50">
                {search
                  ? 'Try a different search term'
                  : 'Be the first to place 10+ bets and appear on the leaderboard!'}
              </p>
            </div>
          )}
        </Card>

        {/* Info */}
        <Card>
          <h3 className="text-lg font-bold text-foreground mb-2">
            How Rankings Work
          </h3>
          <ul className="space-y-2 text-sm text-foreground/70">
            <li>
              • <strong>Minimum participation:</strong> 10 bets required to
              appear on the leaderboard
            </li>
            <li>
              • <strong>Accuracy:</strong> Percentage of correct predictions
            </li>
            <li>
              • <strong>Wisdom Index:</strong> Composite score based on
              accuracy (50%), yield efficiency (30%), and streak bonus (20%)
            </li>
            <li>
              • <strong>Quest Masters:</strong> Total number of completed Claude
              quests
            </li>
            <li>
              • <strong>Privacy:</strong> Opt out of leaderboard in your
              profile settings
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
