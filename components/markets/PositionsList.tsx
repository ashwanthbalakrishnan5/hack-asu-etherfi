'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { Trophy, TrendingUp, TrendingDown, Clock, Loader2, Gift, Sparkles, PartyPopper, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';

interface Position {
  id: string;
  side: 'YES' | 'NO';
  amount: number;
  claimed: boolean;
  createdAt: string;
  market: {
    id: string;
    question: string;
    resolved: boolean;
    outcome?: 'YES' | 'NO' | 'CANCEL';
    closeTime: string;
  };
}

interface PositionsListProps {
  onPositionClaimed?: () => void;
}

export function PositionsList({ onPositionClaimed }: PositionsListProps) {
  const { address } = useAccount();
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(true);
  const [claimingId, setClaimingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    if (address) {
      fetchPositions();
    }
  }, [address]);

  const fetchPositions = async () => {
    if (!address) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/positions?userAddress=${address}`);

      if (!response.ok) {
        throw new Error('Failed to fetch positions');
      }

      const data = await response.json();
      setPositions(data);
    } catch (err) {
      console.error('Error fetching positions:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch positions');
    } finally {
      setLoading(false);
    }
  };

  const handleClaim = async (positionId: string) => {
    if (!address) return;

    try {
      setClaimingId(positionId);
      setError(null);

      const response = await fetch(`/api/positions/${positionId}/claim`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userAddress: address }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to claim position');
      }

      // Success - show celebration!
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);

      // Refresh positions
      await fetchPositions();
      onPositionClaimed?.();

      console.log('Claimed successfully!', data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to claim position');
    } finally {
      setClaimingId(null);
    }
  };

  const canClaim = (position: Position) => {
    return (
      position.market.resolved &&
      !position.claimed &&
      (position.market.outcome === position.side ||
        position.market.outcome === 'CANCEL')
    );
  };

  const getPositionStatus = (position: Position) => {
    if (!position.market.resolved) {
      return { label: 'Pending', color: 'text-yellow-400', bg: 'bg-yellow-500/20' };
    }

    if (position.claimed) {
      if (position.market.outcome === position.side) {
        return { label: 'Won & Claimed', color: 'text-green-400', bg: 'bg-green-500/20' };
      } else if (position.market.outcome === 'CANCEL') {
        return { label: 'Refunded', color: 'text-gray-400', bg: 'bg-gray-500/20' };
      } else {
        return { label: 'Lost', color: 'text-red-400', bg: 'bg-red-500/20' };
      }
    }

    if (position.market.outcome === position.side) {
      return { label: 'Won - Claim!', color: 'text-cyan-400', bg: 'bg-cyan-500/20' };
    } else if (position.market.outcome === 'CANCEL') {
      return { label: 'Cancelled - Claim Refund', color: 'text-cyan-400', bg: 'bg-cyan-500/20' };
    } else {
      return { label: 'Lost', color: 'text-red-400', bg: 'bg-red-500/20' };
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          <Loader2 className="w-8 h-8 text-cyan-400" />
        </motion.div>
        <motion.p
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-sm text-gray-400 mt-3"
        >
          Loading your positions...
        </motion.p>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-red-500/10 border-2 border-red-500/50 rounded-xl p-6 text-center"
      >
        <XCircle className="w-12 h-12 mx-auto mb-3 text-red-400" />
        <p className="text-sm text-red-400 font-medium">{error}</p>
      </motion.div>
    );
  }

  if (positions.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12 text-gray-400"
      >
        <motion.div
          animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <Trophy className="w-16 h-16 mx-auto mb-4 opacity-50" />
        </motion.div>
        <p className="text-lg font-medium mb-2">No positions yet</p>
        <p className="text-sm text-gray-500">Place your first bet to get started!</p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-3 relative">
      {/* Celebration Overlay */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 1, repeat: 2 }}
              className="text-9xl"
            >
              🎉
            </motion.div>
            {[...Array(20)].map((_, i) => {
              // Pre-calculate random values outside render to avoid hydration issues
              const randomX = (i * 37) % 400 - 200; // Pseudo-random but deterministic
              const randomY = (i * 53) % 400 - 200;
              const randomRotate = (i * 71) % 360;
              const emojiIndex = i % 4;

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 1, x: 0, y: 0 }}
                  animate={{
                    opacity: [1, 0],
                    x: randomX,
                    y: randomY,
                    rotate: randomRotate
                  }}
                  transition={{ duration: 2, delay: i * 0.05 }}
                  className="absolute text-4xl"
                  style={{ left: '50%', top: '50%' }}
                >
                  {['✨', '🎊', '💫', '⭐'][emojiIndex]}
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {positions.map((position, index) => {
        const status = getPositionStatus(position);
        const isClamable = canClaim(position);

        return (
          <motion.div
            key={position.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02, x: 4 }}
            className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-5 border border-gray-700 hover:border-cyan-500/50 transition-all duration-200 overflow-hidden group"
          >
            {/* Background Accent based on status */}
            {isClamable && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-purple-500/5 to-blue-500/5"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              />
            )}
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <p className="text-sm font-bold text-white line-clamp-2 mb-3 group-hover:text-cyan-100 transition-colors">
                    {position.market.question}
                  </p>
                  <div className="flex items-center gap-3 flex-wrap text-xs">
                    <motion.span
                      whileHover={{ scale: 1.1 }}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full font-medium ${
                        position.side === 'YES'
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                          : 'bg-red-500/20 text-red-400 border border-red-500/30'
                      }`}
                    >
                      {position.side === 'YES' ? (
                        <TrendingUp className="w-3.5 h-3.5" />
                      ) : (
                        <TrendingDown className="w-3.5 h-3.5" />
                      )}
                      {position.side}
                    </motion.span>
                    <span className="px-2.5 py-1 bg-cyan-500/10 text-cyan-400 rounded-full font-bold border border-cyan-500/30">
                      {position.amount.toFixed(2)} YC
                    </span>
                    <span className="flex items-center gap-1 text-gray-400">
                      <Clock className="w-3 h-3" />
                      {formatDistanceToNow(new Date(position.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                </div>

                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  whileHover={{ scale: 1.1 }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border-2 ${status.bg} ${status.color}`}
                >
                  {status.label}
                </motion.span>
              </div>

              {isClamable && (
                <motion.button
                  onClick={() => handleClaim(position.id)}
                  disabled={claimingId === position.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative w-full mt-3 px-5 py-3 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 text-white text-sm font-bold rounded-xl shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 overflow-hidden group/btn"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-purple-500 via-cyan-500 to-blue-500 opacity-0 group-hover/btn:opacity-100 transition-opacity"
                    animate={{ x: ['0%', '100%'] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                  <div className="relative z-10 flex items-center justify-center gap-2">
                    {claimingId === position.id ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Claiming...</span>
                      </>
                    ) : (
                      <>
                        <PartyPopper className="w-5 h-5" />
                        <span>Claim {position.market.outcome === 'CANCEL' ? 'Refund' : 'Winnings'}</span>
                        <Sparkles className="w-5 h-5" />
                      </>
                    )}
                  </div>
                </motion.button>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
