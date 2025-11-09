"use client";

import { useState, useEffect } from "react";
import { Card, Badge, Button } from "@/components/ui";
import { Clock, Target, Sparkles, TrendingUp } from "lucide-react";
import { Quest } from "@/lib/types";

interface QuestCardProps {
  quest: Quest;
  onAccept: (quest: Quest) => void;
  disabled?: boolean;
}

export function QuestCard({ quest, onAccept, disabled }: QuestCardProps) {
  const [mounted, setMounted] = useState(false);
  const [timeDisplay, setTimeDisplay] = useState("--");

  useEffect(() => {
    setMounted(true);

    // Calculate time remaining after mount
    const updateTime = () => {
      const now = Date.now();
      const timeRemaining = quest.closeTime - now;
      const hoursRemaining = Math.floor(timeRemaining / (1000 * 60 * 60));
      const daysRemaining = Math.floor(hoursRemaining / 24);

      const display =
        daysRemaining > 0
          ? `${daysRemaining}d ${hoursRemaining % 24}h`
          : `${hoursRemaining}h`;

      setTimeDisplay(display);
    };

    updateTime();
    const interval = setInterval(updateTime, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [quest.closeTime]);

  // Difficulty styling
  const difficultyColors = {
    1: "bg-success/20 text-success border-success/30",
    2: "bg-success/20 text-success border-success/30",
    3: "bg-warning/20 text-warning border-warning/30",
    4: "bg-error/20 text-error border-error/30",
    5: "bg-error/20 text-error border-error/30",
  };

  const difficultyLabels = {
    1: "Beginner",
    2: "Easy",
    3: "Medium",
    4: "Hard",
    5: "Expert",
  };

  return (
    <Card className="group relative overflow-hidden transition-all hover:border-primary/50">
      {/* Claude hint accent */}
      <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-purple-400/50 to-purple-600/50" />

      <div className="space-y-4 pl-2">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="mb-2 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-purple-400" />
              <h4 className="font-semibold text-foreground">{quest.title}</h4>
            </div>
            <p className="text-sm text-foreground/80">{quest.question}</p>
          </div>

          <Badge
            className={`whitespace-nowrap ${difficultyColors[quest.difficulty]}`}
          >
            {difficultyLabels[quest.difficulty]}
          </Badge>
        </div>

        {/* Quest Details */}
        <div className="grid grid-cols-2 gap-3 rounded-lg bg-surface/30 p-3">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-cyan-400" />
            <div>
              <div className="text-xs text-foreground/60">Suggested Stake</div>
              <div className="font-semibold text-foreground">
                {quest.suggestedStake.toFixed(1)} YC
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-amber-400" />
            <div>
              <div className="text-xs text-foreground/60">Closes In</div>
              <div className="font-semibold text-foreground">
                {timeDisplay}
              </div>
            </div>
          </div>
        </div>

        {/* Learning Outcome */}
        <div className="rounded-lg border border-purple-400/20 bg-purple-400/5 p-3">
          <div className="mb-1 flex items-center gap-2 text-xs font-medium text-purple-300">
            <TrendingUp className="h-3 w-3" />
            LEARNING OUTCOME
          </div>
          <p className="text-sm italic text-foreground/80">
            {quest.learningOutcome}
          </p>
        </div>

        {/* Accept Button */}
        <Button
          onClick={() => onAccept(quest)}
          disabled={disabled}
          className="w-full gap-2"
        >
          <Sparkles className="h-4 w-4" />
          Accept Quest
        </Button>
      </div>
    </Card>
  );
}
