'use client';

import { motion } from 'framer-motion';
import { Tooltip } from '@/components/ui/Tooltip';

interface LevelBadgeProps {
  level: number;
  xp: number;
  showProgress?: boolean;
}

// Calculate XP for next level (level^2 * 100)
function calculateNextLevelXP(level: number): number {
  return (level + 1) ** 2 * 100;
}

// Calculate XP for current level
function calculateCurrentLevelXP(level: number): number {
  return level ** 2 * 100;
}

export function LevelBadge({ level, xp, showProgress = true }: LevelBadgeProps) {
  const currentLevelXP = calculateCurrentLevelXP(level);
  const nextLevelXP = calculateNextLevelXP(level);
  const xpInCurrentLevel = xp - currentLevelXP;
  const xpNeededForNextLevel = nextLevelXP - currentLevelXP;
  const progressPercentage = (xpInCurrentLevel / xpNeededForNextLevel) * 100;

  return (
    <div className="flex items-center gap-3">
      {/* Level Badge */}
      <Tooltip content={`Level ${level} • ${xp} XP`}>
        <motion.div
          className="relative flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 border-2 border-cyan-400 shadow-lg"
          whileHover={{ scale: 1.05 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <span className="text-2xl font-bold text-white">{level}</span>
        </motion.div>
      </Tooltip>

      {/* Progress Bar (optional) */}
      {showProgress && (
        <div className="flex-1 min-w-[120px]">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-gray-400">
              Level {level}
            </span>
            <span className="text-xs font-medium text-gray-400">
              {xpInCurrentLevel} / {xpNeededForNextLevel} XP
            </span>
          </div>
          <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(progressPercentage, 100)}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {nextLevelXP - xp} XP to Level {level + 1}
          </p>
        </div>
      )}
    </div>
  );
}
