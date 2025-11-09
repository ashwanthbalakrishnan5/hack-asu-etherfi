"use client";

import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useVault } from "@/lib/hooks";
import { toast } from "@/lib/stores/toast";

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WithdrawModal({ isOpen, onClose }: WithdrawModalProps) {
  const [amount, setAmount] = useState("");
  const { principalBalance, withdraw, isPending, isConfirming, isSuccess } =
    useVault();

  // Reset on open
  useEffect(() => {
    if (isOpen) {
      setAmount("");
    }
  }, [isOpen]);

  // Handle success
  useEffect(() => {
    if (isSuccess) {
      toast.success("Withdrawal successful!");
      onClose();
    }
  }, [isSuccess, onClose]);

  const handleMaxClick = () => {
    setAmount(principalBalance);
  };

  const handleWithdraw = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (parseFloat(amount) > parseFloat(principalBalance)) {
      toast.error("Insufficient principal balance");
      return;
    }

    try {
      await withdraw(amount);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Withdrawal failed"
      );
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Withdraw weETH">
      <div className="space-y-4">
        {/* Balance Display */}
        <div className="rounded-lg bg-surface/30 p-3">
          <p className="text-sm text-foreground/70">Your Principal (Safe)</p>
          <p className="text-lg font-semibold text-foreground">
            {principalBalance} weETH
          </p>
        </div>

        {/* Amount Input */}
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">
            Amount to Withdraw
          </label>
          <div className="relative">
            <Input
              type="number"
              placeholder="0.0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="pr-20"
              step="0.01"
              min="0"
            />
            <button
              type="button"
              onClick={handleMaxClick}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 text-xs font-semibold text-primary hover:text-primary-bright bg-primary/10 hover:bg-primary/20 rounded-md transition-colors"
            >
              MAX
            </button>
          </div>
        </div>

        {/* Warning */}
        <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3">
          <p className="text-sm text-amber-400">
            <span className="font-semibold">Note:</span> Your Yield Credits (YC)
            balance will remain unchanged. Only your principal is being withdrawn.
          </p>
        </div>

        {/* Gas Estimate (placeholder) */}
        <div className="flex justify-between text-sm">
          <span className="text-foreground/70">Estimated Gas:</span>
          <span className="text-foreground">~0.001 ETH</span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button variant="default" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button
            onClick={handleWithdraw}
            disabled={
              !amount ||
              parseFloat(amount) <= 0 ||
              parseFloat(amount) > parseFloat(principalBalance) ||
              isPending ||
              isConfirming
            }
            className="flex-1"
          >
            {isPending || isConfirming ? "Withdrawing..." : "Withdraw"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
