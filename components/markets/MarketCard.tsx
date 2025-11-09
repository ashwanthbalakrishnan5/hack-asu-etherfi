'use client';

import { Market } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';
import { Clock, TrendingUp, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';

interface MarketCardProps {
  market: Market & {
    totalPool?: number;
    yesOdds?: number;
    noOdds?: number;
    isActive?: boolean;
    isClosingSoon?: boolean;
  };
  onPlaceBet?: (market: Market) => void;
}

export function MarketCard({ market, onPlaceBet }: MarketCardProps) {
  const totalPool = market.totalPool || market.yesPool + market.noPool;
  const yesOdds = totalPool > 0 ? (market.yesPool / totalPool) * 100 : 50;
  const noOdds = totalPool > 0 ? (market.noPool / totalPool) * 100 : 50;

  const closeTime = new Date(market.closeTime);
  const isActive = !market.resolved && closeTime > new Date();
  const isClosingSoon = isActive && closeTime.getTime() - Date.now() < 24 * 60 * 60 * 1000;

  const difficultyStars = Array.from({ length: 5 }, (_, i) => i < market.difficulty);

  const getStatusBadge = () => {
    if (market.resolved) {
      return (
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-700 text-gray-300 flex items-center gap-1">
          <Trophy className="w-3 h-3" />
          Resolved
        </span>
      );
    }
    if (isClosingSoon) {
      return (
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-amber-500/20 text-amber-400 flex items-center gap-1 animate-pulse">
          <Clock className="w-3 h-3" />
          Closing Soon
        </span>
      );
    }
    return (
      <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-500/20 text-green-400 flex items-center gap-1">
          <TrendingUp className="w-3 h-3" />
          Active
        </span>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg p-6 border border-gray-700 hover:border-cyan-500/50 transition-all duration-200 shadow-lg hover:shadow-cyan-500/10"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
            {market.question}
          </h3>
          <div className="flex items-center gap-2 flex-wrap">
            {getStatusBadge()}

            {/* Difficulty */}
            <div className="flex items-center gap-1" title={`Difficulty: ${market.difficulty}/5`}>
              {difficultyStars.map((filled, i) => (
                <span
                  key={i}
                  className={`text-xs ${
                    filled ? 'text-cyan-400' : 'text-gray-600'
                  }`}
                >
                  ★
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Pools and Odds */}
      <div className="space-y-3 mb-4">
        {/* YES Pool */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-sm">
            <span className="text-green-400 font-medium">YES</span>
            <span className="text-gray-400">{market.yesPool.toFixed(2)} YC</span>
          </div>
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${yesOdds}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-green-500 to-green-400"
            />
          </div>
          <div className="text-right text-xs text-gray-500">{yesOdds.toFixed(1)}%</div>
        </div>

        {/* NO Pool */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-sm">
            <span className="text-red-400 font-medium">NO</span>
            <span className="text-gray-400">{market.noPool.toFixed(2)} YC</span>
          </div>
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${noOdds}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-red-500 to-red-400"
            />
          </div>
          <div className="text-right text-xs text-gray-500">{noOdds.toFixed(1)}%</div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-700">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Clock className="w-4 h-4" />
          {market.resolved ? (
            <span>Resolved</span>
          ) : (
            <span>
              Closes {formatDistanceToNow(closeTime, { addSuffix: true })}
            </span>
          )}
        </div>

        {isActive && onPlaceBet && (
          <button
            onClick={() => onPlaceBet(market)}
            className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-sm font-medium rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-200 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40"
          >
            Place Bet
          </button>
        )}

        {market.resolved && market.outcome && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">Outcome:</span>
            <span
              className={`px-2 py-1 text-xs font-bold rounded ${
                market.outcome === 'YES'
                  ? 'bg-green-500/20 text-green-400'
                  : market.outcome === 'NO'
                  ? 'bg-red-500/20 text-red-400'
                  : 'bg-gray-500/20 text-gray-400'
              }`}
            >
              {market.outcome}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
