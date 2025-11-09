"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { Droplet } from "lucide-react";
import { toast } from "@/lib/stores/toast";

interface FaucetButtonProps {
  onSuccess?: () => void;
}

export function FaucetButton({ onSuccess }: FaucetButtonProps) {
  const { address } = useAccount();
  const [isLoading, setIsLoading] = useState(false);

  const handleFaucet = async () => {
    if (!address) {
      toast.error("Please connect your wallet first");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/faucet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Faucet request failed");
      }

      toast.success("Success! 10 weETH sent to your wallet.");

      // Wait a bit for the transaction to confirm, then refresh balance
      setTimeout(() => {
        if (onSuccess) onSuccess();
      }, 2000);
    } catch (error: any) {
      toast.error(error.message || "Failed to get test tokens");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleFaucet}
      disabled={!address || isLoading}
      className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-primary hover:text-primary-bright bg-primary/10 hover:bg-primary/20 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      title="Get 10 test weETH tokens"
    >
      <Droplet size={14} />
      {isLoading ? "Sending..." : "Get Test Tokens"}
    </button>
  );
}
