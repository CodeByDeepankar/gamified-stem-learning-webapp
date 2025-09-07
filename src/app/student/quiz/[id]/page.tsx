import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { getRoleFromClerkUser } from "@/lib/auth/metadata";
import QuizRunner from "@/components/learning/QuizRunner";

export default async function Page() {
  const user = await currentUser();
  const role = getRoleFromClerkUser(user);
  if (role !== 'student') {
    if (role === 'teacher') redirect('/teacher-dashboard');
    redirect('/sign-in');
  }

  const grade = (user?.privateMetadata?.grade ?? user?.publicMetadata?.grade) ?? '6';

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold mb-4">Quiz</h1>
      {/* Use QuizRunner — it will fetch by grade; id param is ignored for mocked data */}
      <QuizRunner grade={String(grade)} />
    </div>
  );
}
