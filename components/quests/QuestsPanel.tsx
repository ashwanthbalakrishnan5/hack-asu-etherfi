"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { Card, Button } from "@/components/ui";
import { QuestCard } from "./QuestCard";
import { Quest } from "@/lib/types";
import { Sparkles, Loader2, Wand2 } from "lucide-react";
import { toast } from "@/lib/stores/toast";

interface QuestsPanelProps {
  onAcceptQuest: (quest: Quest) => void;
}

export function QuestsPanel({ onAcceptQuest }: QuestsPanelProps) {
  const { address } = useAccount();
  const [quests, setQuests] = useState<Quest[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);

  const handleGenerateQuests = async () => {
    if (!address) {
      toast.error("Please connect your wallet");
      return;
    }

    setIsGenerating(true);

    try {
      const response = await fetch("/api/quests/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ address }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate quests");
      }

      const data = await response.json();

      // Convert database dates to timestamps
      const questsWithTimestamps = data.quests.map((quest: any) => ({
        ...quest,
        closeTime: new Date(quest.closeTime).getTime(),
        createdAt: new Date(quest.createdAt).getTime(),
        status: "generated" as const,
      }));

      setQuests(questsWithTimestamps);
      setHasGenerated(true);
      toast.success("3 personalized quests generated!");
    } catch (error) {
      console.error("Error generating quests:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to generate quests"
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Wand2 className="h-5 w-5 text-purple-400" />
          <h3 className="text-lg font-semibold text-foreground">
            Claude Quests
          </h3>
        </div>
        {hasGenerated && quests.length > 0 && (
          <Button
            size="sm"
            variant="secondary"
            onClick={handleGenerateQuests}
            disabled={isGenerating}
          >
            Regenerate
          </Button>
        )}
      </div>

      {!hasGenerated ? (
        <div className="space-y-4 py-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-purple-400/10">
            <Sparkles className="h-8 w-8 text-purple-400" />
          </div>
          <div>
            <h4 className="mb-2 text-lg font-semibold text-foreground">
              Get Personalized Quests
            </h4>
            <p className="mb-6 text-sm text-foreground/70">
              Claude will generate 3 quests tailored to your skill level and
              betting history. Each quest helps you learn specific prediction
              skills.
            </p>
            <Button
              onClick={handleGenerateQuests}
              disabled={isGenerating}
              className="gap-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating Quests...
                </>
              ) : (
                <>
                  <Wand2 className="h-4 w-4" />
                  Generate Quests
                </>
              )}
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {isGenerating ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : quests.length > 0 ? (
            quests.map((quest) => (
              <QuestCard
                key={quest.id}
                quest={quest}
                onAccept={onAcceptQuest}
              />
            ))
          ) : (
            <div className="py-8 text-center text-foreground/70">
              No quests available. Try generating new ones!
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
