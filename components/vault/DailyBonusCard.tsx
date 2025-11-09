'use client';

import { useState, useEffect } from 'react';
import { Gift, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAccount } from 'wagmi';
import { Card, Button } from '@/components/ui';
import { DailyRewards } from '@/components/credits';
import { toast } from '@/lib/stores/toast';

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

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.01 }}
        className="relative overflow-hidden rounded-xl border-2 border-purple-500/30 bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-transparent p-4 cursor-pointer"
        onClick={() => setShowModal(true)}
      >
        {canClaim && (
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute -top-1 -right-1 w-3 h-3 bg-purple-400 rounded-full"
          />
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${canClaim ? 'bg-purple-400/20 animate-pulse' : 'bg-purple-500/20'}`}>
              <Gift className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <div className="text-xs text-foreground/60 mb-0.5">
                {canClaim ? 'Daily Bonus Ready!' : 'Daily Streak'}
              </div>
              <div className="flex items-center gap-2">
                {canClaim ? (
                  <span className="text-lg font-bold text-purple-400">
                    +{nextReward} YC
                  </span>
                ) : (
                  <>
                    <span className="text-lg font-bold text-purple-400">{streak}</span>
                    <span className="text-xs text-foreground/60">days</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {canClaim ? (
            <Button
              size="sm"
              variant="primary"
              onClick={(e) => {
                e.stopPropagation();
                handleQuickClaim();
              }}
              disabled={isClaiming}
              className="text-xs"
            >
              {isClaiming ? 'Claiming...' : 'Claim'}
            </Button>
          ) : (
            <Calendar className="w-4 h-4 text-foreground/40" />
          )}
        </div>

        {!canClaim && (
          <div className="mt-2 text-[10px] text-foreground/50">
            Come back tomorrow
          </div>
        )}
      </motion.div>

      <DailyRewards isOpen={showModal} onClose={() => {
        setShowModal(false);
        checkDaily();
      }} />
    </>
  );
}
