'use client';

import { useState, useEffect } from 'react';
import { Market } from '@/lib/types';
import { MarketCard } from './MarketCard';
import { Loader2, TrendingUp, Archive } from 'lucide-react';
import { motion, AnimatePresence, stagger } from 'framer-motion';

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
        {/* Enhanced Skeleton loaders */}
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 border border-gray-700 overflow-hidden"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-700/20 to-transparent"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            />
            <div className="relative z-10 space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-3">
                  <div className="h-7 bg-gray-700/50 rounded-lg w-3/4 animate-pulse" />
                  <div className="flex gap-2">
                    <div className="h-6 bg-gray-700/50 rounded-full w-24 animate-pulse" />
                    <div className="h-6 bg-gray-700/50 rounded-full w-32 animate-pulse" />
                  </div>
                </div>
              </div>
              <div className="space-y-3 pt-2">
                <div className="h-10 bg-gray-700/50 rounded-lg animate-pulse" />
                <div className="h-10 bg-gray-700/50 rounded-lg animate-pulse" />
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-gray-700/50">
                <div className="h-4 bg-gray-700/50 rounded w-32 animate-pulse" />
                <div className="h-9 bg-gray-700/50 rounded-lg w-28 animate-pulse" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-red-500/10 border-2 border-red-500/50 rounded-xl p-8 text-center"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 0.5 }}
          className="text-6xl mb-4"
        >
          ⚠️
        </motion.div>
        <p className="text-red-400 font-medium mb-6 text-lg">{error}</p>
        <motion.button
          onClick={fetchMarkets}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-3 bg-red-500/20 text-red-400 font-bold rounded-lg hover:bg-red-500/30 transition-all border border-red-500/50"
        >
          Try Again
        </motion.button>
      </motion.div>
    );
  }

  if (markets.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-12 text-center border border-gray-700"
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-6xl mb-6"
        >
          📊
        </motion.div>
        <div className="space-y-2">
          <p className="text-xl font-bold text-gray-300">No markets available</p>
          <p className="text-sm text-gray-500">Check back soon for new prediction markets!</p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tabs for filtering active/resolved */}
      {filter === 'all' && (
        <div className="relative flex items-center gap-2 border-b-2 border-gray-700/50">
          <motion.button
            onClick={() => setActiveTab('active')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`relative px-6 py-3 font-bold transition-colors ${
              activeTab === 'active'
                ? 'text-cyan-400'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            <span className="relative z-10 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Active Markets
            </span>
            {activeTab === 'active' && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-t-full"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
              />
            )}
          </motion.button>
          <motion.button
            onClick={() => setActiveTab('resolved')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`relative px-6 py-3 font-bold transition-colors ${
              activeTab === 'resolved'
                ? 'text-cyan-400'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            <span className="relative z-10 flex items-center gap-2">
              <Archive className="w-4 h-4" />
              Resolved Markets
            </span>
            {activeTab === 'resolved' && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-t-full"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
              />
            )}
          </motion.button>
        </div>
      )}

      {/* Markets grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 gap-4"
        >
          {filteredMarkets.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gray-800 rounded-xl p-12 text-center border border-gray-700"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-6xl mb-4"
              >
                🔍
              </motion.div>
              <p className="text-gray-400 text-lg font-medium">
                No {activeTab} markets at the moment.
              </p>
              <p className="text-gray-500 text-sm mt-2">
                {activeTab === 'active' ? 'New markets coming soon!' : 'Check back later for results!'}
              </p>
            </motion.div>
          ) : (
            filteredMarkets.map((market, index) => (
              <motion.div
                key={market.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
              >
                <MarketCard
                  market={market}
                  onPlaceBet={onPlaceBet}
                />
              </motion.div>
            ))
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
