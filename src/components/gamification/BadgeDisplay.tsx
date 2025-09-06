'use client';

import { motion } from 'framer-motion';
import { Badge } from '@/lib/types/gamification';

interface BadgeDisplayProps {
  badge: Badge;
  isEarned: boolean;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
  showTooltip?: boolean;
}

export default function BadgeDisplay({ 
  badge, 
  isEarned, 
  onClick, 
  size = 'md',
  showTooltip = true 
}: BadgeDisplayProps) {
  const sizeClasses = {
    sm: 'w-12 h-12 text-xl',
    md: 'w-16 h-16 text-2xl',
    lg: 'w-24 h-24 text-4xl'
  };

  const rarityColors = {
    common: 'from-gray-400 to-gray-500',
    uncommon: 'from-green-400 to-green-500',
    rare: 'from-blue-400 to-blue-500',
    epic: 'from-purple-400 to-purple-500',
    legendary: 'from-yellow-400 to-yellow-500'
  };

  const rarityGlow = {
    common: 'shadow-gray-300',
    uncommon: 'shadow-green-300',
    rare: 'shadow-blue-300', 
    epic: 'shadow-purple-300',
    legendary: 'shadow-yellow-300'
  };

  return (
    <div className="relative group">
      <motion.div
        className={`
          ${sizeClasses[size]}
          ${isEarned 
            ? `bg-gradient-to-br ${rarityColors[badge.rarity]} ${rarityGlow[badge.rarity]} shadow-lg` 
            : 'bg-gray-200 shadow-sm'
          }
          rounded-full flex items-center justify-center cursor-pointer
          transition-all duration-200 hover:scale-110
          ${isEarned ? 'hover:shadow-xl' : 'hover:shadow-md'}
        `}
        onClick={onClick}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <span 
          className={`
            ${isEarned ? 'text-white' : 'text-gray-400'}
            filter ${isEarned ? 'drop-shadow-sm' : ''}
          `}
        >
          {badge.icon}
        </span>
        
        {/* Earned indicator */}
        {isEarned && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-secondary-500 rounded-full border-2 border-white flex items-center justify-center">
            <span className="text-xs text-white">✓</span>
          </div>
        )}
      </motion.div>

      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
          <div className="font-medium">{badge.name}</div>
          <div className="text-xs text-gray-300 mt-1">{badge.description}</div>
          <div className="text-xs text-primary-300 mt-1">+{badge.xpReward} XP</div>
          
          {/* Tooltip arrow */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
        </div>
      )}
    </div>
  );
}
