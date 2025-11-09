'use client';

import { motion } from 'framer-motion';
import { Tooltip } from '@/components/ui/Tooltip';
import type { AchievementRarity } from '@/lib/achievements';

interface AchievementBadgeProps {
  icon: string;
  name: string;
  description: string;
  rarity: AchievementRarity;
  earned: boolean;
  earnedAt?: Date;
}

const rarityColors = {
  Common: {
    bg: 'bg-gray-700',
    border: 'border-gray-500',
    text: 'text-gray-300',
    glow: 'shadow-gray-500/20',
  },
  Uncommon: {
    bg: 'bg-green-900/30',
    border: 'border-green-500',
    text: 'text-green-400',
    glow: 'shadow-green-500/30',
  },
  Rare: {
    bg: 'bg-blue-900/30',
    border: 'border-blue-500',
    text: 'text-blue-400',
    glow: 'shadow-blue-500/30',
  },
  Epic: {
    bg: 'bg-purple-900/30',
    border: 'border-purple-500',
    text: 'text-purple-400',
    glow: 'shadow-purple-500/30',
  },
  Legendary: {
    bg: 'bg-yellow-900/30',
    border: 'border-yellow-500',
    text: 'text-yellow-400',
    glow: 'shadow-yellow-500/30',
  },
};

export function AchievementBadge({
  icon,
  name,
  description,
  rarity,
  earned,
  earnedAt,
}: AchievementBadgeProps) {
  const colors = rarityColors[rarity];

  const tooltipContent = earned
    ? `${name}\n${description}\nEarned: ${earnedAt ? new Date(earnedAt).toLocaleDateString() : 'Recently'}`
    : `${name}\n${description}\nLocked`;

  return (
    <Tooltip content={tooltipContent}>
      <motion.div
        className={`relative flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all ${
          earned
            ? `${colors.bg} ${colors.border} shadow-lg ${colors.glow}`
            : 'bg-gray-900 border-gray-700 opacity-50 grayscale'
        }`}
        whileHover={{ scale: earned ? 1.05 : 1 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        {/* Icon */}
        <div className="text-4xl mb-2">{earned ? icon : '???'}</div>

        {/* Name */}
        <div
          className={`text-sm font-bold text-center ${
            earned ? colors.text : 'text-gray-600'
          }`}
        >
          {earned ? name : 'Locked'}
        </div>

        {/* Rarity */}
        <div
          className={`text-xs mt-1 ${
            earned ? colors.text : 'text-gray-700'
          }`}
        >
          {rarity}
        </div>

        {/* Locked overlay */}
        {!earned && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
            <svg
              className="w-8 h-8 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
        )}
      </motion.div>
    </Tooltip>
  );
}
