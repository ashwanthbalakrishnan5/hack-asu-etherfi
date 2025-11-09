'use client';

import { useState, useEffect } from 'react';
import { Card, Button } from '@/components/ui';
import { Bot, Hand, Settings, Play, Pause, TrendingUp, AlertCircle } from 'lucide-react';
import { useAccount } from 'wagmi';
import { toast } from '@/lib/stores/toast';

type GameMode = 'manual' | 'automated';
type RiskLevel = 'low' | 'medium' | 'high';

interface AutomatedSettings {
  enabled: boolean;
  riskLevel: RiskLevel;
  maxBetPerMarket: number;
  minConfidence: number;
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
  });

  // Fetch automated stats if enabled
  useEffect(() => {
    if (automatedSettings.enabled && address) {
      fetchAutomatedStats();
      const interval = setInterval(fetchAutomatedStats, 30000); // Update every 30s
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
        toast.success(newEnabled ? 'Automated mode enabled! Claude will start making predictions.' : 'Automated mode disabled.');
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

  const handleSaveSettings = async () => {
    if (!address) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/gamemode/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address,
          settings: automatedSettings,
        }),
      });

      if (response.ok) {
        toast.success('Settings saved successfully');
        setShowSettings(false);
      } else {
        toast.error('Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setIsLoading(false);
    }
  };

  const riskLevelConfig = {
    low: {
      color: 'text-green-400',
      bg: 'bg-green-400/10',
      border: 'border-green-400/30',
      description: 'Conservative betting, lower stakes, higher confidence threshold',
    },
    medium: {
      color: 'text-yellow-400',
      bg: 'bg-yellow-400/10',
      border: 'border-yellow-400/30',
      description: 'Balanced approach with moderate stakes and confidence',
    },
    high: {
      color: 'text-red-400',
      bg: 'bg-red-400/10',
      border: 'border-red-400/30',
      description: 'Aggressive betting, higher stakes, more markets',
    },
  };

  return (
    <Card gradient glow className="relative overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Game Mode
        </h3>
        {gameMode === 'automated' && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowSettings(!showSettings)}
          >
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        )}
      </div>

      {/* Mode Selection */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <button
          onClick={() => setGameMode('manual')}
          className={`p-4 rounded-xl border-2 transition-all ${
            gameMode === 'manual'
              ? 'border-primary bg-primary/10'
              : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
          }`}
        >
          <Hand className={`w-8 h-8 mx-auto mb-2 ${gameMode === 'manual' ? 'text-primary' : 'text-gray-400'}`} />
          <h4 className="font-bold text-foreground mb-1">Manual Mode</h4>
          <p className="text-xs text-foreground/60">Place bets yourself on markets</p>
        </button>

        <button
          onClick={() => setGameMode('automated')}
          className={`p-4 rounded-xl border-2 transition-all ${
            gameMode === 'automated'
              ? 'border-secondary bg-secondary/10'
              : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
          }`}
        >
          <Bot className={`w-8 h-8 mx-auto mb-2 ${gameMode === 'automated' ? 'text-secondary' : 'text-gray-400'}`} />
          <h4 className="font-bold text-foreground mb-1">Automated Mode</h4>
          <p className="text-xs text-foreground/60">Let Claude predict and bet for you</p>
        </button>
      </div>

      {/* Manual Mode Description */}
      {gameMode === 'manual' && (
        <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
          <div className="flex items-start gap-3">
            <Hand className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <h5 className="font-semibold text-foreground mb-1">Manual Mode Active</h5>
              <p className="text-sm text-foreground/70">
                Browse the prediction markets below and place your bets manually. You have full control over which markets to bet on and how much to wager.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Automated Mode Controls */}
      {gameMode === 'automated' && (
        <div className="space-y-4">
          {/* Status Banner */}
          <div className={`p-4 rounded-lg border ${
            automatedSettings.enabled
              ? 'bg-green-400/5 border-green-400/20'
              : 'bg-gray-800/50 border-gray-700'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {automatedSettings.enabled ? (
                  <Play className="w-5 h-5 text-green-400" />
                ) : (
                  <Pause className="w-5 h-5 text-gray-400" />
                )}
                <span className="font-semibold text-foreground">
                  {automatedSettings.enabled ? 'Active' : 'Inactive'}
                </span>
              </div>
              <Button
                onClick={handleToggleAutomated}
                disabled={isLoading}
                variant={automatedSettings.enabled ? 'secondary' : 'primary'}
                size="sm"
              >
                {automatedSettings.enabled ? 'Stop' : 'Start'} Automated Betting
              </Button>
            </div>
            {automatedSettings.enabled ? (
              <p className="text-sm text-foreground/70">
                Claude is actively researching markets and placing bets based on your risk settings.
              </p>
            ) : (
              <p className="text-sm text-foreground/70">
                Enable automated mode to let Claude research markets and place bets for you.
              </p>
            )}
          </div>

          {/* Settings Panel */}
          {showSettings && (
            <div className="p-4 rounded-lg bg-gray-800/50 border border-gray-700 space-y-4">
              <h5 className="font-semibold text-foreground mb-3">Automated Settings</h5>

              {/* Risk Level */}
              <div>
                <label className="block text-sm font-medium text-foreground/70 mb-2">
                  Risk Level
                </label>
                <div className="grid grid-cols-3 gap-2 mb-2">
                  {(['low', 'medium', 'high'] as RiskLevel[]).map((level) => (
                    <button
                      key={level}
                      onClick={() => setAutomatedSettings({ ...automatedSettings, riskLevel: level })}
                      className={`p-2 rounded-lg border-2 transition-all capitalize ${
                        automatedSettings.riskLevel === level
                          ? `${riskLevelConfig[level].border} ${riskLevelConfig[level].bg}`
                          : 'border-gray-700 bg-gray-800/50'
                      }`}
                    >
                      <span className={automatedSettings.riskLevel === level ? riskLevelConfig[level].color : 'text-gray-400'}>
                        {level}
                      </span>
                    </button>
                  ))}
                </div>
                <p className="text-xs text-foreground/60">
                  {riskLevelConfig[automatedSettings.riskLevel].description}
                </p>
              </div>

              {/* Max Bet Per Market */}
              <div>
                <label className="block text-sm font-medium text-foreground/70 mb-2">
                  Max Bet Per Market (YC)
                </label>
                <input
                  type="number"
                  value={automatedSettings.maxBetPerMarket}
                  onChange={(e) => setAutomatedSettings({
                    ...automatedSettings,
                    maxBetPerMarket: parseFloat(e.target.value) || 0
                  })}
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-foreground"
                  min="10"
                  max="1000"
                  step="10"
                />
              </div>

              {/* Min Confidence */}
              <div>
                <label className="block text-sm font-medium text-foreground/70 mb-2">
                  Minimum Confidence (%)
                </label>
                <input
                  type="range"
                  value={automatedSettings.minConfidence}
                  onChange={(e) => setAutomatedSettings({
                    ...automatedSettings,
                    minConfidence: parseInt(e.target.value)
                  })}
                  className="w-full"
                  min="50"
                  max="90"
                  step="5"
                />
                <div className="flex justify-between text-xs text-foreground/60 mt-1">
                  <span>50%</span>
                  <span className="font-semibold">{automatedSettings.minConfidence}%</span>
                  <span>90%</span>
                </div>
              </div>

              <Button onClick={handleSaveSettings} disabled={isLoading} className="w-full">
                Save Settings
              </Button>
            </div>
          )}

          {/* Stats */}
          {automatedSettings.enabled && (
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-lg bg-gray-800/50 border border-gray-700">
                <p className="text-xs text-foreground/60 mb-1">Active Bets</p>
                <p className="text-xl font-bold text-primary">{automatedStats.activeBets}</p>
              </div>
              <div className="p-3 rounded-lg bg-gray-800/50 border border-gray-700">
                <p className="text-xs text-foreground/60 mb-1">YC Deployed</p>
                <p className="text-xl font-bold text-secondary">{automatedStats.totalYcDeployed.toFixed(0)}</p>
              </div>
              <div className="p-3 rounded-lg bg-gray-800/50 border border-gray-700">
                <p className="text-xs text-foreground/60 mb-1">Est. Return</p>
                <p className={`text-xl font-bold ${automatedStats.estimatedReturn >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {automatedStats.estimatedReturn >= 0 ? '+' : ''}{automatedStats.estimatedReturn.toFixed(0)}
                </p>
              </div>
            </div>
          )}

          {/* Warning */}
          <div className="p-3 rounded-lg bg-orange-400/5 border border-orange-400/20">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-foreground/70">
                Automated mode uses Claude AI to research and place bets. Past performance does not guarantee future results. Monitor your YC balance regularly.
              </p>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
