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

export default function PlayPage() {
  const { isConnected, address } = useAccount();
  const [selectedMarket, setSelectedMarket] = useState<Market | null>(null);
  const [isBetTicketOpen, setIsBetTicketOpen] = useState(false);
  const [ycBalance, setYcBalance] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);

  // Fetch YC balance
  useEffect(() => {
    if (address) {
      fetchYCBalance();
    }
  }, [address, refreshKey]);

  const fetchYCBalance = async () => {
    if (!address) return;

    try {
      const response = await fetch(`/api/yc/balance?address=${address}`);
      if (response.ok) {
        const data = await response.json();
        setYcBalance(data.balance);
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
      <div className="container mx-auto flex min-h-[calc(100vh-200px)] max-w-7xl items-center justify-center px-4 py-16">
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
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <div className="grid gap-6 lg:grid-cols-[350px_1fr]">
        {/* Left Column: Vault and YC Meter */}
        <div className="space-y-6">
          <VaultCard />
        </div>

        {/* Right Column: Quests and Markets */}
        <div className="space-y-6">
          {/* Claude Quests */}
          <QuestsPanel onAcceptQuest={handleAcceptQuest} />

          {/* Active Markets */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-foreground">
                Prediction Markets
              </h3>
              <div className="text-right">
                <div className="text-sm text-foreground/70">Your YC Balance</div>
                <div className="text-xl font-bold text-cyan-400">
                  {ycBalance.toFixed(2)} <span className="text-sm text-foreground/60">YC</span>
                </div>
              </div>
            </div>
            <MarketsList key={refreshKey} onPlaceBet={handlePlaceBet} />
          </div>

          {/* User Positions - Show claimable positions */}
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="w-5 h-5 text-cyan-400" />
              <h3 className="text-lg font-semibold text-foreground">
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
  );
}
