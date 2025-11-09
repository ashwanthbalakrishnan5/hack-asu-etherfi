"use client";

import { useEffect, useState } from "react";
import { Coins, Zap } from "lucide-react";
import { motion } from "framer-motion";
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
      setTimeout(() => setShimmer(false), 1500);
    }, 10000);

    return () => clearInterval(interval);
  }, [isAccruing]);

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className="relative overflow-hidden rounded-2xl border-2 border-primary/40 bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/5 p-5 shadow-lg shadow-primary/10 backdrop-blur-sm"
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-secondary/10 to-primary/5 animate-gradient opacity-30" />

      {/* Shimmer effect */}
      {shimmer && (
        <div className="animate-shimmer absolute inset-0 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      )}

      {/* Pulsing glow when accruing */}
      {isAccruing && (
        <div className="absolute inset-0 animate-pulse-glow">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 blur-xl" />
        </div>
      )}

      <div className="relative z-10">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary/30 to-secondary/30 border border-primary/40">
              <Coins className="text-primary" size={20} />
              {isAccruing && (
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -top-1 -right-1"
                >
                  <Zap className="text-secondary" size={12} fill="currentColor" />
                </motion.div>
              )}
            </div>
            <div>
              <span className="text-sm font-semibold text-foreground block">
                Yield Credits
              </span>
              <span className="text-xs text-foreground-muted">
                {isAccruing ? "Actively accruing" : "No principal deposited"}
              </span>
            </div>
          </div>
          <Tooltip content="YC accrues from your deposited principal. Use it to make predictions without risking your principal.">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-elevated/50 border border-surface-elevated hover:border-primary/30 transition-colors cursor-help">
              <span className="text-xs text-foreground-muted">ℹ️</span>
            </div>
          </Tooltip>
        </div>

        <div className="mb-2 flex items-baseline gap-2">
          <motion.span
            key={balance}
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent"
          >
            {balance}
          </motion.span>
          <span className="text-base text-foreground-muted font-medium">YC</span>
        </div>

        {isAccruing && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 px-3 py-2"
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <Zap className="text-primary" size={14} />
            </motion.div>
            <p className="text-xs text-foreground font-medium">
              Accruing from your principal
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
