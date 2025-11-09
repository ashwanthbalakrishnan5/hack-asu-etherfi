import { useState, useEffect, useCallback } from "react";
import { useAccount } from "wagmi";

interface YieldCreditsData {
  balance: string;
  lastAccrualTime: string;
  accruedSinceLastFetch: string;
}

export function useYieldCredits() {
  const { address } = useAccount();
  const [ycBalance, setYcBalance] = useState<string>("0");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch YC balance from API
  const fetchYCBalance = useCallback(async () => {
    if (!address) return;

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/yc/balance?address=${address}`);
      if (!response.ok) {
        throw new Error("Failed to fetch YC balance");
      }

      const data: YieldCreditsData = await response.json();
      setYcBalance(data.balance);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      console.error("Error fetching YC balance:", err);
    } finally {
      setIsLoading(false);
    }
  }, [address]);

  // Trigger YC accrual
  const accrueYC = useCallback(async () => {
    if (!address) return;

    try {
      const response = await fetch("/api/yc/accrue", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ address }),
      });

      if (!response.ok) {
        throw new Error("Failed to accrue YC");
      }

      const data: YieldCreditsData = await response.json();
      setYcBalance(data.balance);
    } catch (err) {
      console.error("Error accruing YC:", err);
    }
  }, [address]);

  // Fetch YC balance on mount and when address changes
  useEffect(() => {
    fetchYCBalance();
  }, [fetchYCBalance]);

  // Poll for YC accrual every 10 seconds
  useEffect(() => {
    if (!address) return;

    const interval = setInterval(() => {
      accrueYC();
    }, 10000); // 10 seconds

    return () => clearInterval(interval);
  }, [address, accrueYC]);

  return {
    ycBalance,
    isLoading,
    error,
    refetch: fetchYCBalance,
    accrueYC,
  };
}
