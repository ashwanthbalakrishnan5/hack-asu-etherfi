"use client";

import { useState } from "react";
import { ArrowDownToLine, ArrowUpFromLine, Shield, TrendingUp } from "lucide-react";
import { Card, Button, Badge, Tooltip } from "@/components/ui";
import { useVault, useYieldCredits } from "@/lib/hooks";
import { DepositModal } from "./DepositModal";
import { WithdrawModal } from "./WithdrawModal";
import { YCMeter } from "./YCMeter";

export function VaultCard() {
  const { principalBalance } = useVault();
  const { ycBalance } = useYieldCredits();
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  const apr = process.env.NEXT_PUBLIC_SIMULATED_APR || "5";

  return (
    <>
      <Card className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Game Vault</h3>
          <Badge variant="success" className="gap-1">
            <Shield size={12} />
            Protected
          </Badge>
        </div>

        {/* Principal Section */}
        <div className="rounded-lg border border-success/30 bg-success/5 p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm text-foreground/70">
              Principal (weETH)
            </span>
            <Tooltip content="Your deposited weETH. Always safe and withdrawable.">
              <Badge variant="success" className="text-xs">
                SAFE
              </Badge>
            </Tooltip>
          </div>
          <div className="mb-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-foreground">
              {principalBalance}
            </span>
            <span className="text-sm text-foreground/60">weETH</span>
          </div>

          {/* Deposit/Withdraw Buttons */}
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() => setShowDepositModal(true)}
              className="flex-1 gap-1"
            >
              <ArrowDownToLine size={14} />
              Deposit
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setShowWithdrawModal(true)}
              className="flex-1 gap-1"
              disabled={parseFloat(principalBalance) === 0}
            >
              <ArrowUpFromLine size={14} />
              Withdraw
            </Button>
          </div>
        </div>

        {/* YC Meter */}
        <YCMeter
          balance={ycBalance}
          isAccruing={parseFloat(principalBalance) > 0}
        />

        {/* APR Info */}
        <div className="rounded-lg bg-surface/30 p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="text-primary" size={16} />
              <span className="text-sm text-foreground/70">
                Simulated APR
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-primary">{apr}%</span>
              <Tooltip content="This is a simulated APR for demo purposes. Real APR varies based on market conditions.">
                <span className="cursor-help text-xs text-foreground/60">
                  ℹ️
                </span>
              </Tooltip>
            </div>
          </div>
        </div>

        {/* Info */}
        <p className="text-xs text-foreground/60">
          Your principal generates Yield Credits automatically. Use YC to make
          predictions without risking your weETH.
        </p>
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
