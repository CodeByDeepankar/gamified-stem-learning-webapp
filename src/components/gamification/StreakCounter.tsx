'use client';

import { motion } from 'framer-motion';
import { useTranslation } from 'next-i18next';

interface StreakCounterProps {
  currentStreak: number;
  longestStreak: number;
  isActive: boolean; // Whether user studied today
}

export default function StreakCounter({ 
  currentStreak, 
  longestStreak, 
  isActive 
}: StreakCounterProps) {
  const { t } = useTranslation('common');

  const getStreakColor = (streak: number) => {
    if (streak >= 30) return 'from-yellow-400 to-orange-500';
    if (streak >= 14) return 'from-orange-400 to-red-500';
    if (streak >= 7) return 'from-green-400 to-blue-500';
    if (streak >= 3) return 'from-blue-400 to-purple-500';
    return 'from-gray-400 to-gray-500';
  };

  const getStreakEmoji = (streak: number) => {
    if (streak >= 30) return '🔥';
    if (streak >= 14) return '⚡';
    if (streak >= 7) return '🌟';
    if (streak >= 3) return '💪';
    return '📚';
  };

  return (
    <div className="bg-white rounded-2xl p-4 shadow-card">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-800">
          {t('gamification.streak')}
        </h3>
        <motion.div
          animate={{ 
            scale: isActive ? [1, 1.2, 1] : 1,
            rotate: isActive ? [0, 10, -10, 0] : 0
          }}
          transition={{ duration: 0.6, repeat: isActive ? Infinity : 0, repeatDelay: 2 }}
          className="text-2xl"
        >
          {getStreakEmoji(currentStreak)}
        </motion.div>
      </div>

      <div className="flex items-center space-x-4">
        {/* Current Streak */}
        <div className="flex-1">
          <motion.div
            className={`
              bg-gradient-to-r ${getStreakColor(currentStreak)}
              rounded-xl p-4 text-center text-white
              ${isActive ? 'shadow-lg' : 'shadow-md'}
            `}
            animate={isActive ? { 
              boxShadow: [
                '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              ]
            } : {}}
            transition={{ duration: 2, repeat: isActive ? Infinity : 0 }}
          >
            <div className="text-2xl font-bold">{currentStreak}</div>
            <div className="text-sm opacity-90">
              {currentStreak === 1 ? 'Day' : 'Days'}
            </div>
          </motion.div>
        </div>

        {/* Streak Status */}
        <div className="flex-1 text-center">
          <div className={`
            w-3 h-3 rounded-full mx-auto mb-2
            ${isActive ? 'bg-secondary-500 animate-pulse' : 'bg-gray-300'}
          `} />
          <div className={`text-sm ${isActive ? 'text-secondary-600' : 'text-gray-500'}`}>
            {isActive ? 'Active' : 'Inactive'}
          </div>
        </div>
      </div>

      {/* Personal Best */}
      {longestStreak > currentStreak && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="text-center">
            <div className="text-xs text-gray-500 mb-1">Personal Best</div>
            <div className="text-sm font-semibold text-primary-600">
              🏆 {longestStreak} days
            </div>
          </div>
        </div>
      )}

      {/* Motivational Message */}
      <div className="mt-3 text-center">
        <div className="text-xs text-gray-600">
          {currentStreak === 0 && "Start your learning journey today!"}
          {currentStreak >= 1 && currentStreak < 3 && "Great start! Keep it up! 🚀"}
          {currentStreak >= 3 && currentStreak < 7 && "You're on fire! 🔥"}
          {currentStreak >= 7 && currentStreak < 14 && "Amazing consistency! ⭐"}
          {currentStreak >= 14 && currentStreak < 30 && "Unstoppable learner! 🌟"}
          {currentStreak >= 30 && "Legend in the making! 👑"}
        </div>
      </div>
    </div>
  );
}
