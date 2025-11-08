"use client";

import { useAccount } from "wagmi";
import { Card } from "@/components/ui";
import { WalletButton } from "@/components/wallet/WalletButton";

export default function PlayPage() {
  const { isConnected } = useAccount();

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
          <Card>
            <h3 className="mb-4 text-lg font-semibold text-foreground">Vault</h3>
            <p className="text-sm text-foreground/70">
              Vault components will be implemented in Phase 2.
            </p>
          </Card>
        </div>

        {/* Right Column: Quests and Markets */}
        <div className="space-y-6">
          <Card>
            <h3 className="mb-4 text-lg font-semibold text-foreground">
              Claude Quests
            </h3>
            <p className="text-sm text-foreground/70">
              Quest generation will be implemented in Phase 4.
            </p>
          </Card>

          <Card>
            <h3 className="mb-4 text-lg font-semibold text-foreground">
              Active Markets
            </h3>
            <p className="text-sm text-foreground/70">
              Market listing will be implemented in Phase 3.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
