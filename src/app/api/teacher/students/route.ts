import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Sample route: Teachers can fetch students limited by school_id/class scope
export async function GET() {
  const { userId, sessionClaims } = auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const metadata = (sessionClaims?.metadata || {}) as Record<string, unknown>;
  const role = metadata?.role;
  const schoolId = metadata?.school_id || metadata?.schoolId;
  const classId = metadata?.class_id || metadata?.classId;

  if (role !== 'teacher') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // NOTE: Hook into your server database layer here (Postgres/Firestore/SQLite)
  // Return empty payload as placeholder; client uses offline IndexedDB for now.
  return NextResponse.json({ students: [], scope: { schoolId, classId } });
}

