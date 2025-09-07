"use client";

import { useRouter } from "next/navigation";
import { useOffline } from "@/hooks/useOffline";
import { useSession } from "@/hooks/useSession";
import { GraduationCap, Users } from "lucide-react";

export default function EntryRoleSelect() {
  const router = useRouter();
  const { status } = useOffline();
  const { user } = useSession();

  function handleSelect(role: "student" | "teacher") {
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem("preferredRole", role);
      }
    } catch {}

    if (status.isOnline) {
      const url = `/sign-in?redirect_url=/dashboard-redirect&role=${role}`;
      router.push(url);
      return;
    }

    // Offline: if we have a cached session, route to the appropriate dashboard
    if (user?.role) {
      router.push(user.role === "teacher" ? "/teacher-dashboard" : "/student-dashboard");
    }
  }

  const offlineHint = !status.isOnline;

  return (
    <section className="max-w-3xl mx-auto mb-10">
      {offlineHint && (
        <div className="mb-4 rounded-lg border bg-yellow-50 text-yellow-800 px-4 py-3 text-sm" role="status">
          You are offline. Sign-in requires internet. If you used this device before, you can continue using cached data.
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => handleSelect("student")}
          className="w-full rounded-xl border p-5 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-left transition"
          aria-label="I am a Student / ମୁଁ ଶିକ୍ଷାର୍ଥୀ"
          data-testid="select-student"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-600 text-white grid place-items-center">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="text-lg font-semibold text-gray-900">I am a Student</div>
              <div className="text-sm text-gray-600 font-odia">ମୁଁ ଶିକ୍ଷାର୍ଥୀ</div>
            </div>
          </div>
          <div className="mt-3 text-xs text-gray-500">Continue to sign in and start learning</div>
        </button>

        <button
          type="button"
          onClick={() => handleSelect("teacher")}
          className="w-full rounded-xl border p-5 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-left transition"
          aria-label="I am a Teacher / ମୁଁ ଶିକ୍ଷକ"
          data-testid="select-teacher"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-600 text-white grid place-items-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="text-lg font-semibold text-gray-900">I am a Teacher</div>
              <div className="text-sm text-gray-600 font-odia">ମୁଁ ଶିକ୍ଷକ</div>
            </div>
          </div>
          <div className="mt-3 text-xs text-gray-500">Continue to sign in and manage your class</div>
        </button>
      </div>

      {!status.isOnline && user?.role && (
        <div className="mt-4">
          <button
            type="button"
            onClick={() => handleSelect(user.role!)}
            className="w-full sm:w-auto inline-flex items-center gap-2 rounded-lg bg-gray-900 text-white px-4 py-2 text-sm"
          >
            Open cached {user.role === "teacher" ? "Teacher" : "Student"} Dashboard
          </button>
        </div>
      )}
    </section>
  );
}

