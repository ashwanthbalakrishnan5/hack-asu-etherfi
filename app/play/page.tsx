'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { Card } from '@/components/ui';
import { WalletButton } from '@/components/wallet/WalletButton';
import { VaultCard } from '@/components/vault';
import { MarketsList } from '@/components/markets/MarketsList';
import { BetTicket } from '@/components/markets/BetTicket';
import { PositionsList } from '@/components/markets/PositionsList';
import { QuestsPanel } from '@/components/quests';
import { Market, Quest } from '@/lib/types';
import { Trophy } from 'lucide-react';
import { toast } from '@/lib/stores/toast';
import { useAutoResolve } from '@/lib/hooks/useAutoResolve';

export default function PlayPage() {
  const { isConnected, address } = useAccount();
  const [selectedMarket, setSelectedMarket] = useState<Market | null>(null);
  const [isBetTicketOpen, setIsBetTicketOpen] = useState(false);
  const [ycBalance, setYcBalance] = useState<number>(0);
  const [refreshKey, setRefreshKey] = useState(0);

  // Auto-resolve markets in the background
  useAutoResolve(isConnected);

  // Fetch YC balance
  useEffect(() => {
    if (address) {
      fetchYCBalance();
    }
  }, [address, refreshKey]);

  // Listen for market resolution events and refresh
  useEffect(() => {
    const handleMarketsResolved = () => {
      setRefreshKey((prev) => prev + 1);
      toast.success('Markets have been resolved! Check your positions.');
    };

    window.addEventListener('markets-resolved', handleMarketsResolved as EventListener);
    return () => {
      window.removeEventListener('markets-resolved', handleMarketsResolved as EventListener);
    };
  }, []);

  const fetchYCBalance = async () => {
    if (!address) return;

    try {
      const response = await fetch(`/api/yc/balance?address=${address}`);
      if (response.ok) {
        const data = await response.json();
        // Ensure balance is always a number
        setYcBalance(typeof data.balance === 'number' ? data.balance : parseFloat(data.balance) || 0);
      }
    } catch (error) {
      console.error('Error fetching YC balance:', error);
    }
  };

  const handlePlaceBet = (market: Market, suggestedStake?: number) => {
    setSelectedMarket(market);
    setIsBetTicketOpen(true);
  };

  const handleBetPlaced = () => {
    // Refresh YC balance and markets list
    setRefreshKey((prev) => prev + 1);
  };

  const handleAcceptQuest = async (quest: Quest) => {
    if (!address) {
      toast.error("Please connect your wallet");
      return;
    }

    try {
      const response = await fetch("/api/quests/accept", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          questId: quest.id,
          address,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to accept quest");
      }

      const data = await response.json();

      // Convert market data to Market type
      const market: Market = {
        id: data.market.id,
        question: data.market.question,
        closeTime: new Date(data.market.closeTime).getTime(),
        difficulty: data.market.difficulty,
        yesPool: data.market.yesPool,
        noPool: data.market.noPool,
        resolved: data.market.resolved,
        outcome: data.market.outcome,
        createdAt: new Date(data.market.createdAt).getTime(),
      };

      // Open bet ticket with the market
      setSelectedMarket(market);
      setIsBetTicketOpen(true);

      toast.success("Quest accepted! Now place your bet.");

      // Refresh markets list
      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      console.error("Error accepting quest:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to accept quest"
      );
    }
  };

  if (!isConnected) {
    return (
      <div className="flex min-h-[calc(100vh-200px)] items-center justify-center px-6 py-16 mx-auto" style={{ maxWidth: '1800px' }}>
        <Card className="max-w-md text-center">
          <h2 className="mb-4 text-2xl font-bold text-foreground">
            Connect Your Wallet
          </h2>
          <p className="mb-6 text-foreground/70">
            Connect your wallet to start playing and managing your predictions.
          </p>
          <WalletButton />
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="w-full py-8 px-6 mx-auto" style={{ maxWidth: '1800px' }}>
        <div className="grid gap-6 lg:grid-cols-[400px_1fr]">
          {/* Left Column: Vault and YC Meter */}
          <div className="space-y-6 lg:sticky lg:top-24 lg:self-start lg:max-h-[calc(100vh-120px)] lg:overflow-y-auto">
            <VaultCard />
          </div>

          {/* Right Column: Quests and Markets */}
          <div className="space-y-6 min-w-0">
            {/* Claude Quests */}
            <QuestsPanel onAcceptQuest={handleAcceptQuest} />

            {/* Active Markets */}
            <div className="min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground-muted bg-clip-text text-transparent">
                  Prediction Markets
                </h3>
                <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/30 backdrop-blur-sm">
                  <div className="text-xs text-foreground-muted">Your YC Balance</div>
                  <div className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    {Number(ycBalance).toFixed(2)}
                  </div>
                  <div className="text-sm text-foreground-muted font-medium">YC</div>
                </div>
              </div>
              <MarketsList key={refreshKey} onPlaceBet={handlePlaceBet} />
            </div>

            {/* User Positions - Show claimable positions */}
            <Card gradient glow>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-accent/20 to-accent/10 border border-accent/30">
                  <Trophy className="w-5 h-5 text-accent" />
                </div>
                <h3 className="text-lg font-bold text-foreground">
                  My Positions
                </h3>
              </div>
              <PositionsList onPositionClaimed={handleBetPlaced} />
            </Card>
          </div>
        </div>

        {/* Bet Ticket Panel */}
        <BetTicket
          market={selectedMarket}
          isOpen={isBetTicketOpen}
          onClose={() => setIsBetTicketOpen(false)}
          onBetPlaced={handleBetPlaced}
          ycBalance={ycBalance}
        />
      </div>
    </div>
  );
}
