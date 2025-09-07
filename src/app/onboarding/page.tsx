"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { setCurrentUser } from "@/lib/session/session";
import { OfflineManager, db } from "@/lib/db/database";
import { useUser } from "@clerk/nextjs";

export default function OnboardingPage() {
  const { user } = useUser();
  const router = useRouter();
  const search = useSearchParams();
  const [role, setRole] = useState<'student' | 'teacher'>(() => {
    if (typeof window !== 'undefined') {
      const fromLocal = localStorage.getItem('preferredRole');
      if (fromLocal === 'teacher' || fromLocal === 'student') return fromLocal;
    }
    return 'student';
  });
  const [form, setForm] = useState({
    name: "",
    grade: "",
    school_id: "",
    class_id: "",
    language: "en",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [schools, setSchools] = useState<string[]>([]);

  const update = (k: string, v: string) => setForm(s => ({ ...s, [k]: v }));

  // Initialize role from URL if present and collect cached schools for offline dropdown
  useEffect(() => {
    const r = search?.get('role');
    if (r === 'student' || r === 'teacher') setRole(r);
    (async () => {
      try {
        if (typeof window !== 'undefined') {
          const users = await db?.users.toArray();
          const set = new Set<string>();
          for (const u of users ?? []) {
            if (u.schoolId) set.add(u.schoolId);
            if (u.schoolNameOrId) set.add(u.schoolNameOrId);
          }
          setSchools(Array.from(set).filter(Boolean));
        }

        // If the user arrived here from the signup redirect with a role query and their
        // Clerk privateMetadata.role is not yet set, call the secure endpoint to set it now.
        const r2 = search?.get('role');
        if (user && (r2 === 'student' || r2 === 'teacher')) {
          // Best-effort: call server to set privateMetadata (idempotent)
          try {
            await fetch('/api/complete-signup', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ role: r2 }),
            }).catch(() => null);
          } catch {
            // ignore; onboarding will still work
          }
        }
      } catch {
        // ignore
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role, ...form }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || 'Failed to save onboarding');
      }

      // Mirror to local offline DB & session
      if (user) {
        const name = form.name || user.fullName || user.username || '';
        if (role === 'student') {
          await OfflineManager.registerStudent({
            schoolIdOrName: form.school_id,
            grade: form.grade,
            name,
            studentId: user.id,
            preferredLanguage: (form.language === 'or' ? 'or' : 'en') as 'en' | 'or',
          });
          setCurrentUser({ userId: user.id, role: 'student', name, grade: form.grade, schoolId: form.school_id, schoolNameOrId: form.school_id, studentId: user.id, preferredLanguage: form.language === 'or' ? 'or' : 'en' });
          router.replace('/student-dashboard');
        } else {
          await OfflineManager.registerTeacher({
            schoolId: form.school_id,
            grade: form.grade,
            userId: user.id,
            name,
            preferredLanguage: (form.language === 'or' ? 'or' : 'en') as 'en' | 'or',
          });
          setCurrentUser({ userId: user.id, role: 'teacher', name, grade: form.grade, schoolId: form.school_id, schoolNameOrId: form.school_id, studentId: user.id, preferredLanguage: form.language === 'or' ? 'or' : 'en' });
          router.replace('/teacher-dashboard');
        }
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Complete your profile</h1>
      <form onSubmit={onSubmit} className="space-y-4 bg-white rounded-2xl border p-6">
        <div className="flex gap-4">
          <label className="inline-flex items-center gap-2">
            <input type="radio" name="role" checked={role==='student'} onChange={() => setRole('student')} /> Student
          </label>
          <label className="inline-flex items-center gap-2">
            <input type="radio" name="role" checked={role==='teacher'} onChange={() => setRole('teacher')} /> Teacher
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Name</label>
            <input required className="w-full border rounded px-3 py-2" value={form.name} onChange={e=>update('name', e.target.value)} />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">School ID</label>
            <input list="schools-list" required className="w-full border rounded px-3 py-2" value={form.school_id} onChange={e=>update('school_id', e.target.value)} />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Class ID</label>
            <input required className="w-full border rounded px-3 py-2" value={form.class_id} onChange={e=>update('class_id', e.target.value)} />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Grade</label>
            <input required className="w-full border rounded px-3 py-2" value={form.grade} onChange={e=>update('grade', e.target.value)} />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Language</label>
            <select className="w-full border rounded px-3 py-2" value={form.language} onChange={e=>update('language', e.target.value)}>
              <option value="en">English</option>
              <option value="or">Odia</option>
            </select>
          </div>

          {/* Cached schools dropdown for offline-first selection */}
          <datalist id="schools-list">
            {schools.map((s) => (
              <option key={s} value={s} />
            ))}
          </datalist>
        </div>

        {error && <div className="text-sm text-rose-600">{error}</div>}
        <button type="submit" disabled={loading} className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50">
          {loading ? 'Saving...' : 'Continue'}
        </button>
      </form>
    </div>
  );
}

