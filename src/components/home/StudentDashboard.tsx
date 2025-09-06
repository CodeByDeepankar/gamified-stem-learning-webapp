"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSession } from "@/hooks/useSession";
import StreakCounter from "@/components/gamification/StreakCounter";
import XPProgressBar from "@/components/gamification/XPProgressBar";
import { OfflineManager } from "@/lib/db/database";
import type { UserProgress, Badge } from "@/lib/types/gamification";
import { grade6MathTopics } from "@/data/content/grade6-mathematics";

const THEMES = [
  { id: "blue", name: "Blue", bg: "from-blue-50 via-white to-blue-100" },
  { id: "green", name: "Green", bg: "from-green-50 via-white to-green-100" },
  { id: "purple", name: "Purple", bg: "from-purple-50 via-white to-purple-100" },
  { id: "orange", name: "Orange", bg: "from-orange-50 via-white to-orange-100" },
] as const;

type ThemeId = (typeof THEMES)[number]["id"];

export default function StudentDashboard() {
  const { user } = useSession();
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [theme, setTheme] = useState<ThemeId>("blue");
  const [minutesToday, setMinutesToday] = useState(0);
  const [minutesWeek, setMinutesWeek] = useState(0);
  const [xpBySubject, setXpBySubject] = useState<Record<string, number>>({});
  const [badges, setBadges] = useState<Badge[]>([]);

  useEffect(() => {
    (async () => {
      if (user) {
        const p = await OfflineManager.getProgress(user.userId);
        setProgress(p);
        const saved = localStorage.getItem(`theme:${user.userId}`) as ThemeId | null;
        if (saved) setTheme(saved);
        const [t, w] = await Promise.all([
          OfflineManager.getStudyTimeMinutes(user.userId, 'today'),
          OfflineManager.getStudyTimeMinutes(user.userId, 'week'),
        ]);
        setMinutesToday(t);
        setMinutesWeek(w);
        const xps = await OfflineManager.getXPBySubject(user.userId);
        setXpBySubject(xps);
        const b = await OfflineManager.getEarnedBadges(user.userId);
        setBadges(b);
      }
    })();
  }, [user]);

  const onChangeTheme = (t: ThemeId) => {
    setTheme(t);
    if (user) localStorage.setItem(`theme:${user.userId}`, t);
  };

  const totalXP = progress?.totalXP ?? 0;
  const level = progress?.level ?? Math.max(1, Math.floor(totalXP / 100) + 1);
  const levelXP = (level - 1) * 100;
  const nextLevelXP = level * 100;
  const currentStreak = progress?.currentStreak ?? 0;
  const longestStreak = progress?.longestStreak ?? 0;
  const lastActivity = progress?.lastActivityDate ? new Date(progress.lastActivityDate) : null;
  const isActiveToday = lastActivity ? sameDay(lastActivity, new Date()) : false;

  const themeBg = useMemo(() => THEMES.find(t => t.id === theme)?.bg ?? THEMES[0].bg, [theme]);

  return (
    <section className={`mb-16 bg-gradient-to-br ${themeBg} rounded-2xl border shadow-sm p-6`}>
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl">🧠</div>
          <div>
            <div className="text-gray-500 text-xs">ନମସ୍କାର, {user?.name || 'ଶିକ୍ଷାର୍ଥୀ'}!</div>
            <h3 className="text-2xl font-bold text-gray-900">Your Dashboard</h3>
            <p className="text-gray-600">Grade {user?.grade ?? "-"}</p>
          </div>
        </div>
        <Link href="/profile" className="text-blue-600 hover:underline">Profile</Link>
      </div>

      {/* Theme Picker */}
      <div className="mt-4 flex items-center gap-2 text-sm">
        <span className="text-gray-600">Theme:</span>
        {THEMES.map(t => (
          <button
            key={t.id}
            className={`px-3 py-1 rounded border ${theme === t.id ? 'bg-white shadow font-medium' : 'bg-gray-50 hover:bg-white'}`}
            onClick={() => onChangeTheme(t.id)}
          >
            {t.name}
          </button>
        ))}
      </div>

      {/* Goals, Progress & Streak */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="bg-white rounded-xl border p-4">
          <div className="text-sm text-gray-600 mb-2">Daily Goal</div>
          <ProgressCircle value={minutesToday} target={30} />
          <div className="mt-2 text-xs text-gray-500">You studied {minutesToday} min today / target 30 min</div>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <div className="text-sm text-gray-600 mb-2">XP Progress</div>
          <XPProgressBar currentXP={totalXP} levelXP={levelXP} nextLevelXP={nextLevelXP} level={level} animated />
          <div className="mt-2 text-xs text-gray-500">Keep going! Level {level + 1} is near.</div>
        </div>
        <div className="md:col-span-1">
          <StreakCounter currentStreak={currentStreak} longestStreak={longestStreak} isActive={isActiveToday} />
        </div>
      </div>

      {/* Game/Quest Panel */}
      <div className="mt-6 bg-white rounded-xl border p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold">Missions</h4>
          <Link href={`/quiz?grade=${user?.grade ?? ''}`} className="px-3 py-2 rounded bg-blue-600 text-white">Start Mission</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { key: 'mathematics', label: 'ଗଣିତ', color: 'from-indigo-500 to-blue-500' },
            { key: 'science', label: 'ବିଜ୍ଞାନ', color: 'from-emerald-500 to-teal-500' },
            { key: 'technology', label: 'IT', color: 'from-amber-500 to-orange-500' },
          ].map(s => (
            <div key={s.key} className="rounded-lg border p-3">
              <div className="text-sm text-gray-600 mb-1">{s.label}</div>
              <div className="h-2 bg-gray-100 rounded overflow-hidden">
                <div className={`h-full bg-gradient-to-r ${s.color}`} style={{ width: `${Math.min(((xpBySubject[s.key] || 0) % 100), 100)}%` }} />
              </div>
              <div className="text-xs text-gray-500 mt-1">XP: {xpBySubject[s.key] || 0}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Rewards & Badges */}
      <div className="mt-6 bg-white rounded-xl border p-4">
        <h4 className="font-semibold mb-3">Rewards & Badges</h4>
        {badges.length === 0 ? (
          <div className="text-sm text-gray-500">Earn badges by completing missions!</div>
        ) : (
          <div className="flex flex-wrap gap-4">
            {badges.map(b => (
              <div key={b.id} className="flex items-center gap-2 text-sm">
                <span>🏅</span>
                <span>{b.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Learning Progress */}
      <div className="mt-6 bg-white rounded-xl border p-4">
        <h4 className="font-semibold mb-3">Learning Progress</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {grade6MathTopics.slice(0, 6).map(t => (
            <TopicProgressRow key={t.id} topic={t.title} status={statusFromSessions(t.id)} />
          ))}
        </div>
      </div>

      {/* Offline Games/Quizzes */}
      <div className="mt-6 bg-white rounded-xl border p-4">
        <h4 className="font-semibold mb-3">Offline Games & Quizzes</h4>
        <div className="flex flex-wrap gap-3">
          <Link href={`/games?grade=${user?.grade ?? ''}&offline=1`} className="px-3 py-2 rounded bg-gray-900 text-white">Fraction Puzzle</Link>
          <Link href={`/quiz?grade=${user?.grade ?? ''}&offline=1`} className="px-3 py-2 rounded bg-gray-900 text-white">Chemistry Matching</Link>
        </div>
      </div>

      {/* Profile */}
      <div className="mt-6 bg-white rounded-xl border p-4">
        <h4 className="font-semibold mb-3">Profile</h4>
        <div className="text-sm text-gray-700">Name: {user?.name} • Grade {user?.grade}</div>
        <div className="mt-2 text-sm">Language:
          <button className="ml-2 px-2 py-1 rounded border">English</button>
          <button className="ml-2 px-2 py-1 rounded border">Odia</button>
        </div>
        <div className="mt-2 text-sm text-gray-500">Switch profiles (siblings): <Link href="/profile" className="text-blue-600">Manage</Link></div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <MenuCard href={`/quiz?grade=${user?.grade ?? ''}`} title="Quizzes" icon="📝" color="from-indigo-500 to-blue-500" />
        <MenuCard href={`/assignments?grade=${user?.grade ?? ''}`} title="Assignments" icon="📚" color="from-emerald-500 to-teal-500" />
        <MenuCard href={`/games?grade=${user?.grade ?? ''}`} title="Games" icon="🎮" color="from-amber-500 to-orange-500" />
        <MenuCard href={`/notes?grade=${user?.grade ?? ''}`} title="Notes" icon="📒" color="from-purple-500 to-fuchsia-500" />
        <MenuCard href={`/daily-challenge?grade=${user?.grade ?? ''}`} title="Daily Streak" icon="🔥" color="from-rose-500 to-pink-500" />
        <MenuCard href={`/achievements`} title="Achievements" icon="🏆" color="from-sky-500 to-cyan-500" />
      </div>
    </section>
  );
}

function statusFromSessions(_topicId: string): 'mastered' | 'learning' | 'need_help' | 'not_started' {
  // Heuristic using sessions stored in IndexedDB; returns not_started if nothing found.
  // In a fuller implementation, we'd join with contentProgress.
  // Here we keep it simple by checking localStorage markers (none) or return learning by default.
  return 'learning';
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

function TopicProgressRow({ topic, status }: { topic: string; status: 'mastered' | 'learning' | 'need_help' | 'not_started' }) {
  const color = status === 'mastered' ? 'bg-emerald-500'
    : status === 'learning' ? 'bg-yellow-400'
    : status === 'need_help' ? 'bg-rose-500'
    : 'bg-gray-300';
  const label = status === 'mastered' ? 'Mastered'
    : status === 'learning' ? 'Learning'
    : status === 'need_help' ? 'Needs practice'
    : 'Not started';
  return (
    <div className="flex items-center justify-between border rounded-lg p-3">
      <div className="text-sm text-gray-700">{topic}</div>
      <div className={`text-xs text-white px-2 py-1 rounded ${color}`}>{label}</div>
    </div>
  );
}

function MenuCard({ href, title, icon, color }: { href: string; title: string; icon: string; color: string }) {
  return (
    <Link href={href} className="group block">
      <div className={`rounded-xl p-4 bg-gradient-to-br ${color} text-white shadow-lg hover:shadow-xl transition transform group-hover:-translate-y-0.5`}>
        <div className="text-2xl">{icon}</div>
        <div className="mt-2 text-sm font-semibold">{title}</div>
      </div>
    </Link>
  );
}

