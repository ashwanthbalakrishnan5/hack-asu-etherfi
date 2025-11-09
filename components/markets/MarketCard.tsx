'use client';

import { Market } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';
import { Clock, TrendingUp, Trophy, Zap, Target, Timer } from 'lucide-react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { useState, useEffect } from 'react';

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
  const [isHovered, setIsHovered] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isClosingSoon, setIsClosingSoon] = useState(false);
  const [hoursRemaining, setHoursRemaining] = useState(0);

  const totalPool = market.totalPool || market.yesPool + market.noPool;
  const yesOdds = totalPool > 0 ? (market.yesPool / totalPool) * 100 : 50;
  const noOdds = totalPool > 0 ? (market.noPool / totalPool) * 100 : 50;

  const closeTime = new Date(market.closeTime);

  useEffect(() => {
    setMounted(true);

    const updateTimeData = () => {
      const now = Date.now();
      const active = !market.resolved && closeTime.getTime() > now;
      const timeRemaining = closeTime.getTime() - now;
      const closingSoon = active && timeRemaining < 24 * 60 * 60 * 1000;
      const hours = Math.floor(timeRemaining / (1000 * 60 * 60));

      setIsActive(active);
      setIsClosingSoon(closingSoon);
      setHoursRemaining(hours);
    };

    updateTimeData();
    const interval = setInterval(updateTimeData, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [market.closeTime, market.resolved, closeTime]);

  // Difficulty color mapping
  const getDifficultyColor = () => {
    switch (market.difficulty) {
      case 1: return { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/30' };
      case 2: return { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30' };
      case 3: return { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/30' };
      case 4: return { bg: 'bg-orange-500/20', text: 'text-orange-400', border: 'border-orange-500/30' };
      case 5: return { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30' };
      default: return { bg: 'bg-gray-500/20', text: 'text-gray-400', border: 'border-gray-500/30' };
    }
  };

  const difficultyColors = getDifficultyColor();
  const difficultyStars = Array.from({ length: 5 }, (_, i) => i < market.difficulty);
  const difficultyLabel = ['Easy', 'Medium', 'Hard', 'Expert', 'Master'][market.difficulty - 1];

  const getStatusBadge = () => {
    if (!mounted) {
      // Return a placeholder during SSR to avoid hydration mismatch
      return (
        <span className="px-3 py-1.5 text-xs font-bold rounded-full bg-gray-700/50 text-gray-300 flex items-center gap-1.5 border border-gray-600">
          <Zap className="w-3.5 h-3.5" />
          Loading...
        </span>
      );
    }

    if (market.resolved) {
      return (
        <motion.span
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="px-3 py-1.5 text-xs font-bold rounded-full bg-gray-700/50 text-gray-300 flex items-center gap-1.5 border border-gray-600"
        >
          <Trophy className="w-3.5 h-3.5" />
          Resolved
        </motion.span>
      );
    }
    if (isClosingSoon) {
      return (
        <motion.span
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="px-3 py-1.5 text-xs font-bold rounded-full bg-amber-500/20 text-amber-400 flex items-center gap-1.5 border border-amber-500/50"
        >
          <Timer className="w-3.5 h-3.5 animate-pulse" />
          Closing Soon
        </motion.span>
      );
    }
    return (
      <motion.span
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className="px-3 py-1.5 text-xs font-bold rounded-full bg-green-500/20 text-green-400 flex items-center gap-1.5 border border-green-500/50"
      >
        <Zap className="w-3.5 h-3.5" />
        Active
      </motion.span>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.2 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 rounded-xl p-6 border border-gray-700 hover:border-cyan-500/50 transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-cyan-500/20 overflow-hidden group"
    >
      {/* Animated Background Gradient */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        animate={{
          background: isHovered
            ? ['linear-gradient(135deg, rgba(6,182,212,0.05) 0%, rgba(168,85,247,0.05) 50%, rgba(59,130,246,0.05) 100%)',
               'linear-gradient(135deg, rgba(59,130,246,0.05) 0%, rgba(6,182,212,0.05) 50%, rgba(168,85,247,0.05) 100%)']
            : undefined
        }}
        transition={{ duration: 3, repeat: Infinity, repeatType: 'reverse' }}
      />

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4 gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-white mb-3 line-clamp-2 leading-tight group-hover:text-cyan-100 transition-colors">
              {market.question}
            </h3>
            <div className="flex items-center gap-2 flex-wrap">
              {getStatusBadge()}

              {/* Difficulty Badge */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className={`px-3 py-1.5 rounded-full ${difficultyColors.bg} ${difficultyColors.text} flex items-center gap-1.5 border ${difficultyColors.border}`}
              >
                <Target className="w-3.5 h-3.5" />
                <span className="text-xs font-bold">{difficultyLabel}</span>
                <div className="flex items-center gap-0.5 ml-1">
                  {difficultyStars.map((filled, i) => (
                    <motion.span
                      key={i}
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.2 + i * 0.05, type: 'spring' }}
                      className={`text-xs ${filled ? difficultyColors.text : 'text-gray-600'}`}
                    >
                      ★
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Pool Visualization */}
        <div className="space-y-4 mb-5">
          {/* Total Pool Display */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-between text-xs text-gray-400 pb-2 border-b border-gray-700/50"
          >
            <span className="flex items-center gap-1">
              <Trophy className="w-3.5 h-3.5" />
              Total Pool
            </span>
            <span className="font-bold text-cyan-400">{totalPool.toFixed(2)} YC</span>
          </motion.div>

          {/* YES Pool */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="space-y-2"
          >
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <span className="text-green-400 font-bold">YES</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-gray-400 text-xs">{market.yesPool.toFixed(2)} YC</span>
                <span className="text-green-400 font-bold text-sm">{yesOdds.toFixed(1)}%</span>
              </div>
            </div>
            <div className="relative h-3 bg-gray-800 rounded-full overflow-hidden border border-gray-700">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${yesOdds}%` }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
                className="h-full bg-gradient-to-r from-green-600 via-green-500 to-green-400 relative"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                />
              </motion.div>
            </div>
          </motion.div>

          {/* NO Pool */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="space-y-2"
          >
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-red-400 rotate-180" />
                <span className="text-red-400 font-bold">NO</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-gray-400 text-xs">{market.noPool.toFixed(2)} YC</span>
                <span className="text-red-400 font-bold text-sm">{noOdds.toFixed(1)}%</span>
              </div>
            </div>
            <div className="relative h-3 bg-gray-800 rounded-full overflow-hidden border border-gray-700">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${noOdds}%` }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: 0.25 }}
                className="h-full bg-gradient-to-r from-red-600 via-red-500 to-red-400 relative"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 1, delay: 0.5 }}
                />
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-700/50">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Clock className={`w-4 h-4 ${isClosingSoon ? 'text-amber-400 animate-pulse' : ''}`} />
            {!mounted ? (
              <span className="font-medium">Loading...</span>
            ) : market.resolved ? (
              <span className="font-medium">Resolved</span>
            ) : (
              <span className="font-medium">
                {isClosingSoon && hoursRemaining < 6 ? (
                  <span className="text-amber-400 font-bold">
                    {Math.max(0, hoursRemaining)}h left
                  </span>
                ) : (
                  formatDistanceToNow(closeTime, { addSuffix: true })
                )}
              </span>
            )}
          </div>

          {isActive && onPlaceBet && (
            <motion.button
              onClick={() => onPlaceBet(market)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 text-white text-sm font-bold rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-200 relative overflow-hidden group/btn"
            >
              <span className="relative z-10 flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Place Bet
              </span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-purple-500 via-cyan-500 to-blue-500 opacity-0 group-hover/btn:opacity-100 transition-opacity"
                animate={{ x: ['0%', '100%'] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </motion.button>
          )}

          {market.resolved && market.outcome && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center gap-2"
            >
              <span className="text-xs text-gray-400 font-medium">Outcome:</span>
              <span
                className={`px-3 py-1.5 text-xs font-bold rounded-lg border-2 ${
                  market.outcome === 'YES'
                    ? 'bg-green-500/20 text-green-400 border-green-500/50'
                    : market.outcome === 'NO'
                    ? 'bg-red-500/20 text-red-400 border-red-500/50'
                    : 'bg-gray-500/20 text-gray-400 border-gray-500/50'
                }`}
              >
                {market.outcome}
              </span>
            </motion.div>
          )}
        </div>

        {/* Hover Info Overlay */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
          className="absolute top-2 right-2 bg-gray-900/95 backdrop-blur-sm border border-cyan-500/30 rounded-lg px-3 py-2 text-xs text-cyan-400 font-medium shadow-lg pointer-events-none"
        >
          {isActive ? 'Click to predict' : 'Market closed'}
        </motion.div>
      </div>
    </motion.div>
  );
}
