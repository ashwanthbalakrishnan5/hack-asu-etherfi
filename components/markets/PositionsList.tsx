'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { Trophy, TrendingUp, TrendingDown, Clock, Loader2, Gift } from 'lucide-react';
import { motion } from 'framer-motion';
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

      // Success - refresh positions
      await fetchPositions();
      onPositionClaimed?.();

      // Show success message (you can add a toast later)
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
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 text-cyan-400 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 text-sm text-red-400">
        {error}
      </div>
    );
  }

  if (positions.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        <Trophy className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p className="text-sm">No positions yet. Place your first bet!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {positions.map((position) => {
        const status = getPositionStatus(position);
        const isClamable = canClaim(position);

        return (
          <motion.div
            key={position.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800 rounded-lg p-4 border border-gray-700"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <p className="text-sm font-medium text-white line-clamp-2 mb-2">
                  {position.market.question}
                </p>
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    {position.side === 'YES' ? (
                      <TrendingUp className="w-3 h-3 text-green-400" />
                    ) : (
                      <TrendingDown className="w-3 h-3 text-red-400" />
                    )}
                    {position.side}
                  </span>
                  <span>{position.amount.toFixed(2)} YC</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatDistanceToNow(new Date(position.createdAt), { addSuffix: true })}
                  </span>
                </div>
              </div>

              <span className={`px-2 py-1 rounded text-xs font-medium ${status.bg} ${status.color}`}>
                {status.label}
              </span>
            </div>

            {isClamable && (
              <button
                onClick={() => handleClaim(position.id)}
                disabled={claimingId === position.id}
                className="w-full mt-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-sm font-medium rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-200 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {claimingId === position.id ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Claiming...
                  </>
                ) : (
                  <>
                    <Gift className="w-4 h-4" />
                    Claim {position.market.outcome === 'CANCEL' ? 'Refund' : 'Winnings'}
                  </>
                )}
              </button>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
