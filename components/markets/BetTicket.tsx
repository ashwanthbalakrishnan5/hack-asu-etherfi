'use client';

import { useState, useEffect } from 'react';
import { Market, ClaudeProbabilityHint } from '@/lib/types';
import { X, TrendingUp, TrendingDown, Sparkles, Loader2, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAccount } from 'wagmi';
import { formatDistanceToNow } from 'date-fns';
import { toast } from '@/lib/stores/toast';

interface BetTicketProps {
  market: Market | null;
  isOpen: boolean;
  onClose: () => void;
  onBetPlaced?: () => void;
  ycBalance: number;
}

export function BetTicket({
  market,
  isOpen,
  onClose,
  onBetPlaced,
  ycBalance,
}: BetTicketProps) {
  const { address } = useAccount();
  const [side, setSide] = useState<'YES' | 'NO'>('YES');
  const [amount, setAmount] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hint, setHint] = useState<ClaudeProbabilityHint | null>(null);
  const [loadingHint, setLoadingHint] = useState(false);

  // Reset state when market changes
  useEffect(() => {
    if (market && isOpen) {
      setSide('YES');
      setAmount('');
      setError(null);
      fetchProbabilityHint();
    }
  }, [market, isOpen]);

  // Handle ESC key to close
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  const fetchProbabilityHint = async () => {
    if (!market) return;

    try {
      setLoadingHint(true);
      const response = await fetch('/api/claude/probability-hint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: market.question,
          difficulty: market.difficulty,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setHint(data);
      }
    } catch (err) {
      console.error('Failed to fetch hint:', err);
      // Don't show error for hints - they're optional
    } finally {
      setLoadingHint(false);
    }
  };

  const calculateExpectedPayout = () => {
    if (!market || !amount || parseFloat(amount) <= 0) return 0;

    const betAmount = parseFloat(amount);
    const totalPool = market.yesPool + market.noPool + betAmount;
    const sidePool =
      (side === 'YES' ? market.yesPool : market.noPool) + betAmount;

    if (sidePool === 0) return betAmount;

    return betAmount * (totalPool / sidePool);
  };

  const handlePlaceBet = async () => {
    if (!market || !address) return;

    const betAmount = parseFloat(amount);

    // Validation
    if (isNaN(betAmount) || betAmount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (betAmount > ycBalance) {
      setError(`Insufficient YC balance. You have ${ycBalance.toFixed(2)} YC`);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/positions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userAddress: address,
          marketId: market.id,
          side,
          amount: betAmount,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to place bet');
      }

      // Success!
      toast.success(`Bet placed successfully! ${betAmount.toFixed(2)} YC on ${side}`);
      onBetPlaced?.();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to place bet');
    } finally {
      setLoading(false);
    }
  };

  const expectedPayout = calculateExpectedPayout();
  const potentialProfit = expectedPayout - (parseFloat(amount) || 0);

  if (!market) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 shadow-2xl z-50 overflow-y-auto border-l-2 border-cyan-500/30"
          >
            {/* Animated Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <motion.div
                className="absolute inset-0"
                style={{
                  backgroundImage: 'radial-gradient(circle, #06b6d4 1px, transparent 1px)',
                  backgroundSize: '30px 30px'
                }}
                animate={{
                  backgroundPosition: ['0px 0px', '30px 30px']
                }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              />
            </div>
            <div className="p-6 space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex-1 pr-4">
                  <h2 className="text-2xl font-bold text-white mb-2">Place Bet</h2>
                  <p className="text-sm text-gray-400 line-clamp-2">
                    {market.question}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                  aria-label="Close"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {/* YC Balance */}
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="relative bg-gradient-to-br from-cyan-500/10 via-gray-800 to-gray-800 rounded-xl p-5 border border-cyan-500/30 overflow-hidden"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-transparent"
                  animate={{ x: ['100%', '-100%'] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                />
                <div className="relative z-10">
                  <div className="text-sm text-gray-400 mb-1 flex items-center gap-2">
                    <span>💰</span>
                    <span>Your YC Balance</span>
                  </div>
                  <motion.div
                    className="text-4xl font-bold text-cyan-400"
                    animate={{ scale: [1, 1.02, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {ycBalance.toFixed(2)} <span className="text-xl text-gray-500">YC</span>
                  </motion.div>
                </div>
              </motion.div>

              {/* Side Selector */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                  <span>Select Your Prediction</span>
                  <motion.span
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
                    className="text-lg"
                  >
                    🎯
                  </motion.span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <motion.button
                    onClick={() => setSide('YES')}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`relative p-5 rounded-xl border-2 transition-all overflow-hidden ${
                      side === 'YES'
                        ? 'border-green-500 bg-gradient-to-br from-green-500/30 via-green-500/20 to-green-500/10 text-green-400 shadow-lg shadow-green-500/20'
                        : 'border-gray-700 bg-gray-800 text-gray-400 hover:border-green-500/50 hover:bg-gray-800/80'
                    }`}
                  >
                    {side === 'YES' && (
                      <motion.div
                        layoutId="selected-side"
                        className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-transparent"
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <div className="relative z-10">
                      <motion.div
                        animate={side === 'YES' ? { y: [0, -5, 0] } : {}}
                        transition={{ duration: 0.5 }}
                      >
                        <TrendingUp className="w-6 h-6 mx-auto mb-2" />
                      </motion.div>
                      <div className={`font-bold text-lg mb-1 ${side === 'YES' ? 'text-green-300' : ''}`}>YES</div>
                      <div className={`text-xs ${side === 'YES' ? 'text-green-400/80' : 'opacity-75'}`}>
                        {((market.yesPool / (market.yesPool + market.noPool)) * 100 || 50).toFixed(1)}% pool
                      </div>
                    </div>
                    {side === 'YES' && (
                      <motion.div
                        className="absolute top-2 right-2"
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: 'spring', bounce: 0.5 }}
                      >
                        <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      </motion.div>
                    )}
                  </motion.button>
                  <motion.button
                    onClick={() => setSide('NO')}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`relative p-5 rounded-xl border-2 transition-all overflow-hidden ${
                      side === 'NO'
                        ? 'border-red-500 bg-gradient-to-br from-red-500/30 via-red-500/20 to-red-500/10 text-red-400 shadow-lg shadow-red-500/20'
                        : 'border-gray-700 bg-gray-800 text-gray-400 hover:border-red-500/50 hover:bg-gray-800/80'
                    }`}
                  >
                    {side === 'NO' && (
                      <motion.div
                        layoutId="selected-side"
                        className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-transparent"
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <div className="relative z-10">
                      <motion.div
                        animate={side === 'NO' ? { y: [0, -5, 0] } : {}}
                        transition={{ duration: 0.5 }}
                      >
                        <TrendingDown className="w-6 h-6 mx-auto mb-2" />
                      </motion.div>
                      <div className={`font-bold text-lg mb-1 ${side === 'NO' ? 'text-red-300' : ''}`}>NO</div>
                      <div className={`text-xs ${side === 'NO' ? 'text-red-400/80' : 'opacity-75'}`}>
                        {((market.noPool / (market.yesPool + market.noPool)) * 100 || 50).toFixed(1)}% pool
                      </div>
                    </div>
                    {side === 'NO' && (
                      <motion.div
                        className="absolute top-2 right-2"
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: 'spring', bounce: 0.5 }}
                      >
                        <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      </motion.div>
                    )}
                  </motion.button>
                </div>
              </div>

              {/* Amount Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  Bet Amount (YC)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    max={ycBalance}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  />
                  <button
                    onClick={() => setAmount(ycBalance.toString())}
                    className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-1 text-xs font-medium text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    MAX
                  </button>
                </div>
                <div className="text-xs text-gray-500">
                  Available: {ycBalance.toFixed(2)} YC
                </div>
              </div>

              {/* Expected Payout */}
              {parseFloat(amount) > 0 && (
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="relative bg-gradient-to-br from-cyan-500/20 via-blue-500/10 to-purple-500/10 border-2 border-cyan-500/40 rounded-xl p-5 overflow-hidden"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-blue-500/10"
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                  />
                  <div className="relative z-10 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-300 font-medium flex items-center gap-2">
                        <Trophy className="w-4 h-4 text-cyan-400" />
                        Expected Payout
                      </span>
                      <div className="text-right">
                        <motion.span
                          className="text-2xl font-bold text-cyan-400"
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{ duration: 1, repeat: Infinity }}
                        >
                          {expectedPayout.toFixed(2)} YC
                        </motion.span>
                        <motion.span
                          className="ml-2 text-sm text-cyan-400/80 font-bold"
                          animate={{ opacity: [0.6, 1, 0.6] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          ({(expectedPayout / (parseFloat(amount) || 1)).toFixed(2)}x)
                        </motion.span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-cyan-500/20">
                      <span className="text-sm text-gray-300 font-medium">Potential Profit</span>
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className={`text-lg font-bold flex items-center gap-1 ${
                          potentialProfit > 0 ? 'text-green-400' : 'text-gray-400'
                        }`}
                      >
                        {potentialProfit > 0 && <TrendingUp className="w-4 h-4" />}
                        +{potentialProfit.toFixed(2)} YC
                      </motion.span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Claude Probability Hint */}
              {loadingHint && (
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-purple-400">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Getting Claude's insights...</span>
                  </div>
                </div>
              )}

              {hint && !loadingHint && (
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 space-y-2">
                  <div className="flex items-center gap-2 text-purple-400 mb-2">
                    <Sparkles className="w-4 h-4" />
                    <span className="text-sm font-medium">Claude's Analysis</span>
                  </div>
                  <div className="text-sm text-gray-300">
                    <div className="mb-2">
                      <span className="font-medium text-purple-400">
                        Probability:
                      </span>{' '}
                      {(hint.probability * 100).toFixed(1)}% YES
                    </div>
                    <div className="mb-2 text-gray-400">{hint.rationale}</div>
                    <div className="text-xs text-purple-300/80 italic">
                      💡 Tip: {hint.tip}
                    </div>
                  </div>
                </div>
              )}

              {/* Market Info */}
              <div className="text-xs text-gray-500 space-y-1">
                <div>Difficulty: {market.difficulty}/5</div>
                <div>
                  Closes {formatDistanceToNow(new Date(market.closeTime), { addSuffix: true })}
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 text-sm text-red-400">
                  {error}
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <motion.button
                  onClick={handlePlaceBet}
                  disabled={loading || !address || parseFloat(amount) <= 0}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative w-full px-6 py-4 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 text-white font-bold rounded-xl shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-200 overflow-hidden group"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-purple-500 via-cyan-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    animate={{ x: ['0%', '100%'] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                  <div className="relative z-10 flex items-center justify-center gap-2">
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Placing Bet...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        <span>Confirm Bet</span>
                        <Sparkles className="w-5 h-5" />
                      </>
                    )}
                  </div>
                </motion.button>
                <motion.button
                  onClick={onClose}
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full px-6 py-3 bg-gray-800 border border-gray-700 text-gray-300 font-medium rounded-xl hover:bg-gray-700 hover:border-gray-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
