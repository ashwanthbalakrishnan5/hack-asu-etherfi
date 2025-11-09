"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { Card, Badge, Button } from "@/components/ui";
import { QuestFeedbackModal } from "./QuestFeedbackModal";
import {
  Sparkles,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  Target,
} from "lucide-react";
import { toast } from "@/lib/stores/toast";

interface QuestData {
  id: string;
  title: string;
  question: string;
  suggestedStake: number;
  difficulty: number;
  learningOutcome: string;
  closeTime: string;
  accepted: boolean;
  completed: boolean;
  outcome?: string;
  feedback?: string;
  suggestion?: string;
  marketId?: string;
  createdAt: string;
}

export function QuestHistory() {
  const { address } = useAccount();
  const [quests, setQuests] = useState<QuestData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedQuest, setSelectedQuest] = useState<QuestData | null>(null);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [isLoadingFeedback, setIsLoadingFeedback] = useState(false);

  useEffect(() => {
    if (address) {
      fetchQuests();
    }
  }, [address]);

  const fetchQuests = async () => {
    if (!address) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/quests/user?address=${address}`);
      if (response.ok) {
        const data = await response.json();
        setQuests(data.quests);
      }
    } catch (error) {
      console.error("Error fetching quests:", error);
      toast.error("Failed to load quest history");
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewFeedback = async (quest: QuestData) => {
    // If feedback already exists, just show it
    if (quest.feedback && quest.suggestion) {
      setSelectedQuest(quest);
      setIsFeedbackModalOpen(true);
      return;
    }

    // Otherwise, generate feedback
    if (!address) return;

    setIsLoadingFeedback(true);
    try {
      const response = await fetch("/api/quests/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          questId: quest.id,
          address,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate feedback");
      }

      const data = await response.json();

      // Update the quest with feedback
      const updatedQuest = {
        ...quest,
        completed: true,
        feedback: data.feedback.feedback,
        suggestion: data.feedback.suggestion,
      };

      setSelectedQuest(updatedQuest);
      setIsFeedbackModalOpen(true);

      // Refresh quest list
      fetchQuests();
    } catch (error) {
      console.error("Error generating feedback:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to generate feedback"
      );
    } finally {
      setIsLoadingFeedback(false);
    }
  };

  const getStatusBadge = (quest: QuestData) => {
    if (quest.completed) {
      return (
        <Badge variant="success" className="gap-1">
          <CheckCircle size={12} />
          Completed
        </Badge>
      );
    }
    if (quest.accepted) {
      return (
        <Badge variant="warning" className="gap-1">
          <Clock size={12} />
          In Progress
        </Badge>
      );
    }
    return (
      <Badge variant="default" className="gap-1">
        <Sparkles size={12} />
        Generated
      </Badge>
    );
  };

  const difficultyLabels: { [key: number]: string } = {
    1: "Beginner",
    2: "Easy",
    3: "Medium",
    4: "Hard",
    5: "Expert",
  };

  if (isLoading) {
    return (
      <Card>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <div className="mb-4 flex items-center gap-2">
          <Target className="h-5 w-5 text-purple-400" />
          <h3 className="text-lg font-semibold text-foreground">My Quests</h3>
        </div>

        {quests.length === 0 ? (
          <div className="py-8 text-center">
            <Sparkles className="mx-auto mb-3 h-12 w-12 text-purple-400/50" />
            <p className="text-sm text-foreground/70">
              No quests yet. Visit the Play page to generate personalized
              quests!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {quests.map((quest) => (
              <div
                key={quest.id}
                className="rounded-lg border border-surface bg-surface/20 p-4 transition-colors hover:border-primary/30"
              >
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h4 className="mb-1 font-semibold text-foreground">
                      {quest.title}
                    </h4>
                    <p className="text-sm text-foreground/70">
                      {quest.question}
                    </p>
                  </div>
                  {getStatusBadge(quest)}
                </div>

                <div className="mb-3 flex flex-wrap items-center gap-3 text-xs text-foreground/60">
                  <span>Difficulty: {difficultyLabels[quest.difficulty]}</span>
                  <span>•</span>
                  <span>Suggested: {quest.suggestedStake.toFixed(1)} YC</span>
                  {quest.outcome && (
                    <>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        Outcome:{" "}
                        <Badge
                          variant={
                            quest.outcome === "YES" ? "success" : "default"
                          }
                          className="text-xs"
                        >
                          {quest.outcome}
                        </Badge>
                      </span>
                    </>
                  )}
                </div>

                {quest.accepted && quest.marketId && !quest.completed && (
                  <div className="flex items-center gap-2 text-xs text-amber-400">
                    <Clock size={14} />
                    <span>
                      Waiting for market resolution to view feedback...
                    </span>
                  </div>
                )}

                {quest.accepted && quest.marketId && quest.outcome && (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleViewFeedback(quest)}
                    disabled={isLoadingFeedback}
                    className="mt-2 gap-2"
                  >
                    {isLoadingFeedback ? (
                      <>
                        <Loader2 className="h-3 w-3 animate-spin" />
                        Generating Feedback...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-3 w-3" />
                        View Feedback
                      </>
                    )}
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>

      {selectedQuest && selectedQuest.feedback && selectedQuest.suggestion && (
        <QuestFeedbackModal
          isOpen={isFeedbackModalOpen}
          onClose={() => {
            setIsFeedbackModalOpen(false);
            setSelectedQuest(null);
          }}
          quest={selectedQuest}
          feedback={{
            feedback: selectedQuest.feedback,
            suggestion: selectedQuest.suggestion,
          }}
          won={selectedQuest.outcome === "YES"} // This is simplified; actual win/loss depends on user's bet side
        />
      )}
    </>
  );
}
