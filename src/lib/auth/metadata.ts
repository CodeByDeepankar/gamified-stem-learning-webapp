export type ClerkPrivateMetadata = {
  role?: 'student' | 'teacher';
  school_id?: string;
  class_id?: string;
  grade?: string;
  language?: 'en' | 'or';
};

export type ClerkPublicMetadata = {
  role?: 'student' | 'teacher';
  // UI-friendly optional fields
  school_id?: string;
  schoolId?: string;
  class_id?: string;
  classId?: string;
  language?: 'en' | 'or';
  grade?: string;
  subject?: string;
  subjects?: string;
};

export function getRoleFromClerkUser(user: unknown): 'student' | 'teacher' | undefined {
  try {
    if (!user || typeof user !== 'object') return undefined;
    const u = user as Record<string, unknown>;
    const privateMeta = (u['privateMetadata'] ?? {}) as ClerkPrivateMetadata;
    if (privateMeta && privateMeta.role) return privateMeta.role;
    const publicMeta = (u['publicMetadata'] ?? {}) as ClerkPublicMetadata;
    if (publicMeta && publicMeta.role) return publicMeta.role;
  } catch {
    // ignore
  }
  return undefined;
}

