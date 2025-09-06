export type SessionUser = {
  userId: string;
  role?: 'student' | 'teacher';
  name: string;
  grade: string;
  schoolId?: string;
  schoolNameOrId?: string;
  studentId?: string;
  subject?: string;
  preferredLanguage?: 'en' | 'or';
};

const KEY = 'currentUser';

export function setCurrentUser(user: SessionUser) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(KEY, JSON.stringify(user));
  window.dispatchEvent(new StorageEvent('storage', { key: KEY, newValue: JSON.stringify(user) }));
}

export function getCurrentUser(): SessionUser | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SessionUser;
  } catch (_) {
    return null;
  }
}

export function clearCurrentUser() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(KEY);
  window.dispatchEvent(new StorageEvent('storage', { key: KEY, newValue: null }));
}

