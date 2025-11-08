"use client";

import { useAccount } from "wagmi";
import { Card } from "@/components/ui";
import { WalletButton } from "@/components/wallet/WalletButton";

export default function ProfilePage() {
  const { isConnected, address } = useAccount();

  if (!isConnected) {
    return (
      <div className="container mx-auto flex min-h-[calc(100vh-200px)] max-w-7xl items-center justify-center px-4 py-16">
        <Card className="max-w-md text-center">
          <h2 className="mb-4 text-2xl font-bold text-foreground">
            Connect Your Wallet
          </h2>
          <p className="mb-6 text-foreground/70">
            Connect your wallet to view your profile and achievements.
          </p>
          <WalletButton />
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <Card>
        <h2 className="mb-4 text-2xl font-bold text-foreground">Profile</h2>
        <p className="mb-2 text-sm text-foreground/70">Address: {address}</p>
        <p className="text-sm text-foreground/70">
          Profile features including achievements, stats, and analytics will be
          implemented in Phase 5.
        </p>
      </Card>
    </div>
  );
}
