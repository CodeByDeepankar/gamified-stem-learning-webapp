import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { getRoleFromClerkUser } from '@/lib/auth/metadata';

export default async function TeacherQuizzesPage() {
  const user = await currentUser();
    const role = getRoleFromClerkUser(user);
    if (role !== 'teacher') {
    if (role === "student") redirect('/student-dashboard');
    redirect('/sign-in');
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-4">Manage Quizzes</h1>
      <div className="bg-white rounded-lg border p-6">
        <p className="text-sm text-gray-600">This is a placeholder for the teacher quizzes management UI.</p>
        <p className="text-xs text-gray-400 mt-2">Create, edit and publish quizzes for your students here.</p>
      </div>
    </div>
  );
}
