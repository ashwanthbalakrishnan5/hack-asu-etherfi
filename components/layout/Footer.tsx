"use client";

import { Tooltip } from "@/components/ui";

export function Footer() {
  return (
    <footer className="w-full border-t border-surface bg-background py-6">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          {/* EtherFi Badge */}
          <Tooltip content="Your principal is staked in weETH, earning yield that funds your predictions">
            <div className="flex items-center gap-2 rounded-md border border-primary/20 bg-primary/5 px-3 py-1.5">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary">
                <span className="text-xs font-bold text-background">Ξ</span>
              </div>
              <span className="text-sm font-medium text-foreground">
                Powered by EtherFi (weETH)
              </span>
            </div>
          </Tooltip>

          {/* Claude Badge */}
          <Tooltip content="Claude AI adapts quests and provides personalized learning insights">
            <div className="flex items-center gap-2 rounded-md border border-[#9b87f5]/20 bg-[#9b87f5]/5 px-3 py-1.5">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#9b87f5]">
                <span className="text-xs font-bold text-background">C</span>
              </div>
              <span className="text-sm font-medium text-foreground">
                Game Master by Claude
              </span>
            </div>
          </Tooltip>

          {/* Copyright */}
          <p className="text-sm text-foreground/60">
            © {new Date().getFullYear()} EtherFi Predictions. Demo only.
          </p>
        </div>
      </div>
    </footer>
  );
}
