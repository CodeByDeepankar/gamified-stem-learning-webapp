'use client';

import { motion } from 'framer-motion';

interface XPProgressBarProps {
  currentXP: number;
  levelXP: number;
  nextLevelXP: number;
  level: number;
  animated?: boolean;
}

export default function XPProgressBar({ 
  currentXP, 
  levelXP, 
  nextLevelXP, 
  level, 
  animated = true 
}: XPProgressBarProps) {
  const xpInCurrentLevel = currentXP - levelXP;
  const xpNeededForNextLevel = nextLevelXP - levelXP;
  const progressPercentage = Math.min((xpInCurrentLevel / xpNeededForNextLevel) * 100, 100);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">
          Level {level}
        </span>
        <span className="text-xs text-gray-500">
          {xpInCurrentLevel}/{xpNeededForNextLevel} XP
        </span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        {animated ? (
          <motion.div
            className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        ) : (
          <div
            className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        )}
      </div>
      
      <div className="flex items-center justify-between mt-1">
        <span className="text-xs text-gray-400">
          {currentXP} Total XP
        </span>
        <span className="text-xs text-primary-600 font-medium">
          {nextLevelXP - currentXP} to next level
        </span>
      </div>
    </div>
  );
}
