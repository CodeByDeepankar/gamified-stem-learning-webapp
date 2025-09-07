"use client";

import { useSession } from "@/hooks/useSession";
import Link from "next/link";
import StudentProfilePanel from "@/components/profile/StudentProfilePanel";
import { useTranslation } from 'react-i18next';

export default function ProfilePage() {
  const { user, clear } = useSession();
  const { t } = useTranslation('common');

  return (
    <div className="min-h-[calc(100vh-3.5rem-3rem)] -mx-4 sm:mx-0 relative transition-colors bg-gradient-to-br from-white via-gray-50 to-gray-200 dark:from-gray-950 dark:via-slate-900 dark:to-gray-950">
      {/* Background gradient overlays (only visible in dark mode for now) */}
      <div className="absolute inset-0 opacity-0 dark:opacity-100 pointer-events-none bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.25),transparent_60%),radial-gradient(circle_at_70%_60%,rgba(147,51,234,0.2),transparent_65%)]" />
      <div className="absolute inset-0 bg-[url('/images/noise.png')] opacity-[0.03] dark:opacity-10 pointer-events-none" />
  <div className="relative max-w-7xl mx-auto px-4 py-8 md:py-12 flex flex-col gap-6 text-gray-900 dark:text-white">
        {!user ? (
          <div className="rounded-2xl bg-white/10 backdrop-blur border border-white/20 p-6">
            <h1 className="text-2xl font-bold mb-3">{t('profile.title','Profile')}</h1>
            <p className="text-white/80">{t('profile.noUser','No user is logged in. Please register or login from the homepage.')}</p>
            <Link href="/" className="mt-4 inline-block text-violet-200 hover:text-white underline">{t('profile.goHome','Go Home')}</Link>
          </div>
        ) : user.role === 'student' ? (
      <div className="flex flex-col lg:flex-row gap-8 w-full">
            <div className="w-full lg:w-auto">
              <StudentProfilePanel />
            </div>
            <div className="flex-1 min-w-0">
        <div className="rounded-2xl bg-white/10 dark:bg-white/5 backdrop-blur border border-white/20 dark:border-white/10 p-6 md:p-8 h-full flex flex-col transition-colors">
                <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
                  <h1 className="text-3xl font-bold tracking-tight">{t('profile.yourProfile','Your Profile')}</h1>
                  <button
                    onClick={clear}
                    className="px-4 py-2.5 rounded-lg text-sm font-semibold bg-gradient-to-r from-fuchsia-400 to-violet-500 hover:from-fuchsia-300 hover:to-violet-400 text-white shadow-lg shadow-violet-900/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-violet-700 focus:ring-white/60 transition"
                  >{t('profile.logout','Logout')}</button>
                </div>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div className="rounded-xl bg-white/5 border border-white/10 px-4 py-3">
                    <dt className="text-xs font-medium tracking-wide text-violet-200 uppercase">{t('profile.name','Name')}</dt>
                    <dd className="text-sm font-semibold text-gray-900 dark:text-white break-words">{user.name || '—'}</dd>
                  </div>
                  <div className="rounded-xl bg-white/5 border border-white/10 px-4 py-3">
                    <dt className="text-xs font-medium tracking-wide text-violet-200 uppercase">{t('profile.role','Role')}</dt>
                    <dd className="text-sm font-semibold text-gray-900 dark:text-white capitalize">{user.role || '—'}</dd>
                  </div>
                  <div className="rounded-xl bg-white/5 border border-white/10 px-4 py-3">
                    <dt className="text-xs font-medium tracking-wide text-violet-200 uppercase">{t('profile.userId','User ID')}</dt>
                    <dd className="text-[11px] font-mono text-violet-50 break-all">{user.userId}</dd>
                  </div>
                  <div className="rounded-xl bg-white/5 border border-white/10 px-4 py-3">
                    <dt className="text-xs font-medium tracking-wide text-violet-200 uppercase">{t('profile.studentId','Student ID')}</dt>
                    <dd className="text-[11px] font-mono text-violet-50 break-all">{user.studentId || user.userId}</dd>
                  </div>
                  <div className="rounded-xl bg-white/5 border border-white/10 px-4 py-3">
                    <dt className="text-xs font-medium tracking-wide text-violet-200 uppercase">{t('profile.grade','Grade')}</dt>
                    <dd className="text-sm font-semibold text-gray-900 dark:text-white">{user.grade || '—'}</dd>
                  </div>
                  {user.subject && (
                    <div className="rounded-xl bg-white/5 border border-white/10 px-4 py-3">
                      <dt className="text-xs font-medium tracking-wide text-violet-200 uppercase">{t('profile.subject','Subject')}</dt>
                      <dd className="text-sm font-semibold text-gray-900 dark:text-white">{user.subject}</dd>
                    </div>
                  )}
                  {user.schoolNameOrId && (
                    <div className="rounded-xl bg-white/5 border border-white/10 px-4 py-3 sm:col-span-2">
                      <dt className="text-xs font-medium tracking-wide text-violet-200 uppercase">{t('profile.school','School')}</dt>
                      <dd className="text-sm font-semibold text-gray-900 dark:text-white break-words">{user.schoolNameOrId}</dd>
                    </div>
                  )}
                </dl>
                <div className="mt-auto grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <button className="h-12 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-600 text-white text-sm font-semibold shadow hover:from-violet-400 hover:to-fuchsia-500 transition">{t('profile.progress','Progress')}</button>
                  <button className="h-12 rounded-xl bg-white/10 text-white text-sm font-semibold shadow-inner hover:bg-white/20 transition">{t('profile.achievements','Achievements')}</button>
                  <button className="h-12 rounded-xl bg-white/10 text-white text-sm font-semibold shadow-inner hover:bg-white/20 transition col-span-2 sm:col-span-1">{t('profile.settings','Settings')}</button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl bg-white/10 dark:bg-white/5 backdrop-blur border border-white/20 dark:border-white/10 p-6 md:p-8 space-y-4 transition-colors">
            <h1 className="text-3xl font-bold tracking-tight">{t('profile.title','Profile')}</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-xl bg-white/5 border border-white/10 px-4 py-3">
                <div className="text-xs font-medium tracking-wide text-violet-200 uppercase">{t('profile.name','Name')}</div>
                <div className="text-sm font-semibold text-gray-900 dark:text-white">{user.name}</div>
              </div>
              <div className="rounded-xl bg-white/5 border border-white/10 px-4 py-3">
                <div className="text-xs font-medium tracking-wide text-violet-200 uppercase">{t('profile.role','Role')}</div>
                <div className="text-sm font-semibold text-gray-900 dark:text-white">{user.role}</div>
              </div>
              <div className="rounded-xl bg-white/5 border border-white/10 px-4 py-3">
                <div className="text-xs font-medium tracking-wide text-violet-200 uppercase">{t('profile.userId','User ID')}</div>
                <div className="text-[11px] font-mono text-violet-50 break-all">{user.userId}</div>
              </div>
              {user.grade && (
                <div className="rounded-xl bg-white/5 border border-white/10 px-4 py-3">
                  <div className="text-xs font-medium tracking-wide text-violet-200 uppercase">{t('profile.grade','Grade')}</div>
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">{user.grade}</div>
                </div>
              )}
            </div>
            <div className="pt-4">
              <button onClick={clear} className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-fuchsia-400 to-violet-500 hover:from-fuchsia-300 hover:to-violet-400 text-white font-semibold text-sm shadow focus:outline-none focus:ring-2 focus:ring-white/60">{t('profile.logout','Logout')}</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

