import { redirect } from "next/navigation";
import TeacherDashboard from "@/components/home/TeacherDashboard";
import { currentUser } from "@clerk/nextjs/server";
import { getRoleFromClerkUser } from "@/lib/auth/metadata";

export default async function TeacherDashboardPage() {
  const user = await currentUser();
  const role = getRoleFromClerkUser(user);
  if (role !== 'teacher') redirect('/unauthorized');
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <TeacherDashboard />
    </div>
  );
}
