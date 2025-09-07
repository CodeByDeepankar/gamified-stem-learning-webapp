import { auth, clerkClient as _clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { userId } = auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  if (!body || !body.role) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const role = body.role as "student" | "teacher";

  const privateMetadata: Record<string, unknown> = {
    role,
    school_id: body.school_id ?? "",
    class_id: body.class_id ?? "",
    grade: body.grade ?? "",
    language: body.language === "or" ? "or" : "en",
  };

  // Keep a minimal publicMetadata for UI purposes only
  const publicMetadata: Record<string, unknown> = {
    role: role === 'teacher' ? 'teacher' : 'student',
  };

  try {
  const clerkClient = _clerkClient();
  await clerkClient.users.updateUser(userId, { privateMetadata });
  await clerkClient.users.updateUser(userId, { publicMetadata });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Failed to update user";
    return NextResponse.json({ error: message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

