"use client";

import { Card } from "@/components/ui";

export default function LeaderboardPage() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <Card>
        <h2 className="mb-4 text-2xl font-bold text-foreground">Leaderboard</h2>
        <p className="text-sm text-foreground/70">
          Leaderboard rankings will be implemented in Phase 5. This will include:
        </p>
        <ul className="mt-4 list-inside list-disc space-y-2 text-sm text-foreground/70">
          <li>Accuracy Leaders</li>
          <li>Wisdom Index Leaders</li>
          <li>Quest Masters (most Claude quests completed)</li>
        </ul>
      </Card>
    </div>
  );
}
