'use client';

import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui';
import { CheckCircle2, Circle, X } from 'lucide-react';
import { useAccount } from 'wagmi';

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

const CHECKLIST_KEY = 'onboarding_checklist';
const DISMISSED_KEY = 'onboarding_dismissed';

export function OnboardingChecklist() {
  const { isConnected, address } = useAccount();
  const [isOpen, setIsOpen] = useState(false);
  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    {
      id: 'connect_wallet',
      title: 'Connect Wallet',
      description: 'Connect your Web3 wallet to get started',
      completed: false,
    },
    {
      id: 'deposit_weeth',
      title: 'Deposit weETH',
      description: 'Deposit weETH to your vault (or use demo mode)',
      completed: false,
    },
    {
      id: 'generate_quests',
      title: 'Generate Quests',
      description: 'Get personalized quests from Claude AI',
      completed: false,
    },
    {
      id: 'place_bet',
      title: 'Place First Bet',
      description: 'Use YC to make your first prediction',
      completed: false,
    },
    {
      id: 'claim_winnings',
      title: 'Claim Winnings',
      description: 'Wait for a market to resolve and claim your YC',
      completed: false,
    },
  ]);

  // Load checklist state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(CHECKLIST_KEY);
    const dismissed = localStorage.getItem(DISMISSED_KEY);

    if (saved) {
      setChecklist(JSON.parse(saved));
    }

    // Show modal on first visit if not dismissed
    if (!dismissed && isConnected) {
      setIsOpen(true);
    }
  }, [isConnected]);

  // Auto-complete wallet connection
  useEffect(() => {
    if (isConnected) {
      markComplete('connect_wallet');
    }
  }, [isConnected]);

  // Check for deposit (principal > 0)
  useEffect(() => {
    if (!address) return;

    fetch(`/api/yc/balance?address=${address}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.principal && data.principal > 0) {
          markComplete('deposit_weeth');
        }
      })
      .catch(() => {});
  }, [address]);

  const markComplete = (id: string) => {
    setChecklist((prev) => {
      const updated = prev.map((item) =>
        item.id === id ? { ...item, completed: true } : item
      );
      localStorage.setItem(CHECKLIST_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const handleDismiss = () => {
    setIsOpen(false);
    localStorage.setItem(DISMISSED_KEY, 'true');
  };

  const handleSkip = () => {
    handleDismiss();
  };

  const completedCount = checklist.filter((item) => item.completed).length;
  const progress = (completedCount / checklist.length) * 100;

  if (!isConnected) return null;

  return (
    <>
      {/* Floating button to reopen checklist */}
      {!isOpen && completedCount < checklist.length && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 px-4 py-3 bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
        >
          <Circle className="w-4 h-4" />
          {completedCount}/{checklist.length} Tasks
        </button>
      )}

      {/* Checklist Modal */}
      <Modal isOpen={isOpen} onClose={handleDismiss}>
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Welcome to the Game!
              </h2>
              <p className="text-foreground/70">
                Complete these steps to get started with no-loss predictions
              </p>
            </div>
            <button
              onClick={handleDismiss}
              className="text-foreground/60 hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between text-sm text-foreground/70 mb-2">
              <span>Progress</span>
              <span>
                {completedCount} of {checklist.length} completed
              </span>
            </div>
            <div className="w-full h-2 bg-surface rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Checklist Items */}
          <div className="space-y-3 mb-6">
            {checklist.map((item) => (
              <div
                key={item.id}
                className={`flex items-start gap-3 p-4 rounded-lg border transition-all ${
                  item.completed
                    ? 'bg-success/10 border-success/30'
                    : 'bg-surface/30 border-surface'
                }`}
              >
                {item.completed ? (
                  <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                ) : (
                  <Circle className="w-5 h-5 text-foreground/40 flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <h3
                    className={`font-semibold mb-1 ${
                      item.completed
                        ? 'text-success'
                        : 'text-foreground'
                    }`}
                  >
                    {item.title}
                  </h3>
                  <p className="text-sm text-foreground/70">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            {completedCount === checklist.length ? (
              <button
                onClick={handleDismiss}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-medium rounded-lg hover:from-purple-600 hover:to-cyan-600 transition-all duration-200"
              >
                All Done! Start Playing
              </button>
            ) : (
              <>
                <button
                  onClick={handleSkip}
                  className="flex-1 px-4 py-3 bg-surface/50 text-foreground/70 font-medium rounded-lg hover:bg-surface transition-colors"
                >
                  Skip Tutorial
                </button>
                <button
                  onClick={handleDismiss}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-medium rounded-lg hover:from-purple-600 hover:to-cyan-600 transition-all duration-200"
                >
                  Continue
                </button>
              </>
            )}
          </div>

          {/* Help Link */}
          <div className="mt-4 text-center">
            <button
              onClick={() => {
                handleDismiss();
                // Could open help modal here
              }}
              className="text-sm text-primary hover:text-primary-light transition-colors"
            >
              Need help? View FAQ
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}

// Export function to mark checklist items complete from other components
export function markOnboardingComplete(itemId: string) {
  const saved = localStorage.getItem(CHECKLIST_KEY);
  if (!saved) return;

  const checklist = JSON.parse(saved);
  const updated = checklist.map((item: ChecklistItem) =>
    item.id === itemId ? { ...item, completed: true } : item
  );
  localStorage.setItem(CHECKLIST_KEY, JSON.stringify(updated));
}
