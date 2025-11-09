'use client';

import { useState, useEffect } from 'react';
import { Card, Button } from '@/components/ui';
import {
  Bot,
  Zap,
  TrendingUp,
  Activity,
  Settings,
  Play,
  Pause,
  Target,
  Flame,
  Crown,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { useAccount } from 'wagmi';
import { toast } from '@/lib/stores/toast';
import { motion, AnimatePresence } from 'framer-motion';

type GameMode = 'manual' | 'automated';
type RiskLevel = 'low' | 'medium' | 'high';

interface AutomatedSettings {
  enabled: boolean;
  riskLevel: RiskLevel;
  maxBetPerMarket: number;
  minConfidence: number;
}

interface AutomatedActivity {
  id: string;
  action: string;
  market: string;
  prediction: string;
  confidence: number;
  amount: number;
  timestamp: number;
}

export function GameModePanel() {
  const { address } = useAccount();
  const [gameMode, setGameMode] = useState<GameMode>('manual');
  const [automatedSettings, setAutomatedSettings] = useState<AutomatedSettings>({
    enabled: false,
    riskLevel: 'medium',
    maxBetPerMarket: 100,
    minConfidence: 60,
  });
  const [showSettings, setShowSettings] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [automatedStats, setAutomatedStats] = useState({
    activeBets: 0,
    totalYcDeployed: 0,
    estimatedReturn: 0,
    winRate: 0,
    streak: 0,
  });
  const [recentActivity, setRecentActivity] = useState<AutomatedActivity[]>([]);

  // Fetch automated stats if enabled
  useEffect(() => {
    if (automatedSettings.enabled && address) {
      fetchAutomatedStats();
      const interval = setInterval(fetchAutomatedStats, 30000);
      return () => clearInterval(interval);
    }
  }, [automatedSettings.enabled, address]);

  const fetchAutomatedStats = async () => {
    try {
      const response = await fetch(`/api/gamemode/stats?address=${address}`);
      if (response.ok) {
        const data = await response.json();
        setAutomatedStats(data);
      }
    } catch (error) {
      console.error('Error fetching automated stats:', error);
    }
  };

  const handleToggleAutomated = async () => {
    if (!address) {
      toast.error('Please connect your wallet');
      return;
    }

    const newEnabled = !automatedSettings.enabled;
    setIsLoading(true);

    try {
      const response = await fetch('/api/gamemode/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address,
          enabled: newEnabled,
          settings: automatedSettings,
        }),
      });

      if (response.ok) {
        setAutomatedSettings({ ...automatedSettings, enabled: newEnabled });
        toast.success(
          newEnabled
            ? '🤖 AI Agent activated! Claude is now analyzing markets...'
            : '⏸️ AI Agent paused'
        );
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to toggle automated mode');
      }
    } catch (error) {
      console.error('Error toggling automated mode:', error);
      toast.error('Failed to toggle automated mode');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickSettingsUpdate = (updates: Partial<AutomatedSettings>) => {
    setAutomatedSettings(prev => ({ ...prev, ...updates }));
    toast.success('Settings updated');
  };

  const riskLevelConfig = {
    low: {
      color: 'text-green-400',
      bg: 'bg-green-400/10',
      border: 'border-green-400/30',
      icon: '🛡️',
      label: 'Safe',
    },
    medium: {
      color: 'text-yellow-400',
      bg: 'bg-yellow-400/10',
      border: 'border-yellow-400/30',
      icon: '⚖️',
      label: 'Balanced',
    },
    high: {
      color: 'text-red-400',
      bg: 'bg-red-400/10',
      border: 'border-red-400/30',
      icon: '🚀',
      label: 'Aggressive',
    },
  };

  return (
    <div className="space-y-4">
      {/* Mode Selector - Minimal, Sleek */}
      <div className="grid grid-cols-2 gap-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setGameMode('manual')}
          className={`relative p-4 rounded-xl border-2 transition-all ${
            gameMode === 'manual'
              ? 'border-primary bg-gradient-to-br from-primary/20 to-primary/5 shadow-lg shadow-primary/20'
              : 'border-gray-700 bg-gray-800/30 hover:border-gray-600'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${gameMode === 'manual' ? 'bg-primary/20' : 'bg-gray-700/50'}`}>
              <Zap className={`w-5 h-5 ${gameMode === 'manual' ? 'text-primary' : 'text-gray-400'}`} />
            </div>
            <div className="text-left">
              <div className="font-bold text-foreground">Manual</div>
              <div className="text-xs text-foreground/60">You control</div>
            </div>
          </div>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setGameMode('automated')}
          className={`relative p-4 rounded-xl border-2 transition-all ${
            gameMode === 'automated'
              ? 'border-secondary bg-gradient-to-br from-secondary/20 to-secondary/5 shadow-lg shadow-secondary/20'
              : 'border-gray-700 bg-gray-800/30 hover:border-gray-600'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${gameMode === 'automated' ? 'bg-secondary/20' : 'bg-gray-700/50'}`}>
              <Bot className={`w-5 h-5 ${gameMode === 'automated' ? 'text-secondary' : 'text-gray-400'}`} />
            </div>
            <div className="text-left">
              <div className="font-bold text-foreground">AI Agent</div>
              <div className="text-xs text-foreground/60">Claude plays</div>
            </div>
          </div>
          {automatedSettings.enabled && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"
            />
          )}
        </motion.button>
      </div>

      <AnimatePresence mode="wait">
        {/* Manual Mode View */}
        {gameMode === 'manual' && (
          <motion.div
            key="manual"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="bg-gradient-to-br from-primary/5 to-transparent border-primary/20">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Flame className="w-5 h-5 text-orange-400" />
                    <span className="font-bold text-foreground">Manual Mode</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                    <Crown className="w-4 h-4 text-primary" />
                    <span className="text-sm font-semibold text-primary">Full Control</span>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="text-sm text-foreground/70">
                  Browse markets below and place your bets. Build win streaks for bonus rewards!
                </div>

                {/* Action Prompt */}
                <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/5 border border-primary/20">
                  <Target className="w-4 h-4 text-primary flex-shrink-0" />
                  <div className="text-sm text-foreground/80">
                    Scroll down to see live markets and start betting
                  </div>
                  <ChevronRight className="w-4 h-4 text-primary ml-auto" />
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Automated Mode View */}
        {gameMode === 'automated' && (
          <motion.div
            key="automated"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            {/* AI Agent Control Panel */}
            <Card className="bg-gradient-to-br from-secondary/5 to-transparent border-secondary/20">
              <div className="space-y-4">
                {/* Header with Toggle */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${automatedSettings.enabled ? 'bg-green-400/20 animate-pulse' : 'bg-gray-700/50'}`}>
                      <Bot className={`w-5 h-5 ${automatedSettings.enabled ? 'text-green-400' : 'text-gray-400'}`} />
                    </div>
                    <div>
                      <div className="font-bold text-foreground">AI Trading Agent</div>
                      <div className="text-xs text-foreground/60">
                        {automatedSettings.enabled ? 'Active & Analyzing...' : 'Ready to deploy'}
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={handleToggleAutomated}
                    disabled={isLoading}
                    variant={automatedSettings.enabled ? 'secondary' : 'primary'}
                    size="sm"
                    className="gap-2"
                  >
                    {automatedSettings.enabled ? (
                      <>
                        <Pause className="w-4 h-4" />
                        Stop
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" />
                        Start
                      </>
                    )}
                  </Button>
                </div>

                {/* Quick Risk Selector */}
                <div>
                  <div className="text-sm font-medium text-foreground/70 mb-2">Risk Strategy</div>
                  <div className="grid grid-cols-3 gap-2">
                    {(['low', 'medium', 'high'] as RiskLevel[]).map((level) => (
                      <motion.button
                        key={level}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleQuickSettingsUpdate({ riskLevel: level })}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          automatedSettings.riskLevel === level
                            ? `${riskLevelConfig[level].border} ${riskLevelConfig[level].bg}`
                            : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                        }`}
                      >
                        <div className="text-2xl mb-1">{riskLevelConfig[level].icon}</div>
                        <div className={`text-xs font-semibold ${
                          automatedSettings.riskLevel === level
                            ? riskLevelConfig[level].color
                            : 'text-gray-400'
                        }`}>
                          {riskLevelConfig[level].label}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Max Bet Quick Adjust */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-foreground/70">Max Bet per Market</span>
                    <span className="text-sm font-bold text-primary">{automatedSettings.maxBetPerMarket} YC</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {[50, 100, 200, 500].map((amount) => (
                      <motion.button
                        key={amount}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleQuickSettingsUpdate({ maxBetPerMarket: amount })}
                        className={`py-2 px-3 rounded-lg border-2 transition-all text-sm font-semibold ${
                          automatedSettings.maxBetPerMarket === amount
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-gray-700 bg-gray-800/50 text-gray-400 hover:border-gray-600'
                        }`}
                      >
                        {amount}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Advanced Settings Toggle */}
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="w-full py-2 px-3 rounded-lg border border-gray-700 bg-gray-800/30 hover:bg-gray-800/50 transition-all text-sm text-foreground/70 flex items-center justify-center gap-2"
                >
                  <Settings className="w-4 h-4" />
                  {showSettings ? 'Hide' : 'Show'} Advanced Settings
                </button>

                {/* Advanced Settings */}
                <AnimatePresence>
                  {showSettings && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-4 border-t border-gray-700 space-y-3">
                        <div>
                          <label className="text-sm font-medium text-foreground/70 mb-2 block">
                            Minimum Confidence: {automatedSettings.minConfidence}%
                          </label>
                          <input
                            type="range"
                            value={automatedSettings.minConfidence}
                            onChange={(e) => handleQuickSettingsUpdate({
                              minConfidence: parseInt(e.target.value)
                            })}
                            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-secondary"
                            min="50"
                            max="90"
                            step="5"
                          />
                          <div className="flex justify-between text-xs text-foreground/50 mt-1">
                            <span>50% (Risky)</span>
                            <span>90% (Safe)</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Card>

            {/* Live Stats Dashboard */}
            {automatedSettings.enabled && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-secondary" />
                      <span className="text-sm font-semibold text-foreground/70">Live Performance</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-lg bg-gray-800/50 border border-gray-700">
                        <div className="text-xs text-foreground/60 mb-1">Active Bets</div>
                        <div className="text-2xl font-bold text-primary">{automatedStats.activeBets}</div>
                      </div>
                      <div className="p-3 rounded-lg bg-gray-800/50 border border-gray-700">
                        <div className="text-xs text-foreground/60 mb-1">YC Deployed</div>
                        <div className="text-2xl font-bold text-secondary">{automatedStats.totalYcDeployed}</div>
                      </div>
                      <div className="p-3 rounded-lg bg-gray-800/50 border border-gray-700">
                        <div className="text-xs text-foreground/60 mb-1">Est. Return</div>
                        <div className={`text-2xl font-bold ${
                          automatedStats.estimatedReturn >= 0 ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {automatedStats.estimatedReturn >= 0 ? '+' : ''}{automatedStats.estimatedReturn}
                        </div>
                      </div>
                      <div className="p-3 rounded-lg bg-gray-800/50 border border-gray-700">
                        <div className="text-xs text-foreground/60 mb-1">Win Rate</div>
                        <div className="text-2xl font-bold text-purple-400">{automatedStats.winRate}%</div>
                      </div>
                    </div>

                    {/* Live Activity Indicator */}
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-green-400/10 border border-green-400/20">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      <span className="text-xs text-green-400 font-medium">
                        Claude is actively monitoring {automatedStats.activeBets} markets
                      </span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}

            {/* Warning */}
            {!automatedSettings.enabled && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-3 rounded-lg bg-orange-400/5 border border-orange-400/20"
              >
                <p className="text-xs text-foreground/70 flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" />
                  <span>
                    AI mode uses Claude to research markets and place automated bets. Start with low risk to test performance.
                  </span>
                </p>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
