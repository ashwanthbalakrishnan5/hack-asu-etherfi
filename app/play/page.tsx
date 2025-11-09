'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { Card } from '@/components/ui';
import { WalletButton } from '@/components/wallet/WalletButton';
import { VaultCard } from '@/components/vault';
import { MarketsList } from '@/components/markets/MarketsList';
import { BetTicket } from '@/components/markets/BetTicket';
import { PositionsList } from '@/components/markets/PositionsList';
import { GameModePanel } from '@/components/gamemode';
import { Market } from '@/lib/types';
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

          {/* Right Column: Game Mode and Markets */}
          <div className="space-y-6 min-w-0">
            {/* Game Mode Panel */}
            <GameModePanel />

            {/* Active Markets */}
            <div className="min-w-0">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground-muted bg-clip-text text-transparent mb-6">
                Live Markets
              </h3>
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
