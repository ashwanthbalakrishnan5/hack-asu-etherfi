"use client";

import { useState } from "react";
import { ArrowDownToLine, ArrowUpFromLine, Shield, TrendingUp, Info, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Card, Button, Badge, Tooltip } from "@/components/ui";
import { useVault, useYieldCredits } from "@/lib/hooks";
import { DepositModal } from "./DepositModal";
import { WithdrawModal } from "./WithdrawModal";
import { YCMeter } from "./YCMeter";
import { DailyBonusCard } from "./DailyBonusCard";
import { config } from "@/lib/config";

export function VaultCard() {
  const { principalBalance } = useVault();
  const { ycBalance } = useYieldCredits();
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  const apr = config.simulatedAPR;

  return (
    <>
      <Card gradient glow className="overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-bright shadow-lg shadow-primary/30 flex-shrink-0">
            <Shield className="text-background" size={20} strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">Game Vault</h3>
            <p className="text-sm text-foreground-muted">Secure your principal</p>
          </div>
        </div>

        {/* Principal Section */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="relative overflow-hidden rounded-2xl border-2 border-success/40 bg-gradient-to-br from-success/10 via-success/5 to-transparent p-5 mb-5 shadow-lg shadow-success/10 backdrop-blur-sm"
        >
          {/* Animated gradient background */}
          <div className="absolute inset-0 bg-gradient-to-r from-success/5 via-success/10 to-success/5 animate-gradient opacity-50" />

          <div className="relative">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-success/20 border border-success/40">
                  <Sparkles className="text-success" size={18} />
                </div>
                <span className="text-sm font-semibold text-foreground">
                  Principal (weETH)
                </span>
              </div>
              <Tooltip content="Your deposited weETH. Always safe and withdrawable.">
                <Badge variant="safe" size="sm" glow>
                  SAFE
                </Badge>
              </Tooltip>
            </div>

            <div className="mb-4 flex items-baseline gap-2">
              <motion.span
                key={principalBalance}
                initial={{ scale: 1.1, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-4xl font-bold bg-gradient-to-r from-success to-success/80 bg-clip-text text-transparent"
              >
                {principalBalance}
              </motion.span>
              <span className="text-base text-foreground-muted font-medium">weETH</span>
            </div>

            {/* Deposit/Withdraw Buttons */}
            <div className="flex gap-3">
              <Button
                size="sm"
                withGlow
                onClick={() => setShowDepositModal(true)}
                className="flex-1 gap-2"
              >
                <ArrowDownToLine size={16} />
                Deposit
              </Button>
              <Button
                size="sm"
                variant="default"
                onClick={() => setShowWithdrawModal(true)}
                className="flex-1 gap-2"
                disabled={parseFloat(principalBalance) === 0}
              >
                <ArrowUpFromLine size={16} />
                Withdraw
              </Button>
            </div>
          </div>
        </motion.div>

        {/* YC Meter */}
        <div className="mb-5">
          <YCMeter
            balance={ycBalance}
            isAccruing={parseFloat(principalBalance) > 0}
          />
        </div>

        {/* APR Info */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="relative overflow-hidden rounded-xl border border-primary/30 bg-gradient-to-br from-primary/5 to-secondary/5 p-4 mb-5 backdrop-blur-sm"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/30">
                <TrendingUp className="text-primary" size={18} />
              </div>
              <div>
                <span className="text-xs text-foreground-muted block">
                  Simulated APR
                </span>
                <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  {apr}%
                </span>
              </div>
            </div>
            <Tooltip content="Demo APR for testing purposes">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-surface-elevated/50 border border-surface-elevated hover:border-primary/30 transition-colors cursor-help">
                <Info className="w-3 h-3 text-foreground-muted" />
              </div>
            </Tooltip>
          </div>
        </motion.div>

        {/* Daily Bonus */}
        <div className="mb-5">
          <DailyBonusCard />
        </div>

        {/* Info Footer */}
        <div className="rounded-xl bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 border border-surface-elevated/30 p-4">
          <p className="text-xs text-foreground-muted leading-relaxed">
            Your principal is safe. Only generated <span className="text-primary font-semibold">Yield Credits</span> are used for predictions.
          </p>
        </div>
      </Card>

      {/* Modals */}
      <DepositModal
        isOpen={showDepositModal}
        onClose={() => setShowDepositModal(false)}
      />
      <WithdrawModal
        isOpen={showWithdrawModal}
        onClose={() => setShowWithdrawModal(false)}
      />
    </>
  );
}
