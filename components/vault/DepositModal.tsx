"use client";

import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useVault } from "@/lib/hooks";
import { useWeETHBalance } from "@/lib/hooks";
import { toast } from "@/lib/stores/toast";

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DepositModal({ isOpen, onClose }: DepositModalProps) {
  const [amount, setAmount] = useState("");
  const { balance } = useWeETHBalance();
  const { approve, deposit, needsApproval, isPending, isConfirming, isSuccess } =
    useVault();
  const [step, setStep] = useState<"input" | "approve" | "deposit">("input");

  // Reset on open
  useEffect(() => {
    if (isOpen) {
      setAmount("");
      setStep("input");
    }
  }, [isOpen]);

  // Handle success
  useEffect(() => {
    if (isSuccess && step === "deposit") {
      toast.success("Deposit successful!");
      onClose();
    }
  }, [isSuccess, step, onClose]);

  const handleMaxClick = () => {
    setAmount(balance.toString());
  };

  const handleApprove = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    try {
      await approve(amount);
      setStep("approve");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Approval failed"
      );
    }
  };

  const handleDeposit = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    try {
      await deposit(amount);
      setStep("deposit");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Deposit failed"
      );
    }
  };

  const handleSubmit = async () => {
    if (needsApproval(amount)) {
      await handleApprove();
    } else {
      await handleDeposit();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Deposit weETH">
      <div className="space-y-4">
        {/* Balance Display */}
        <div className="rounded-lg bg-surface/30 p-3">
          <p className="text-sm text-foreground/70">Your weETH Balance</p>
          <p className="text-lg font-semibold text-foreground">{balance} weETH</p>
        </div>

        {/* Amount Input */}
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">
            Amount to Deposit
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

        {/* Info */}
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
          <p className="text-sm text-foreground/80">
            Your principal is <span className="font-semibold">safe and withdrawable</span> at any time. Only the yield it generates (Yield Credits) is
            used for predictions.
          </p>
        </div>

        {/* Gas Estimate (placeholder) */}
        <div className="flex justify-between text-sm">
          <span className="text-foreground/70">Estimated Gas:</span>
          <span className="text-foreground">~0.002 ETH</span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button variant="secondary" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={
              !amount ||
              parseFloat(amount) <= 0 ||
              parseFloat(amount) > parseFloat(balance) ||
              isPending ||
              isConfirming
            }
            className="flex-1"
          >
            {isPending || isConfirming
              ? step === "approve"
                ? "Approving..."
                : "Depositing..."
              : needsApproval(amount)
                ? "Approve"
                : "Deposit"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
