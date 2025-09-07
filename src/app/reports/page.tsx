import { redirect } from "next/navigation";
import ReportsClient from "@/components/reports/ReportsClient";
import { currentUser } from "@clerk/nextjs/server";
import { getRoleFromClerkUser } from '@/lib/auth/metadata';

export default async function ReportsPage() {
  const user = await currentUser();
  const role = getRoleFromClerkUser(user);
  if (role !== 'teacher') redirect('/unauthorized');
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ReportsClient />
    </div>
  );
}
