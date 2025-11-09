'use client';

import { useState, useEffect } from 'react';
import { Market } from '@/lib/types';
import { MarketCard } from './MarketCard';
import { Loader2 } from 'lucide-react';

interface MarketsListProps {
  filter?: 'active' | 'resolved' | 'all';
  onPlaceBet?: (market: Market) => void;
}

export function MarketsList({ filter = 'all', onPlaceBet }: MarketsListProps) {
  const [markets, setMarkets] = useState<Market[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'active' | 'resolved'>('active');

  useEffect(() => {
    fetchMarkets();
  }, [filter]);

  const fetchMarkets = async () => {
    try {
      setLoading(true);
      setError(null);

      const queryFilter = filter === 'all' ? '' : `?filter=${filter}`;
      const response = await fetch(`/api/markets${queryFilter}`);

      if (!response.ok) {
        throw new Error('Failed to fetch markets');
      }

      const data = await response.json();
      setMarkets(data);
    } catch (err) {
      console.error('Error fetching markets:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch markets');
    } finally {
      setLoading(false);
    }
  };

  const filteredMarkets =
    filter === 'all'
      ? markets.filter((m) =>
          activeTab === 'active' ? !m.resolved : m.resolved
        )
      : markets;

  if (loading) {
    return (
      <div className="space-y-4">
        {/* Skeleton loaders */}
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-gray-800 rounded-lg p-6 border border-gray-700 animate-pulse"
          >
            <div className="h-6 bg-gray-700 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-700 rounded w-1/4 mb-6"></div>
            <div className="space-y-3">
              <div className="h-8 bg-gray-700 rounded"></div>
              <div className="h-8 bg-gray-700 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-6 text-center">
        <p className="text-red-400 mb-4">{error}</p>
        <button
          onClick={fetchMarkets}
          className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (markets.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg p-12 text-center border border-gray-700">
        <div className="text-gray-400 mb-2">
          <svg
            className="w-16 h-16 mx-auto mb-4 opacity-50"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <p className="text-lg font-medium">No markets available</p>
          <p className="text-sm mt-1">Check back soon for new prediction markets!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tabs for filtering active/resolved */}
      {filter === 'all' && (
        <div className="flex items-center gap-2 border-b border-gray-700">
          <button
            onClick={() => setActiveTab('active')}
            className={`px-4 py-2 font-medium transition-colors relative ${
              activeTab === 'active'
                ? 'text-cyan-400'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Active Markets
            {activeTab === 'active' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab('resolved')}
            className={`px-4 py-2 font-medium transition-colors relative ${
              activeTab === 'resolved'
                ? 'text-cyan-400'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Resolved Markets
            {activeTab === 'resolved' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400"></div>
            )}
          </button>
        </div>
      )}

      {/* Markets grid */}
      <div className="grid grid-cols-1 gap-4">
        {filteredMarkets.length === 0 ? (
          <div className="bg-gray-800 rounded-lg p-8 text-center border border-gray-700">
            <p className="text-gray-400">
              No {activeTab} markets at the moment.
            </p>
          </div>
        ) : (
          filteredMarkets.map((market) => (
            <MarketCard
              key={market.id}
              market={market}
              onPlaceBet={onPlaceBet}
            />
          ))
        )}
      </div>
    </div>
  );
}
