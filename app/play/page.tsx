'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { Card } from '@/components/ui';
import { WalletButton } from '@/components/wallet/WalletButton';
import { VaultCard } from '@/components/vault';
import { MarketsList } from '@/components/markets/MarketsList';
import { BetTicket } from '@/components/markets/BetTicket';
import { PositionsList } from '@/components/markets/PositionsList';
import { Market } from '@/lib/types';
import { Trophy } from 'lucide-react';

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

  const handlePlaceBet = (market: Market) => {
    setSelectedMarket(market);
    setIsBetTicketOpen(true);
  };

  const handleBetPlaced = () => {
    // Refresh YC balance and markets list
    setRefreshKey((prev) => prev + 1);
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
          {/* Claude Quests - Phase 4 */}
          <Card>
            <h3 className="mb-4 text-lg font-semibold text-foreground">
              Claude Quests
            </h3>
            <p className="text-sm text-foreground/70">
              Quest generation will be implemented in Phase 4.
            </p>
          </Card>

          {/* Active Markets */}
          <div>
            <h3 className="mb-4 text-2xl font-bold text-white">
              Prediction Markets
            </h3>
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
