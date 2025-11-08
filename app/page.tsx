"use client";

import Link from "next/link";
import { ArrowRight, Coins, TrendingUp, Trophy, Wallet } from "lucide-react";
import { Button, Card, Tooltip } from "@/components/ui";
import { useAccount } from "wagmi";
import { WalletButton } from "@/components/wallet/WalletButton";

export default function Home() {
  const { isConnected } = useAccount();

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="container mx-auto max-w-7xl px-4 py-16 md:py-24">
        <div className="flex flex-col items-center text-center">
          <h1 className="mb-6 max-w-4xl text-4xl font-bold tracking-tight text-foreground md:text-6xl">
            Predict with Yield,
            <br />
            <span className="bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
              Keep Your Principal Safe
            </span>
          </h1>
          <p className="mb-8 max-w-2xl text-lg text-foreground/80 md:text-xl">
            No-loss prediction game powered by EtherFi weETH yield. Your principal
            stays safe while you compete, learn, and earn with Claude AI as your Game
            Master.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-4 sm:flex-row">
            {isConnected ? (
              <Link href="/play">
                <Button size="lg" className="gap-2">
                  Enter Play
                  <ArrowRight size={20} />
                </Button>
              </Link>
            ) : (
              <WalletButton />
            )}
            <Link href="/leaderboard">
              <Button variant="secondary" size="lg">
                View Leaderboard
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="w-full border-y border-surface bg-surface/30 py-16">
        <div className="container mx-auto max-w-7xl px-4">
          <h2 className="mb-12 text-center text-3xl font-bold text-foreground">
            How It Works
          </h2>
          <div className="grid gap-6 md:grid-cols-4">
            {/* Step 1 */}
            <Card className="relative overflow-hidden">
              <div className="absolute right-0 top-0 flex h-8 w-8 items-center justify-center rounded-bl-lg bg-primary text-sm font-bold text-background">
                1
              </div>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Wallet className="text-primary" size={24} />
              </div>
              <h3 className="mb-2 font-semibold text-foreground">Deposit weETH</h3>
              <p className="text-sm text-foreground/70">
                Stake your weETH as principal. It&apos;s always safe and withdrawable
                anytime.
              </p>
            </Card>

            {/* Step 2 */}
            <Card className="relative overflow-hidden">
              <div className="absolute right-0 top-0 flex h-8 w-8 items-center justify-center rounded-bl-lg bg-primary text-sm font-bold text-background">
                2
              </div>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <TrendingUp className="text-primary" size={24} />
              </div>
              <h3 className="mb-2 font-semibold text-foreground">Earn YC</h3>
              <p className="text-sm text-foreground/70">
                Your principal generates Yield Credits (YC) automatically over time.
              </p>
            </Card>

            {/* Step 3 */}
            <Card className="relative overflow-hidden">
              <div className="absolute right-0 top-0 flex h-8 w-8 items-center justify-center rounded-bl-lg bg-primary text-sm font-bold text-background">
                3
              </div>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Coins className="text-primary" size={24} />
              </div>
              <h3 className="mb-2 font-semibold text-foreground">Predict & Win</h3>
              <p className="text-sm text-foreground/70">
                Use YC to predict events. Win to earn more YC, lose only YC, never
                principal.
              </p>
            </Card>

            {/* Step 4 */}
            <Card className="relative overflow-hidden">
              <div className="absolute right-0 top-0 flex h-8 w-8 items-center justify-center rounded-bl-lg bg-primary text-sm font-bold text-background">
                4
              </div>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Trophy className="text-primary" size={24} />
              </div>
              <h3 className="mb-2 font-semibold text-foreground">
                Withdraw Anytime
              </h3>
              <p className="text-sm text-foreground/70">
                Withdraw your principal whenever you want. Your weETH is always yours.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto max-w-7xl px-4 py-16">
        <div className="grid gap-8 md:grid-cols-2">
          <Card className="border-primary/20 bg-primary/5">
            <div className="mb-4 flex items-start justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
                <span className="text-lg font-bold text-background">Ξ</span>
              </div>
              <Tooltip content="Your principal earns real yield through EtherFi's weETH liquid staking">
                <span className="text-xs text-foreground/60">ℹ️</span>
              </Tooltip>
            </div>
            <h3 className="mb-2 text-xl font-semibold text-foreground">
              Powered by EtherFi (weETH)
            </h3>
            <p className="text-foreground/70">
              Your weETH principal is never at risk. Only the yield it generates is used
              for predictions, creating a true no-loss experience.
            </p>
          </Card>

          <Card className="border-[#9b87f5]/20 bg-[#9b87f5]/5">
            <div className="mb-4 flex items-start justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#9b87f5]">
                <span className="text-lg font-bold text-background">C</span>
              </div>
              <Tooltip content="Claude adapts difficulty and provides personalized learning insights">
                <span className="text-xs text-foreground/60">ℹ️</span>
              </Tooltip>
            </div>
            <h3 className="mb-2 text-xl font-semibold text-foreground">
              Claude as Game Master
            </h3>
            <p className="text-foreground/70">
              Get personalized quests, probability hints, and post-game feedback that
              adapts to your skill level and helps you improve.
            </p>
          </Card>
        </div>
      </section>
    </div>
  );
}
