import { OfflineManager } from '@/lib/db/database';

export interface DynamicGoal {
  id: string;
  label: string;
  progress: number; // 0-100
  done: boolean;
  type: 'goal' | 'achievement';
  points?: number;
}

export interface ProfileMetrics {
  mood: 'happy' | 'focused' | 'tired' | 'neutral';
  goals: DynamicGoal[];
}

// Simple heuristic mood: based on today minutes & streak
export async function getProfileMetrics(userId: string): Promise<ProfileMetrics> {
  let mood: ProfileMetrics['mood'] = 'neutral';
  try {
    const minutesToday = await OfflineManager.getStudyTimeMinutes(userId, 'today');
    if (minutesToday > 60) mood = 'focused';
    else if (minutesToday > 30) mood = 'happy';
    else if (minutesToday < 5) mood = 'tired';
  } catch { /* ignore */ }

  const goals: DynamicGoal[] = [];
  try {
    const minutesToday = await OfflineManager.getStudyTimeMinutes(userId, 'today');
    goals.push({
      id: 'minutes-40',
      label: 'profile.spendMinutes',
      progress: Math.min(100, Math.round((minutesToday / 40) * 100)),
      done: minutesToday >= 40,
      type: 'goal'
    });
  } catch { /* ignore */ }

  // Placeholder achievement example using XP sum
  try {
    const xpBySubject = await OfflineManager.getXPBySubject(userId);
    const totalXP = Object.values(xpBySubject).reduce((a, b) => a + b, 0);
    goals.push({
      id: 'xp-200',
      label: 'profile.playScenarios',
      progress: Math.min(100, Math.round((totalXP / 200) * 100)),
      done: totalXP >= 200,
      type: 'achievement',
      points: 20,
    });
  } catch { /* ignore */ }

  return { mood, goals };
}
