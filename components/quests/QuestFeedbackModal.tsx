"use client";

import { Modal, Button, Badge } from "@/components/ui";
import { Sparkles, TrendingUp, CheckCircle, XCircle } from "lucide-react";

interface QuestFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  quest: {
    title: string;
    question: string;
    outcome?: string;
  };
  feedback: {
    feedback: string;
    suggestion: string;
  };
  won: boolean;
}

export function QuestFeedbackModal({
  isOpen,
  onClose,
  quest,
  feedback,
  won,
}: QuestFeedbackModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Quest Completed">
      <div className="space-y-6">
        {/* Outcome Header */}
        <div className="text-center">
          <div
            className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full ${
              won
                ? "bg-success/20 text-success"
                : "bg-error/20 text-error"
            }`}
          >
            {won ? (
              <CheckCircle className="h-8 w-8" />
            ) : (
              <XCircle className="h-8 w-8" />
            )}
          </div>
          <h3 className="mb-2 text-xl font-bold text-foreground">
            {won ? "Quest Successful!" : "Quest Completed"}
          </h3>
          <p className="text-sm text-foreground/70">{quest.title}</p>
        </div>

        {/* Quest Details */}
        <div className="rounded-lg border border-surface bg-surface/30 p-4">
          <div className="mb-2 text-sm font-medium text-foreground/70">
            Question
          </div>
          <p className="text-sm text-foreground">{quest.question}</p>
          {quest.outcome && (
            <div className="mt-3 flex items-center gap-2">
              <span className="text-xs text-foreground/60">Outcome:</span>
              <Badge
                variant={quest.outcome === "YES" ? "success" : "secondary"}
              >
                {quest.outcome}
              </Badge>
            </div>
          )}
        </div>

        {/* Claude's Feedback */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium text-purple-300">
            <Sparkles className="h-4 w-4" />
            FEEDBACK FROM CLAUDE
          </div>
          <div className="rounded-lg border border-purple-400/20 bg-purple-400/5 p-4">
            <p className="text-sm leading-relaxed text-foreground/90">
              {feedback.feedback}
            </p>
          </div>
        </div>

        {/* Suggestion */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-cyan-300">
            <TrendingUp className="h-4 w-4" />
            NEXT STEP
          </div>
          <div className="rounded-lg border border-cyan-400/20 bg-cyan-400/5 p-4">
            <p className="text-sm text-foreground/90">{feedback.suggestion}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button onClick={onClose} className="flex-1">
            Got it!
          </Button>
        </div>
      </div>
    </Modal>
  );
}
