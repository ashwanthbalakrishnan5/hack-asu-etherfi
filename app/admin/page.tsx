'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { Market } from '@/lib/types';
import { Plus, CheckCircle, XCircle, Ban, Loader2 } from 'lucide-react';
import { config } from '@/lib/config';

export default function AdminPage() {
  const { address } = useAccount();
  const [markets, setMarkets] = useState<Market[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const isAdmin = config.adminAddresses.includes(address?.toLowerCase() || '');

  useEffect(() => {
    if (address && isAdmin) {
      fetchMarkets();
    }
  }, [address, isAdmin]);

  const fetchMarkets = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/markets');
      if (response.ok) {
        const data = await response.json();
        setMarkets(data);
      }
    } catch (error) {
      console.error('Error fetching markets:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!address) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center p-6">
        <div className="bg-gray-800 rounded-lg p-8 text-center border border-gray-700">
          <h1 className="text-2xl font-bold text-white mb-4">Admin Panel</h1>
          <p className="text-gray-400">Please connect your wallet to access the admin panel.</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center p-6">
        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-8 text-center">
          <h1 className="text-2xl font-bold text-red-400 mb-4">Access Denied</h1>
          <p className="text-gray-400">You do not have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Admin Panel</h1>
            <p className="text-gray-400">Create and manage prediction markets</p>
          </div>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-medium rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-200 shadow-lg shadow-cyan-500/20 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create Market
          </button>
        </div>

        {/* Create Market Form */}
        {showCreateForm && (
          <CreateMarketForm
            onClose={() => setShowCreateForm(false)}
            onCreated={() => {
              setShowCreateForm(false);
              fetchMarkets();
            }}
            adminAddress={address}
          />
        )}

        {/* Markets List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white">Markets</h2>
            {markets.length === 0 ? (
              <div className="bg-gray-800 rounded-lg p-8 text-center border border-gray-700">
                <p className="text-gray-400">No markets yet. Create your first market!</p>
              </div>
            ) : (
              markets.map((market) => (
                <MarketAdminCard
                  key={market.id}
                  market={market}
                  onResolved={fetchMarkets}
                  adminAddress={address}
                />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Create Market Form Component
function CreateMarketForm({
  onClose,
  onCreated,
  adminAddress,
}: {
  onClose: () => void;
  onCreated: () => void;
  adminAddress: string;
}) {
  const [question, setQuestion] = useState('');
  const [difficulty, setDifficulty] = useState(3);
  const [daysUntilClose, setDaysUntilClose] = useState(7);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!question.trim()) {
      setError('Question is required');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const closeTime = new Date();
      closeTime.setDate(closeTime.getDate() + daysUntilClose);

      const response = await fetch('/api/markets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: question.trim(),
          closeTime: closeTime.toISOString(),
          difficulty,
          adminAddress,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create market');
      }

      onCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create market');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h2 className="text-xl font-bold text-white mb-4">Create New Market</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Question
          </label>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Will Bitcoin reach $100k by end of 2025?"
            className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Difficulty (1-5)
            </label>
            <input
              type="number"
              value={difficulty}
              onChange={(e) => setDifficulty(parseInt(e.target.value))}
              min="1"
              max="5"
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Days Until Close
            </label>
            <input
              type="number"
              value={daysUntilClose}
              onChange={(e) => setDaysUntilClose(parseInt(e.target.value))}
              min="1"
              max="365"
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-medium rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating...' : 'Create Market'}
          </button>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 bg-gray-700 text-gray-300 font-medium rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

// Market Admin Card Component
function MarketAdminCard({
  market,
  onResolved,
  adminAddress,
}: {
  market: Market & { totalPool?: number; positions?: any[] };
  onResolved: () => void;
  adminAddress: string;
}) {
  const [resolving, setResolving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleResolve = async (outcome: 'YES' | 'NO' | 'CANCEL') => {
    if (!confirm(`Are you sure you want to resolve this market with outcome: ${outcome}?`)) {
      return;
    }

    try {
      setResolving(true);
      setError(null);

      const response = await fetch(`/api/markets/${market.id}/resolve`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          outcome,
          adminAddress,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to resolve market');
      }

      onResolved();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resolve market');
    } finally {
      setResolving(false);
    }
  };

  const totalPool = market.totalPool || market.yesPool + market.noPool;

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white mb-2">{market.question}</h3>
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <span>Difficulty: {market.difficulty}/5</span>
            <span>Total Pool: {totalPool.toFixed(2)} YC</span>
            <span>Positions: {market.positions?.length || 0}</span>
          </div>
        </div>
        <div>
          {market.resolved ? (
            <span className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm font-medium">
              Resolved: {market.outcome}
            </span>
          ) : (
            <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium">
              Active
            </span>
          )}
        </div>
      </div>

      {!market.resolved && (
        <div className="flex gap-2 pt-4 border-t border-gray-700">
          <button
            onClick={() => handleResolve('YES')}
            disabled={resolving}
            className="flex-1 px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <CheckCircle className="w-4 h-4" />
            Resolve YES
          </button>
          <button
            onClick={() => handleResolve('NO')}
            disabled={resolving}
            className="flex-1 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <XCircle className="w-4 h-4" />
            Resolve NO
          </button>
          <button
            onClick={() => handleResolve('CANCEL')}
            disabled={resolving}
            className="px-4 py-2 bg-gray-700 text-gray-400 rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Ban className="w-4 h-4" />
            Cancel
          </button>
        </div>
      )}

      {error && (
        <div className="mt-4 bg-red-500/10 border border-red-500/50 rounded-lg p-3 text-sm text-red-400">
          {error}
        </div>
      )}
    </div>
  );
}
