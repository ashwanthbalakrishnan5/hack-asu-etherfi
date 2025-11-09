import { useEffect, useRef } from "react";

/**
 * Hook to periodically auto-resolve markets in the background
 * Runs every 10 minutes
 */
export function useAutoResolve(enabled: boolean = true) {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const autoResolve = async () => {
      try {
        const response = await fetch("/api/markets/auto-resolve", {
          method: "POST",
        });

        if (response.ok) {
          const data = await response.json();
          if (data.resolved > 0) {
            console.log(`Auto-resolved ${data.resolved} markets:`, data.markets);
            // Trigger a custom event that other components can listen to
            window.dispatchEvent(
              new CustomEvent("markets-resolved", {
                detail: { count: data.resolved, markets: data.markets },
              })
            );
          }
        }
      } catch (error) {
        console.error("Auto-resolve error:", error);
      }
    };

    // Run immediately on mount
    autoResolve();

    // Then run every 10 minutes
    intervalRef.current = setInterval(autoResolve, 600000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [enabled]);
}
