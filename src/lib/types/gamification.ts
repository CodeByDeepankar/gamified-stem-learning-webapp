export interface UserProgress {
  id: string;
  userId: string;
  totalXP: number;
  level: number;
  currentStreak: number;
  longestStreak: number;
  badgesEarned: string[];
  achievementsUnlocked: string[];
  lastActivityDate: Date;
  weeklyGoalProgress: number;
  weeklyGoalTarget: number;
}

export interface Badge {
  id: string;
  name: string;
  nameOdia: string;
  description: string;
  descriptionOdia: string;
  icon: string;
  color: string;
  category: 'learning' | 'streak' | 'challenge' | 'social' | 'milestone';
  requirements: BadgeRequirement[];
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  xpReward: number;
}

export interface BadgeRequirement {
  type: 'xp_total' | 'streak_days' | 'challenges_completed' | 'subjects_mastered' | 'daily_goals_met';
  value: number;
  subject?: string;
  grade?: string;
}

export interface Achievement {
  id: string;
  title: string;
  titleOdia: string;
  description: string;
  descriptionOdia: string;
  icon: string;
  xpReward: number;
  unlockedAt: Date;
  category: 'first_time' | 'mastery' | 'consistency' | 'exploration' | 'challenge';
}

export interface LearningSession {
  id: string;
  userId: string;
  subject: string;
  grade: string;
  topicId: string;
  startTime: Date;
  endTime: Date;
  xpEarned: number;
  accuracy: number;
  completionStatus: 'completed' | 'partial' | 'abandoned';
  challengesAttempted: number;
  challengesCorrect: number;
}

export interface DailyChallenge {
  id: string;
  date: Date;
  subject: string;
  grade: string;
  title: string;
  titleOdia: string;
  description: string;
  descriptionOdia: string;
  difficulty: 'easy' | 'medium' | 'hard';
  xpReward: number;
  timeLimit: number; // in minutes
  questions: ChallengeQuestion[];
}

export interface ChallengeQuestion {
  id: string;
  question: string;
  questionOdia: string;
  type: 'multiple_choice' | 'true_false' | 'fill_blank' | 'drag_drop';
  options?: string[];
  optionsOdia?: string[];
  correctAnswer: string;
  explanation: string;
  explanationOdia: string;
  points: number;
}

export interface Leaderboard {
  id: string;
  type: 'global' | 'grade' | 'school' | 'weekly';
  entries: LeaderboardEntry[];
  lastUpdated: Date;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  totalXP: number;
  level: number;
  streak: number;
  avatar?: string;
}

export interface XPReward {
  amount: number;
  reason: string;
  reasonOdia: string;
  category: 'lesson_complete' | 'streak_bonus' | 'challenge_win' | 'badge_earned' | 'daily_goal';
}
