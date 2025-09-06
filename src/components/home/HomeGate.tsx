"use client";

import { useSession } from "@/hooks/useSession";
import StudentDashboard from "@/components/home/StudentDashboard";
import TeacherDashboard from "@/components/home/TeacherDashboard";
import AuthSection from "@/components/auth/AuthSection";

export default function HomeGate() {
  const { user } = useSession();
  if (user) {
    return user.role === 'teacher' ? <TeacherDashboard /> : <StudentDashboard />;
  }
  return <AuthSection />;
}

