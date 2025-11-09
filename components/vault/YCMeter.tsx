"use client";

import { useEffect, useState } from "react";
import { Coins } from "lucide-react";
import { Tooltip } from "@/components/ui";

interface YCMeterProps {
  balance: string;
  isAccruing?: boolean;
}

export function YCMeter({ balance, isAccruing = true }: YCMeterProps) {
  const [shimmer, setShimmer] = useState(false);

  // Trigger shimmer animation every 10 seconds to show accrual
  useEffect(() => {
    if (!isAccruing) return;

    const interval = setInterval(() => {
      setShimmer(true);
      setTimeout(() => setShimmer(false), 1000);
    }, 10000);

    return () => clearInterval(interval);
  }, [isAccruing]);

  return (
    <div className="relative overflow-hidden rounded-lg border border-primary/30 bg-gradient-to-br from-primary/10 to-primary/5 p-4">
      {/* Shimmer effect */}
      {shimmer && (
        <div className="animate-shimmer absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      )}

      <div className="relative z-10">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20">
              <Coins className="text-primary" size={16} />
            </div>
            <span className="text-sm font-medium text-foreground/80">
              Yield Credits
            </span>
          </div>
          <Tooltip content="YC accrues from your deposited principal. Use it to make predictions without risking your principal.">
            <span className="cursor-help text-xs text-foreground/60">ℹ️</span>
          </Tooltip>
        </div>

        <div className="mb-1 flex items-baseline gap-1">
          <span className="text-3xl font-bold text-primary">{balance}</span>
          <span className="text-sm text-foreground/60">YC</span>
        </div>

        {isAccruing && (
          <p className="text-xs text-foreground/60">
            ✨ Accruing from your principal
          </p>
        )}
      </div>
    </div>
  );
}
