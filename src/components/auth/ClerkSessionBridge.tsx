"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { setCurrentUser, SessionUser } from "@/lib/session/session";
import { OfflineManager } from "@/lib/db/database";
import type { ClerkPublicMetadata } from "@/lib/auth/metadata";

export default function ClerkSessionBridge() {
  const { isSignedIn, user } = useUser();

  useEffect(() => {
    async function sync() {
      if (!isSignedIn || !user) return;
      const meta = (user.publicMetadata || {}) as Partial<ClerkPublicMetadata>;
      const role = meta.role;
      const schoolId = meta.school_id ?? meta.schoolId;
      const language = meta.language;
      const grade = meta.grade ?? "";

      const local: SessionUser = {
        userId: user.id,
        role,
        name: user.fullName || user.username || user.primaryEmailAddress?.emailAddress || "",
        grade,
        schoolId,
        schoolNameOrId: schoolId,
        studentId: user.id,
        subject: meta.subject,
        preferredLanguage: language === 'or' ? 'or' : 'en',
      };

      setCurrentUser(local);

      // Mirror to local offline DB for analytics
      try {
        if (role === 'student') {
          await OfflineManager.registerStudent({
            schoolIdOrName: schoolId || "",
            grade: grade || "",
            name: local.name,
            studentId: user.id,
            preferredLanguage: local.preferredLanguage || 'en',
          });
        } else if (role === 'teacher') {
          await OfflineManager.registerTeacher({
            schoolId: schoolId || "",
            grade: grade || "",
            subject: meta.subject || meta.subjects || "",
            userId: user.id,
            name: local.name,
            preferredLanguage: local.preferredLanguage || 'en',
          });
        }
      } catch {
        // ignore
      }
    }
    void sync();
  }, [isSignedIn, user]);

  return null;
}

