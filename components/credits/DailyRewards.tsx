'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Card, Button } from '@/components/ui';
import { X, Calendar, Flame, Gift, Star, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAccount } from 'wagmi';
import { toast } from '@/lib/stores/toast';

interface DailyReward {
  day: number;
  credits: number;
  claimed: boolean;
  bonus?: string;
}

interface DailyRewardsProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DailyRewards({ isOpen, onClose }: DailyRewardsProps) {
  const { address } = useAccount();
  const [currentStreak, setCurrentStreak] = useState(0);
  const [canClaim, setCanClaim] = useState(true);
  const [isClaiming, setIsClaiming] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [rewards, setRewards] = useState<DailyReward[]>([
    { day: 1, credits: 50, claimed: false },
    { day: 2, credits: 75, claimed: false },
    { day: 3, credits: 100, claimed: false, bonus: '🔥' },
    { day: 4, credits: 150, claimed: false },
    { day: 5, credits: 200, claimed: false, bonus: '⚡' },
    { day: 6, credits: 300, claimed: false },
    { day: 7, credits: 500, claimed: false, bonus: '🎁 JACKPOT' },
  ]);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (address && isOpen) {
      fetchDailyRewardStatus();
    }
  }, [address, isOpen]);

  const fetchDailyRewardStatus = async () => {
    try {
      const response = await fetch(`/api/rewards/daily?address=${address}`);
      if (response.ok) {
        const data = await response.json();
        setCurrentStreak(data.streak);
        setCanClaim(data.canClaim);
        // Update claimed status based on streak
        setRewards(prev => prev.map((reward, idx) => ({
          ...reward,
          claimed: idx < data.streak
        })));
      }
    } catch (error) {
      console.error('Error fetching daily rewards:', error);
    }
  };

  const handleClaim = async () => {
    if (!address || !canClaim) return;

    setIsClaiming(true);
    try {
      const response = await fetch('/api/rewards/daily/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address }),
      });

      if (response.ok) {
        const data = await response.json();
        const nextDay = currentStreak + 1;
        const reward = rewards[currentStreak];

        toast.success(
          `🎉 Day ${nextDay} Claimed! +${reward.credits} Credits`
        );

        setCurrentStreak(nextDay);
        setCanClaim(false);
        setRewards(prev => prev.map((r, idx) => ({
          ...r,
          claimed: idx < nextDay
        })));
      } else {
        toast.error('Failed to claim reward');
      }
    } catch (error) {
      console.error('Claim error:', error);
      toast.error('Failed to claim reward');
    } finally {
      setIsClaiming(false);
    }
  };

  const nextReward = rewards[currentStreak];
  const completedAll = currentStreak >= 7;

  if (!mounted) return null;

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9998]"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-[9999] overflow-y-auto flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-lg"
              onClick={(e) => e.stopPropagation()}
            >
                <Card className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 border-purple-400/30">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500/20 to-blue-500/20">
                      <Calendar className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-foreground">Daily Rewards</h2>
                      <p className="text-sm text-foreground/60">
                        Streak: <span className="text-purple-400 font-bold">{currentStreak} day{currentStreak !== 1 ? 's' : ''}</span>
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-lg hover:bg-gray-700/50 transition-colors"
                  >
                    <X className="w-5 h-5 text-foreground/70" />
                  </button>
                </div>

                {/* Streak Visualization */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Flame className={`w-5 h-5 ${currentStreak > 0 ? 'text-orange-400' : 'text-gray-500'}`} />
                    <span className="text-sm font-semibold text-foreground/70">Your Progress</span>
                  </div>
                  <div className="grid grid-cols-7 gap-2">
                    {rewards.map((reward) => (
                      <motion.div
                        key={reward.day}
                        whileHover={{ scale: 1.05 }}
                        className={`relative aspect-square rounded-lg border-2 flex flex-col items-center justify-center transition-all ${
                          reward.claimed
                            ? 'border-green-400 bg-green-400/10'
                            : reward.day === currentStreak + 1 && canClaim
                            ? 'border-purple-400 bg-purple-400/20 animate-pulse'
                            : 'border-gray-700 bg-gray-800/50'
                        }`}
                      >
                        {reward.claimed ? (
                          <Check className="w-5 h-5 text-green-400" />
                        ) : (
                          <>
                            <div className={`text-xs font-bold ${
                              reward.day === currentStreak + 1 && canClaim
                                ? 'text-purple-400'
                                : 'text-foreground/60'
                            }`}>
                              {reward.day}
                            </div>
                            <div className={`text-[10px] font-semibold ${
                              reward.day === currentStreak + 1 && canClaim
                                ? 'text-purple-400'
                                : 'text-foreground/50'
                            }`}>
                              {reward.credits}
                            </div>
                          </>
                        )}
                        {reward.bonus && !reward.claimed && (
                          <div className="absolute -top-1 -right-1 text-xs">
                            {reward.bonus.startsWith('🎁') ? '🎁' : reward.bonus}
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Next Reward Card */}
                {!completedAll && nextReward && (
                  <div className="p-4 rounded-lg bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-400/20 mb-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="text-sm text-foreground/70 mb-1">
                          {canClaim ? 'Today\'s Reward' : 'Next Reward'}
                        </div>
                        <div className="flex items-center gap-2">
                          <Gift className="w-5 h-5 text-purple-400" />
                          <span className="text-2xl font-bold text-purple-400">
                            {nextReward.credits} YC
                          </span>
                          {nextReward.bonus && (
                            <span className="text-sm px-2 py-1 rounded-full bg-purple-400/20 text-purple-400">
                              {nextReward.bonus}
                            </span>
                          )}
                        </div>
                      </div>
                      {canClaim && (
                        <Button
                          onClick={handleClaim}
                          disabled={isClaiming}
                          variant="primary"
                          className="gap-2"
                        >
                          {isClaiming ? 'Claiming...' : (
                            <>
                              <Star className="w-4 h-4" />
                              Claim
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                    {!canClaim && (
                      <div className="text-xs text-foreground/60">
                        Come back tomorrow to claim your next reward!
                      </div>
                    )}
                  </div>
                )}

                {/* Completed Message */}
                {completedAll && (
                  <div className="p-4 rounded-lg bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-400/20">
                    <div className="flex items-center gap-3">
                      <Star className="w-6 h-6 text-green-400" />
                      <div>
                        <div className="font-semibold text-green-400">Week Complete!</div>
                        <div className="text-sm text-foreground/70">
                          Come back tomorrow to restart your streak
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Info */}
                <div className="text-xs text-foreground/50 text-center">
                  Login daily to build your streak and earn more credits!
                </div>
              </Card>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
}
