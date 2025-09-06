"use client";

import { useSession } from "@/hooks/useSession";
import Link from "next/link";

export default function ProfilePage() {
  const { user, clear } = useSession();

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Profile</h1>
      {!user ? (
        <div className="p-6 rounded-xl border bg-white">
          <p className="text-gray-600">No user is logged in. Please register or login from the homepage.</p>
          <Link href="/" className="mt-4 inline-block text-blue-600 hover:underline">Go Home</Link>
        </div>
      ) : (
        <div className="p-6 rounded-xl border bg-white space-y-2">
          <div><span className="font-medium">Name:</span> {user.name}</div>
          <div><span className="font-medium">Role:</span> {user.role}</div>
          <div><span className="font-medium">User ID:</span> {user.userId}</div>
          <div><span className="font-medium">Grade:</span> {user.grade}</div>
          {user.schoolId && <div><span className="font-medium">School ID:</span> {user.schoolId}</div>}
          {user.schoolNameOrId && <div><span className="font-medium">School Name/ID:</span> {user.schoolNameOrId}</div>}
          {user.studentId && <div><span className="font-medium">Student ID:</span> {user.studentId}</div>}
          {user.subject && <div><span className="font-medium">Subject:</span> {user.subject}</div>}

          <div className="pt-4">
            <button onClick={clear} className="px-4 py-2 rounded bg-gray-900 text-white">Logout</button>
          </div>
        </div>
      )}
    </div>
  );
}

