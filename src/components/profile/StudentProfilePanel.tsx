"use client";
import React, { useEffect, useState } from 'react';
import { useSession } from '@/hooks/useSession';
import Image from 'next/image';
import { useUser } from '@clerk/nextjs';
import { useTranslation } from 'react-i18next';
import { OfflineManager } from '@/lib/db/database';
import { getProfileMetrics, type DynamicGoal } from '@/lib/profile/profileData';

interface ProgressBarProps { value: number; color?: string; }
const ProgressBar = ({ value, color = 'bg-indigo-500' }: ProgressBarProps) => (
  <div className="w-full h-3 rounded-full bg-white/40 overflow-hidden">
    <div className={`h-full ${color} transition-all duration-500`} style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
  </div>
);

interface GoalItemProps { label: string; done?: boolean; progress?: number; type?: 'goal' | 'achievement'; points?: number; }
function GoalItem({ label, done, progress, type='goal', points }: GoalItemProps) {
  const bar = progress !== undefined ? (
    <div className="mt-1 w-full h-1.5 bg-gray-200 rounded overflow-hidden">
      <div className={`h-full ${done ? 'bg-emerald-500' : 'bg-indigo-500'} transition-all`} style={{ width: `${progress}%` }} />
    </div>
  ) : null;
  return (
    <div className="rounded-md bg-white/60 backdrop-blur px-3 py-2 border border-violet-200/60">
      <div className="flex items-start justify-between gap-3">
        <div className="text-xs font-medium text-gray-700 leading-snug flex-1">
          {type === 'achievement' && <span className="inline-block text-[10px] font-bold tracking-wide rounded bg-violet-700 text-white px-1.5 py-0.5 mr-1">ACHIEVEMENT</span>}
          {type === 'goal' && <span className="inline-block text-[10px] font-bold tracking-wide rounded bg-amber-500 text-white px-1.5 py-0.5 mr-1">GOAL</span>}
          {label}
        </div>
        {type === 'achievement' && points !== undefined && (
          <div className="text-right text-[10px] font-semibold text-violet-800 leading-tight">
            <div>{points}</div>
            <div className="text-[9px] font-normal tracking-wide">POINTS</div>
          </div>
        )}
        {type === 'goal' && (
          <div className="w-5 h-5 mt-0.5 rounded-full border-2 flex items-center justify-center text-[10px] font-bold select-none bg-white border-violet-400 text-violet-500">
            {done ? '✓' : ''}
          </div>
        )}
      </div>
      {bar}
    </div>
  );
}

export default function StudentProfilePanel() {
  const { user } = useSession();
  const { user: clerkUser } = useUser();
  const { t } = useTranslation('common');
  const [readingProgress, setReadingProgress] = useState(0);
  const [communicationProgress, setCommunicationProgress] = useState(0);
  const [mood, setMood] = useState<'happy'|'focused'|'tired'|'neutral'>('neutral');
  const [goals, setGoals] = useState<DynamicGoal[]>([]);

  // Derive real-ish progress from sessions (reading = mathematics xp share, communication = science xp share placeholder)
  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!user) return;
      // Use XP per subject to approximate category progress
      const xpBySubject = await OfflineManager.getXPBySubject(user.userId);
      if (cancelled) return;
      const math = xpBySubject['mathematics'] || 0;
      const sci = xpBySubject['science'] || 0;
      const totalRef = 400; // arbitrary target for demo
      setReadingProgress(Math.min(100, Math.round((math / totalRef) * 100)));
      setCommunicationProgress(Math.min(100, Math.round((sci / totalRef) * 100)));
    }
    load();
    return () => { cancelled = true; };
  }, [user]);

  // Dynamic goals & mood
  useEffect(() => {
    let cancelled = false;
    async function loadGoals() {
      if (!user) return;
      const metrics = await getProfileMetrics(user.userId);
      if (cancelled) return;
      setMood(metrics.mood);
      setGoals(metrics.goals);
    }
    loadGoals();
    return () => { cancelled = true; };
  }, [user]);

  return (
    <div className="w-full max-w-sm mx-auto md:mx-0">
      <div className="rounded-2xl bg-gradient-to-b from-violet-200 via-purple-100 to-violet-100 p-4 shadow-inner border border-violet-300/60 flex flex-col gap-4">
        {/* Header */}
        <div className="flex gap-4">
          <div className="relative w-24 shrink-0 aspect-[3/4] rounded-xl overflow-hidden bg-gradient-to-br from-violet-400 to-fuchsia-500 ring-2 ring-violet-400 shadow flex items-center justify-center">
            {clerkUser?.imageUrl ? (
              <Image
                src={clerkUser.imageUrl}
                alt={clerkUser.fullName || clerkUser.username || 'User avatar'}
                fill
                sizes="96px"
                className="object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <span className="text-3xl font-bold text-white drop-shadow-sm">
                {(user?.name || clerkUser?.fullName || clerkUser?.username || 'S')
                  .trim()
                  .charAt(0)
                  .toUpperCase()}
              </span>
            )}
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-amber-400 text-xs font-bold px-2 py-0.5 rounded-full shadow ring-1 ring-amber-500/60 flex items-center gap-1">
              <span className="text-[11px]">Lv 3</span>
            </div>
          </div>
          <div className="flex-1 flex flex-col">
            <div className="text-[11px] tracking-wide font-medium text-violet-700">{t('profile.welcomeBack', 'Welcome back,')}</div>
            <div className="text-lg font-bold leading-tight text-violet-900 break-words">{user?.name || t('profile.name', 'Name')}</div>
            <div className="mt-auto">
              <div className="text-[11px] font-medium text-violet-700 mb-1">{t('profile.todaysMood', "Today's Mood")}</div>
              <div className="w-12 h-12 rounded-full border-2 border-violet-300 bg-white/60 grid place-items-center text-xs font-semibold text-violet-700">
                {mood === 'happy' && '😊'}
                {mood === 'focused' && '🎯'}
                {mood === 'tired' && '😴'}
                {mood === 'neutral' && '🙂'}
              </div>
            </div>
          </div>
        </div>

        {/* Progress Section */}
        <div className="rounded-xl bg-violet-500/10 p-3 border border-violet-300/60 flex flex-col gap-3">
          <div className="text-[11px] font-semibold tracking-wide text-violet-800">{t('profile.todaysProgress', "Today's Progress")}</div>
          <div className="space-y-2">
            <div>
              <div className="flex items-center justify-between text-[11px] font-medium text-violet-800 mb-1">
                <span>{t('profile.communication', 'Communication')}</span><span>{communicationProgress}%</span>
              </div>
              <ProgressBar value={communicationProgress} color="bg-violet-500" />
            </div>
            <div>
              <div className="flex items-center justify-between text-[11px] font-medium text-violet-800 mb-1">
                <span>{t('profile.reading', 'Reading')}</span><span>{readingProgress}%</span>
              </div>
              <ProgressBar value={readingProgress} color="bg-indigo-500" />
            </div>
          </div>
          <div className="flex items-center justify-end gap-2 text-[11px]">
            <button className="px-2 py-1 rounded bg-violet-600 text-white font-semibold shadow hover:bg-violet-700 transition text-[10px]">{t('profile.details', 'Details')}</button>
          </div>
        </div>

        {/* Goals & Achievements */}
        <div className="flex flex-col gap-2">
          {goals.length === 0 && (
            <div className="text-[11px] text-violet-600">{t('dashboard.badgesNone','Earn badges by completing missions!')}</div>
          )}
          {goals.map(g => (
            <GoalItem
              key={g.id}
              label={t(g.label, g.label)}
              progress={g.progress}
              done={g.done}
              type={g.type}
              points={g.points}
            />
          ))}
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3 mt-1">
          <button className="rounded-md h-12 bg-violet-700 text-white font-semibold text-sm shadow hover:bg-violet-800 transition">{t('profile.learn', 'Learn')}</button>
          <button className="rounded-md h-12 bg-violet-200 text-violet-800 font-semibold text-sm shadow-inner hover:bg-violet-300 transition">{t('profile.practice', 'Practice')}</button>
        </div>

        {/* Nav Icons */}
    <div className="mt-1 grid grid-cols-3 gap-4 text-center text-[11px] text-violet-800">
          <div className="flex flex-col items-center gap-1">
            <span className="text-2xl">✔️</span>
      <span className="font-medium">{t('profile.goals', 'Goals')}</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-2xl">🏆</span>
      <span className="font-medium">{t('profile.achievements', 'Achievements')}</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-2xl">📘</span>
      <span className="font-medium">{t('profile.journal', 'Journal')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
