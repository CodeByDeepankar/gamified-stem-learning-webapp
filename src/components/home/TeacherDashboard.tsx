"use client";

import { useEffect, useMemo, useState } from "react";
import { OfflineManager, type User } from "@/lib/db/database";
import { useSession } from "@/hooks/useSession";
import { useOffline } from "@/hooks/useOffline";
import { grade6MathTopics } from "@/data/content/grade6-mathematics";
import type { LearningSession } from "@/lib/types/gamification";
import type { SessionUser } from "@/lib/session/session";

export default function TeacherDashboard() {
  const { user, setUser } = useSession();
  const [students, setStudents] = useState<User[]>([]);
  const [leaderboard, setLeaderboard] = useState<Array<{ user: User; totalXP: number; level: number; streak: number }>>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [studentSessions, setStudentSessions] = useState<LearningSession[]>([]);
  const [sessionsByUser, setSessionsByUser] = useState<Record<string, LearningSession[]>>({});
  const [engagement, setEngagement] = useState<{ avgMinutesWeek: number; activeToday: number; activeThisWeek: number; totalStudents: number } | null>(null);
  const offline = useOffline();

  // If schoolId/grade is missing, show a simple setup form instead of an error
  const [schoolIdInput, setSchoolIdInput] = useState<string>(user?.schoolId ?? "");
  const [gradeInput, setGradeInput] = useState<string>(user?.grade ?? "");
  const [savingProfile, setSavingProfile] = useState(false);
  const [setupError, setSetupError] = useState<string | null>(null);

  async function saveProfile() {
    if (!schoolIdInput || !gradeInput) {
      setSetupError("Please provide both School ID and Grade.");
      return;
    }
    setSetupError(null);
    setSavingProfile(true);
    try {
      if (!user) return;
      await OfflineManager.registerTeacher({
        schoolId: schoolIdInput,
        grade: gradeInput,
        userId: user.userId,
        name: user.name,
        preferredLanguage: user.preferredLanguage ?? 'en',
      });
      const patch: SessionUser = {
        userId: user.userId,
        role: 'teacher',
        name: user.name,
        grade: gradeInput,
        schoolId: schoolIdInput,
        schoolNameOrId: schoolIdInput,
        preferredLanguage: user.preferredLanguage ?? 'en',
      };
      setUser(patch);
    } finally {
      setSavingProfile(false);
    }
  }

  useEffect(() => {
    (async () => {
      if (!user?.schoolId || !user?.grade) {
        // Wait until teacher completes profile
        setLoading(false);
        return;
      }
      try {
        const list = await OfflineManager.getStudentsBySchool(user.schoolId);
        const sameClass = list.filter(s => s.grade === user.grade);
        setStudents(sameClass);
        const lbRaw = await OfflineManager.getSchoolLeaderboard(user.schoolId);
        setLeaderboard(
          lbRaw
            .filter(r => r.user.grade === user.grade)
            .map(r => ({
              user: r.user,
              totalXP: r.progress?.totalXP ?? 0,
              level: r.progress?.level ?? 1,
              streak: r.progress?.currentStreak ?? 0,
            }))
        );
        const e = await OfflineManager.getClassEngagement(user.schoolId, user.grade);
        setEngagement(e);
        const map: Record<string, LearningSession[]> = {};
        for (const st of sameClass) {
          map[st.userId] = await OfflineManager.getUserSessions(st.userId) as LearningSession[];
        }
        setSessionsByUser(map);
        if (sameClass[0]) {
          setSelectedStudent(sameClass[0].userId);
          setStudentSessions(map[sameClass[0].userId] || []);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [user?.schoolId, user?.grade]);

  const topics = useMemo(() => grade6MathTopics.slice(0, 6), []);

  if (!user?.schoolId || !user?.grade) {
    return (
      <section className="mb-16 bg-white rounded-2xl border shadow-sm p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">Complete Teacher Profile</h3>
        <p className="text-sm text-gray-600 mb-4">Enter your School ID and Class/Grade to view your class list.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <label className="block">
            <span className="block text-sm text-gray-600 mb-1">School ID</span>
            <input className="w-full border rounded px-3 py-2" value={schoolIdInput} onChange={(e) => setSchoolIdInput(e.target.value)} />
          </label>
          <label className="block">
            <span className="block text-sm text-gray-600 mb-1">Grade</span>
            <select className="w-full border rounded px-3 py-2" value={gradeInput} onChange={(e) => setGradeInput(e.target.value)}>
              <option value="">Select</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
              <option value="11">11</option>
              <option value="12">12</option>
            </select>
          </label>
          <div className="flex items-end">
            <button onClick={saveProfile} disabled={savingProfile} className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50 w-full">{savingProfile ? 'Saving...' : 'Save'}</button>
          </div>
        </div>
        {setupError && <div className="text-sm text-rose-600 mt-3">{setupError}</div>}
      </section>
    );
  }

  async function onSelectStudent(id: string) {
    setSelectedStudent(id);
    setStudentSessions(await OfflineManager.getUserSessions(id));
  }

  if (loading) return <div className="bg-white rounded-2xl border p-6">Loading teacher dashboard...</div>;

  return (
    <section className="mb-16 bg-white rounded-2xl border shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h3 className="text-2xl font-bold text-gray-900">Teacher Dashboard</h3>
          <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded ${offline.status.isOnline ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>
            <span className={`w-2 h-2 rounded-full ${offline.status.isOnline ? 'bg-emerald-500' : 'bg-gray-400'}`} />
            {offline.status.isOnline ? 'Online' : 'Offline'}
            {offline.status.pendingSyncCount > 0 ? ` • ${offline.status.pendingSyncCount} pending` : ''}
          </span>
        </div>
      </div>

      <div className="text-gray-600 mb-4">School ID: {user?.schoolId} • Grade {user?.grade}</div>

      {/* Engagement Tracker */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="rounded-xl border p-4">
          <div className="text-sm text-gray-600">Avg study time (this week)</div>
          <div className="text-2xl font-bold">{engagement?.avgMinutesWeek ?? 0} min</div>
        </div>
        <div className="rounded-xl border p-4">
          <div className="text-sm text-gray-600">Active students today</div>
          <div className="text-2xl font-bold">{engagement?.activeToday ?? 0} / {engagement?.totalStudents ?? 0}</div>
        </div>
        <div className="rounded-xl border p-4">
          <div className="text-sm text-gray-600">Active students this week</div>
          <div className="text-2xl font-bold">{engagement?.activeThisWeek ?? 0} / {engagement?.totalStudents ?? 0}</div>
        </div>
      </div>

      {/* Class Overview Heatmap */}
      <div className="rounded-xl border p-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold">Class Overview</h4>
          <div className="text-xs text-gray-500">Green=mastered, Yellow=partial, Red=needs support</div>
        </div>
        <div className="overflow-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr>
                <th className="text-left p-2">Student</th>
                {topics.map(t => (
                  <th key={t.id} className="p-2 text-left whitespace-nowrap">{t.title}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {students.map(s => (
                <tr key={s.userId} className="border-t">
                  <td className="p-2 whitespace-nowrap">{s.name || s.userId}</td>
                  {topics.map(t => (
                    <td key={t.id} className="p-2">
                      <HeatCell sessions={(sessionsByUser[s.userId] || []).filter(ss => ss.topicId === t.id)} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Students & Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl border p-4">
          <h4 className="font-semibold mb-3">Students ({students.length})</h4>
          <select className="mb-3 border rounded px-2 py-1" value={selectedStudent ?? ''} onChange={(e) => onSelectStudent(e.target.value)}>
            {students.map(s => <option key={s.userId} value={s.userId}>{s.name || s.userId}</option>)}
          </select>
          <div className="text-xs text-gray-500 mb-2">Selected student recent sessions: {studentSessions.length}</div>
          <div className="max-h-64 overflow-auto divide-y">
            {students.length === 0 ? (
              <div className="text-gray-500 text-sm">No students registered with this School ID yet.</div>
            ) : (
              students.map(s => {
                const sessions = sessionsByUser[s.userId] || [];
                const today = new Date(); today.setHours(0,0,0,0);
                const activeToday = sessions.some(sess => new Date(sess.startTime) >= today);
                return (
                  <a key={s.userId} href={`/profile?userId=${encodeURIComponent(s.userId)}`} className="py-2 text-sm flex justify-between items-center hover:bg-gray-50 px-2 rounded">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${activeToday ? 'bg-emerald-500' : 'bg-gray-300'}`} title={activeToday ? 'Active today' : 'Inactive'} />
                      <div>
                        <div className="font-medium">{s.name || s.userId}</div>
                        <div className="text-gray-500">Grade {s.grade}</div>
                      </div>
                    </div>
                    <div className="text-gray-500">{s.studentId}</div>
                  </a>
                );
              })
            )}
          </div>
          <div className="mt-3 flex gap-2">
            <button onClick={() => exportCSV(leaderboard)} className="px-3 py-2 rounded bg-gray-900 text-white">Export CSV</button>
            <button onClick={downloadContentPack} className="px-3 py-2 rounded bg-indigo-600 text-white">Download Content Pack</button>
            <button onClick={assignMission} className="px-3 py-2 rounded bg-amber-600 text-white">Assign Mission</button>
          </div>
        </div>

        <div className="rounded-xl border p-4">
          <h4 className="font-semibold mb-3">Leaderboard</h4>
          <div className="grid grid-cols-5 text-xs font-medium text-gray-500 mb-2">
            <div className="col-span-2">Student</div>
            <div>XP</div>
            <div>Level</div>
            <div>Streak</div>
          </div>
          <div className="divide-y">
            {leaderboard.length === 0 ? (
              <div className="text-gray-500 text-sm">No progress yet.</div>
            ) : (
              leaderboard.map((r, idx) => (
                <div key={r.user.userId} className="py-2 grid grid-cols-5 text-sm items-center">
                  <div className="col-span-2">
                    <span className="mr-2 text-gray-400">{idx + 1}.</span>
                    {r.user.name || r.user.userId}
                  </div>
                  <div>{r.totalXP}</div>
                  <div>{r.level}</div>
                  <div>{r.streak}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Top Struggles */}
      <div className="rounded-xl border p-4 mt-6">
        <h4 className="font-semibold mb-3">Top 3 Struggles</h4>
        <TopStruggles sessionsByUser={sessionsByUser} topics={topics.map(t => t.id)} />
      </div>
    </section>
  );
}

function cellStatusFromSessions(arr: LearningSession[]): 'mastered' | 'partial' | 'needs_support' | 'none' {
  if (!arr || arr.length === 0) return 'none';
  const completed = arr.filter(a => a.completionStatus === 'completed');
  const acc = completed.length > 0 ? (completed.reduce((s, a) => s + (a.accuracy || 0), 0) / completed.length) : 0;
  if (acc >= 0.8) return 'mastered';
  if (acc >= 0.5) return 'partial';
  return 'needs_support';
}

function HeatCell({ sessions }: { sessions: LearningSession[] }) {
  const status = cellStatusFromSessions(sessions);
  const color = status === 'mastered' ? 'bg-emerald-500' : status === 'partial' ? 'bg-yellow-400' : status === 'needs_support' ? 'bg-rose-500' : 'bg-gray-200';
  const label = status === 'mastered' ? 'Mastered' : status === 'partial' ? 'Partial' : status === 'needs_support' ? 'Needs support' : 'Not started';
  return <div className={`w-5 h-5 rounded ${color}`} title={label} />;
}

function exportCSV(rows: Array<{ user: User; totalXP: number; level: number; streak: number }>) {
  const header = 'Name,UserID,Grade,XP,Level,Streak\n';
  const body = rows.map(r => `${escapeCSV(r.user.name || '')},${escapeCSV(r.user.userId)},${escapeCSV(r.user.grade)},${r.totalXP},${r.level},${r.streak}`).join('\n');
  downloadText('class_report.csv', header + body);
}

function escapeCSV(s: string) {
  if (s.includes(',') || s.includes('"') || s.includes('\n')) {
    return '"' + s.replace(/"/g, '""') + '"';
  }
  return s;
}

async function downloadContentPack() {
  // Download grade 6 math topics as example content pack
  let ok = 0;
  for (const t of grade6MathTopics) {
    const success = await OfflineManager.cacheContent(t.id, 'topic', t);
    if (success) ok++;
  }
  alert(`Cached ${ok} topics for offline use`);
}

async function assignMission() {
  // Simple queued assignment for class; enhance later with real assignment payload
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore access static method
  await OfflineManager.addToSyncQueue('create', 'assignment', 'class', { createdAt: new Date().toISOString() });
  alert('Mission assigned (queued for sync)');
}

async function assignRemedial(topicId: string) {
  // Queue remedial assignment per-topic
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore access static method
  await OfflineManager.addToSyncQueue('create', 'remedial', topicId, { topicId, createdAt: new Date().toISOString() });
  alert(`Remedial assigned for ${topicId} (queued)`);
}

function downloadText(filename: string, text: string) {
  const blob = new Blob([text], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function TopStruggles({ sessionsByUser, topics }: { sessionsByUser: Record<string, LearningSession[]>; topics: string[] }) {
  const stats = topics.map(tid => {
    const arr: LearningSession[] = [];
    Object.values(sessionsByUser).forEach(list => arr.push(...list.filter(s => s.topicId === tid)));
    const completed = arr.filter(a => a.completionStatus === 'completed');
    const acc = completed.length > 0 ? (completed.reduce((s, a) => s + (a.accuracy || 0), 0) / completed.length) : 0;
    return { topicId: tid, accuracy: acc, attempts: arr.length };
  });
  stats.sort((a, b) => a.accuracy - b.accuracy);
  const top3 = stats.slice(0, 3);
  return (
    <div className="space-y-2">
      {top3.map((s, idx) => (
        <div key={s.topicId} className="flex items-center justify-between border rounded p-2">
          <div className="text-sm">{idx + 1}. {s.topicId}</div>
          <div className="text-xs text-gray-600">Accuracy: {(s.accuracy * 100).toFixed(0)}%</div>
          <button onClick={() => assignRemedial(s.topicId)} className="text-xs px-2 py-1 rounded bg-amber-600 text-white">Assign remedial</button>
        </div>
      ))}
      {top3.length === 0 && <div className="text-sm text-gray-500">Not enough data yet.</div>}
    </div>
  );
}

