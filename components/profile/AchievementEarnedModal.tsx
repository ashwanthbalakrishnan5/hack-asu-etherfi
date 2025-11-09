'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Modal } from '@/components/ui/Modal';
import type { AchievementDefinition } from '@/lib/achievements';

interface AchievementEarnedModalProps {
  achievement: AchievementDefinition | null;
  onClose: () => void;
}

// Simple confetti particle component
function ConfettiParticle({ delay, index }: { delay: number; index: number }) {
  const colors = ['#06b6d4', '#3b82f6', '#8b5cf6', '#f59e0b', '#10b981'];
  // Use deterministic values based on index to avoid hydration mismatches
  const randomColor = colors[index % colors.length];
  const randomX = ((index * 37) % 100) - 50; // Pseudo-random but deterministic
  const randomRotate = (index * 71) % 360;

  return (
    <motion.div
      className="absolute w-2 h-2 rounded-full"
      style={{ backgroundColor: randomColor }}
      initial={{ opacity: 1, x: 0, y: 0, rotate: 0 }}
      animate={{
        opacity: 0,
        x: randomX,
        y: 200,
        rotate: randomRotate,
      }}
      transition={{
        duration: 1.5,
        delay,
        ease: 'easeOut',
      }}
    />
  );
}

export function AchievementEarnedModal({
  achievement,
  onClose,
}: AchievementEarnedModalProps) {
  const [autoCloseTimer, setAutoCloseTimer] = useState<NodeJS.Timeout | null>(
    null
  );

  useEffect(() => {
    if (achievement) {
      // Auto-close after 5 seconds
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      setAutoCloseTimer(timer);

      return () => {
        if (timer) clearTimeout(timer);
      };
    }
  }, [achievement, onClose]);

  if (!achievement) return null;

  const rarityColors: Record<string, string> = {
    Common: 'text-gray-300',
    Uncommon: 'text-green-400',
    Rare: 'text-blue-400',
    Epic: 'text-purple-400',
    Legendary: 'text-yellow-400',
  };

  return (
    <Modal
      isOpen={!!achievement}
      onClose={onClose}
      title=""
    >
      <div className="relative flex flex-col items-center py-8">
        {/* Confetti */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
          {Array.from({ length: 30 }).map((_, i) => (
            <ConfettiParticle key={i} delay={i * 0.05} index={i} />
          ))}
        </div>

        {/* Achievement Content */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: 'spring',
            stiffness: 260,
            damping: 20,
            delay: 0.2,
          }}
          className="relative z-10"
        >
          <div className="text-8xl mb-4">{achievement.icon}</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center z-10"
        >
          <h2 className="text-2xl font-bold text-white mb-2">
            Achievement Unlocked!
          </h2>
          <h3 className={`text-xl font-bold mb-2 ${rarityColors[achievement.rarity]}`}>
            {achievement.name}
          </h3>
          <p className="text-gray-400 mb-1">{achievement.description}</p>
          <p className={`text-sm ${rarityColors[achievement.rarity]}`}>
            {achievement.rarity}
          </p>
        </motion.div>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          onClick={onClose}
          className="mt-6 px-6 py-2 bg-cyan-500 hover:bg-cyan-600 text-white font-medium rounded-lg transition-colors z-10"
        >
          Awesome!
        </motion.button>

        <p className="text-xs text-gray-500 mt-3 z-10">
          Auto-closes in 5 seconds
        </p>
      </div>
    </Modal>
  );
}
