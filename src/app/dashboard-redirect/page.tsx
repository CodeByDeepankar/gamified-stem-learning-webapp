import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { getRoleFromClerkUser } from "@/lib/auth/metadata";

export default async function Page() {
  const user = await currentUser();
  const role = getRoleFromClerkUser(user ?? undefined);
  if (role === 'teacher') redirect('/teacher-dashboard');
  if (role === 'student') redirect('/student-dashboard');
  redirect("/onboarding");
}
