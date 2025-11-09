'use client';

import { useState, useEffect } from 'react';
import { Zap, Plus, Gift, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAccount } from 'wagmi';
import { CreditsStore } from './CreditsStore';
import { DailyRewards } from './DailyRewards';

export function CreditsWidget() {
  const { address, isConnected } = useAccount();
  const [balance, setBalance] = useState(0);
  const [showStore, setShowStore] = useState(false);
  const [showDailyRewards, setShowDailyRewards] = useState(false);
  const [hasUnclaimedDaily, setHasUnclaimedDaily] = useState(false);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    if (address) {
      fetchBalance();
      checkDailyReward();
      const interval = setInterval(() => {
        fetchBalance();
        checkDailyReward();
      }, 30000); // Update every 30s
      return () => clearInterval(interval);
    }
  }, [address]);

  const fetchBalance = async () => {
    try {
      const response = await fetch(`/api/yc/balance?address=${address}`);
      if (response.ok) {
        const data = await response.json();
        setBalance(data.balance || 0);
      }
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };

  const checkDailyReward = async () => {
    try {
      const response = await fetch(`/api/rewards/daily?address=${address}`);
      if (response.ok) {
        const data = await response.json();
        setHasUnclaimedDaily(data.canClaim);
        setStreak(data.streak);
      }
    } catch (error) {
      console.error('Error checking daily reward:', error);
    }
  };

  if (!isConnected) return null;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-20 right-6 z-40 flex items-center gap-2"
      >
        {/* Daily Reward Indicator */}
        {hasUnclaimedDaily && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowDailyRewards(true)}
            className="relative px-3 py-2 rounded-lg bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-400/30 hover:border-purple-400/50 transition-all"
          >
            <div className="flex items-center gap-2">
              <Gift className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-semibold text-purple-400">
                Daily
              </span>
            </div>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute -top-1 -right-1 w-3 h-3 bg-purple-400 rounded-full"
            />
          </motion.button>
        )}

        {/* Credits Balance */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/30 backdrop-blur-md">
          <Zap className="w-5 h-5 text-primary" />
          <div className="flex flex-col">
            <span className="text-xs text-foreground/60">Credits</span>
            <span className="text-lg font-bold text-primary">
              {balance.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Buy Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowStore(true)}
          className="p-2 rounded-lg bg-primary hover:bg-primary-bright transition-colors"
        >
          <Plus className="w-5 h-5 text-background" />
        </motion.button>

        {/* Streak Indicator */}
        {streak > 0 && (
          <div className="px-3 py-2 rounded-lg bg-orange-500/10 border border-orange-400/30">
            <div className="flex items-center gap-1">
              <span className="text-xl">🔥</span>
              <span className="text-sm font-bold text-orange-400">{streak}</span>
            </div>
          </div>
        )}
      </motion.div>

      {/* Modals */}
      <CreditsStore
        isOpen={showStore}
        onClose={() => {
          setShowStore(false);
          fetchBalance();
        }}
        currentBalance={balance}
      />

      <DailyRewards
        isOpen={showDailyRewards}
        onClose={() => {
          setShowDailyRewards(false);
          fetchBalance();
          checkDailyReward();
        }}
      />
    </>
  );
}
