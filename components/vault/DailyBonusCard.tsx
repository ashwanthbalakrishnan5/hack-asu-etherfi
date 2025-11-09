'use client';

import { useState, useEffect } from 'react';
import { Gift, Flame, Star, TrendingUp, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAccount } from 'wagmi';
import { Button } from '@/components/ui';
import { DailyRewards } from '@/components/credits';
import { toast } from '@/lib/stores/toast';

const REWARDS_LADDER = [
  { day: 1, amount: 50, emoji: '💰' },
  { day: 2, amount: 75, emoji: '💎' },
  { day: 3, amount: 100, emoji: '🔥' },
  { day: 4, amount: 150, emoji: '⚡' },
  { day: 5, amount: 200, emoji: '🌟' },
  { day: 6, amount: 300, emoji: '🚀' },
  { day: 7, amount: 500, emoji: '👑' },
];

export function DailyBonusCard() {
  const { address } = useAccount();
  const [canClaim, setCanClaim] = useState(false);
  const [streak, setStreak] = useState(0);
  const [nextReward, setNextReward] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);

  useEffect(() => {
    if (address) {
      checkDaily();
    }
  }, [address]);

  const checkDaily = async () => {
    try {
      const response = await fetch(`/api/rewards/daily?address=${address}`);
      if (response.ok) {
        const data = await response.json();
        setCanClaim(data.canClaim);
        setStreak(data.streak);

        const rewards = [50, 75, 100, 150, 200, 300, 500];
        setNextReward(rewards[Math.min(data.streak, 6)]);
      }
    } catch (error) {
      console.error('Error checking daily:', error);
    }
  };

  const handleQuickClaim = async () => {
    if (!canClaim) {
      setShowModal(true);
      return;
    }

    setIsClaiming(true);
    try {
      const response = await fetch('/api/rewards/daily/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address }),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(`🎉 +${data.reward} YC claimed!`);
        setCanClaim(false);
        setStreak(data.streak);
        checkDaily();
      } else {
        toast.error('Already claimed today');
      }
    } catch (error) {
      toast.error('Failed to claim');
    } finally {
      setIsClaiming(false);
    }
  };

  if (!address) return null;

  const currentDay = Math.min(streak + 1, 7);
  const progressPercent = (currentDay / 7) * 100;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl border-2 border-gradient-to-r from-purple-500/40 via-pink-500/40 to-orange-500/40 bg-gradient-to-br from-purple-500/15 via-pink-500/10 to-orange-500/15 p-5 backdrop-blur-sm"
      >
        {/* Animated background effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-pink-500/5 to-orange-500/5 animate-pulse" />

        {/* Notification dot */}
        {canClaim && (
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute top-3 right-3 w-2.5 h-2.5 bg-green-400 rounded-full shadow-lg shadow-green-400/50"
          />
        )}

        <div className="relative space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20">
                <Gift className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <div className="text-xs font-medium text-foreground/60 uppercase tracking-wide">
                  Daily Login Bonus
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Flame className="w-3.5 h-3.5 text-orange-400" />
                  <span className="text-sm font-bold text-foreground">
                    {streak > 0 ? `${streak} Day Streak!` : 'Start Your Streak'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Reward Amount */}
          <AnimatePresence mode="wait">
            {canClaim ? (
              <motion.div
                key="claimable"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="p-4 rounded-xl bg-gradient-to-br from-green-500/15 to-emerald-500/10 border border-green-500/30"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-green-400 font-medium mb-1">
                      Ready to Claim!
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-green-400">+{nextReward}</span>
                      <span className="text-sm text-green-400/70 font-medium">YC</span>
                    </div>
                  </div>
                  <Button
                    onClick={handleQuickClaim}
                    disabled={isClaiming}
                    variant="primary"
                    size="sm"
                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-lg shadow-green-500/30"
                  >
                    {isClaiming ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Claiming</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        <span>Claim Now</span>
                      </div>
                    )}
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="next-reward"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="text-xs text-foreground/60 font-medium">Next Reward</div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-bold text-purple-400">+{nextReward}</span>
                    <span className="text-xs text-purple-400/70 font-medium">YC</span>
                  </div>
                </div>
                <div className="text-[10px] text-foreground/50">
                  ⏰ Come back tomorrow to claim
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-foreground/60 font-medium">Progress to Max Reward</span>
              <span className="text-foreground/80 font-bold">Day {currentDay}/7</span>
            </div>
            <div className="relative h-2.5 bg-gray-800/50 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-full"
              />
              <motion.div
                animate={{ x: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                style={{ width: '30%' }}
              />
            </div>
            <div className="flex items-center justify-between gap-1 pt-1">
              {REWARDS_LADDER.map((reward, idx) => (
                <div key={idx} className="flex flex-col items-center gap-1">
                  <div className={`text-xs transition-all ${
                    idx < currentDay
                      ? 'text-purple-400 scale-110'
                      : 'text-gray-600 scale-90'
                  }`}>
                    {reward.emoji}
                  </div>
                  <div className={`text-[9px] font-semibold ${
                    idx < currentDay ? 'text-purple-400' : 'text-gray-600'
                  }`}>
                    {reward.amount}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <button
            onClick={() => setShowModal(true)}
            className="w-full py-2 px-3 rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10 hover:from-purple-500/20 hover:to-pink-500/20 border border-purple-500/20 hover:border-purple-500/30 transition-all group"
          >
            <div className="flex items-center justify-center gap-2 text-xs font-medium text-foreground/70 group-hover:text-foreground/90">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>View Full Rewards Calendar</span>
              <Star className="w-3 h-3" />
            </div>
          </button>
        </div>
      </motion.div>

      <DailyRewards isOpen={showModal} onClose={() => {
        setShowModal(false);
        checkDaily();
      }} />
    </>
  );
}
