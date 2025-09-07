"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from 'react-i18next';
import { useSession } from "@/hooks/useSession";
import XPProgressBar from "@/components/gamification/XPProgressBar";
import BadgeDisplay from "@/components/gamification/BadgeDisplay";
import { OfflineManager } from "@/lib/db/database";
import type { UserProgress, Badge } from "@/lib/types/gamification";

export default function StudentDashboard() {
  const { user } = useSession();
  const { t } = useTranslation('common');
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [minutesToday, setMinutesToday] = useState(0);
  const [xpBySubject, setXpBySubject] = useState<Record<string, number>>({});
  const [badges, setBadges] = useState<Badge[]>([]);
  const [showAllBadges, setShowAllBadges] = useState(false);

  useEffect(() => {
    (async () => {
      if (user) {
        const p = await OfflineManager.getProgress(user.userId);
        setProgress(p);
        const [t] = await Promise.all([
          OfflineManager.getStudyTimeMinutes(user.userId, 'today'),
        ]);
        setMinutesToday(t);
        const xps = await OfflineManager.getXPBySubject(user.userId);
        setXpBySubject(xps);
        const b = await OfflineManager.getEarnedBadges(user.userId);
        setBadges(b);
      }
    })();
  }, [user]);

  const totalXP = progress?.totalXP ?? 0;
  const level = progress?.level ?? Math.max(1, Math.floor(totalXP / 100) + 1);
  const levelXP = (level - 1) * 100;
  const nextLevelXP = level * 100;
  const currentStreak = progress?.currentStreak ?? 0;
  const lastActivity = progress?.lastActivityDate ? new Date(progress.lastActivityDate) : null;
  const isActiveToday = lastActivity ? sameDay(lastActivity, new Date()) : false;

  // Subject mastery estimation based on XP (lightweight offline heuristic)
  const mastery = useMemo(() => {
    const map: Record<string, number> = {
      mathematics: Math.min(100, (xpBySubject["mathematics"] ?? 0) % 100),
      science: Math.min(100, (xpBySubject["science"] ?? 0) % 100),
      technology: Math.min(100, (xpBySubject["technology"] ?? 0) % 100),
    };
    return map;
  }, [xpBySubject]);

  return (
    <section className="mb-10">
      {/* Welcome Header */}
  <div className="bg-white dark:bg-gray-900/70 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-card p-5 transition-colors">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl">🧠</div>
            <div>
              <div className="text-gray-600 dark:text-gray-300 text-sm font-odia">{t('dashboard.greeting', { name: user?.name || '' })}</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">{t('dashboard.title')}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">{t('dashboard.grade', { grade: user?.grade ?? '-' })}</p>
            </div>
          </div>
          <Link href="/profile" className="text-blue-600 hover:underline text-sm">Profile</Link>
        </div>
        <div className="mt-4">
          <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">{t('dashboard.dailyGoal')}</div>
          <ProgressCircle value={minutesToday} target={30} />
        </div>
      </div>

      {/* XP & Streak (combined) */}
  <div className="mt-4 bg-white dark:bg-gray-900/70 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-card p-5 transition-colors">
	  <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">{t('dashboard.levelXpStreak')}</div>
        <XPProgressBar currentXP={totalXP} levelXP={levelXP} nextLevelXP={nextLevelXP} level={level} animated />
        <div className="mt-3 flex items-center justify-between">
          <div className="text-sm text-gray-600 dark:text-gray-400">{t('dashboard.streak')}</div>
          <div className="flex items-center gap-2">
            <div className={`w-6 h-6 rounded-full grid place-items-center ${isActiveToday ? 'bg-orange-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-300'}`}>🔥</div>
            <div className="text-sm text-gray-900 dark:text-gray-100 font-medium">{currentStreak} days</div>
          </div>
        </div>
      </div>

      {/* Missions Card */}
  <div className="mt-4 bg-white dark:bg-gray-900/70 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-card p-5 transition-colors">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold">{t('dashboard.missions')}</h4>
          <Link href={`/quiz?grade=${user?.grade ?? ''}`} className="px-3 py-2 rounded-lg bg-blue-600 text-white text-sm">{t('dashboard.startMission')}</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { key: 'mathematics', label: t('dashboard.subject.mathematics'), color: 'from-indigo-500 to-blue-500' },
            { key: 'science', label: t('dashboard.subject.science'), color: 'from-emerald-500 to-teal-500' },
            { key: 'technology', label: t('dashboard.subject.technology'), color: 'from-amber-500 to-orange-500' },
          ].map(s => (
            <div key={s.key} className="rounded-xl border border-gray-200 dark:border-gray-700 p-3 bg-white/70 dark:bg-gray-800/60 transition-colors">
              <div className="text-sm text-gray-600 dark:text-gray-300 mb-1">{s.label}</div>
              <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded overflow-hidden">
                <div className={`h-full bg-gradient-to-r ${s.color}`} style={{ width: `${mastery[s.key] ?? 0}%` }} />
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t('dashboard.percentReady', { percent: Math.round(mastery[s.key] ?? 0) })}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Learning Progress Card */}
  <div className="mt-4 bg-white dark:bg-gray-900/70 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-card p-5 transition-colors">
	<h4 className="font-semibold mb-3 text-gray-900 dark:text-gray-100">{t('dashboard.learningProgress')}</h4>
        <div className="space-y-3">
          {([
            { key: 'mathematics', name: t('dashboard.subject.mathematics') },
            { key: 'science', name: t('dashboard.subject.science') },
            { key: 'technology', name: t('dashboard.subject.technology') },
          ] as const).map(s => (
            <SubjectProgress key={s.key} name={s.name} percent={mastery[s.key] ?? 0} />
          ))}
        </div>
      </div>

      {/* Badges Card */}
  <div className="mt-4 bg-white dark:bg-gray-900/70 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-card p-5 transition-colors">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold text-gray-900 dark:text-gray-100">{t('dashboard.badges')}</h4>
          {badges.length > 4 && (
            <button onClick={() => setShowAllBadges(v => !v)} className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
              {showAllBadges ? t('dashboard.showLess') : t('dashboard.showAll')}
            </button>
          )}
        </div>
        {badges.length === 0 ? (
          <div className="text-sm text-gray-500 dark:text-gray-400">{t('dashboard.badgesNone')}</div>
        ) : (
          <div className="flex flex-wrap gap-4">
            {(showAllBadges ? badges : badges.slice(0, 4)).map(b => (
              <BadgeDisplay key={b.id} badge={b} isEarned={true} size="md" />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function ProgressCircle({ value, target }: { value: number; target: number }) {
  const pct = Math.max(0, Math.min(100, Math.round((value / target) * 100)));
  return (
    <div className="flex items-center gap-3">
      <div
        className="w-16 h-16 rounded-full grid place-items-center text-sm"
        style={{ background: `conic-gradient(#2563eb ${pct * 3.6}deg, #e5e7eb 0)` }}
      >
        <div className="w-12 h-12 bg-white rounded-full grid place-items-center text-xs text-gray-700">
          {pct}%
        </div>
      </div>
      <div className="text-sm text-gray-600">{value} / {target} min</div>
    </div>
  );
}

function SubjectProgress({ name, percent }: { name: string; percent: number }) {
  let color = 'bg-emerald-500';
  if (percent < 34) color = 'bg-rose-500';
  else if (percent < 67) color = 'bg-yellow-400';
  return (
    <div>
      <div className="flex items-center justify-between text-sm text-gray-700 mb-1">
        <span>{name}</span>
        <span className="text-gray-500">{Math.round(percent)}%</span>
      </div>
      <div className="h-2.5 bg-gray-100 rounded">
        <div className={`h-2.5 ${color} rounded`} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

