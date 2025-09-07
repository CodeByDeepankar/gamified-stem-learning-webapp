import { auth, clerkClient as _clerkClient } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { userId } = auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // Verify role from privateMetadata for security
  try {
  const clerkClient = _clerkClient();
  const user = await clerkClient.users.getUser(userId);
    const privateRole = (user.privateMetadata as Record<string, unknown> | undefined)?.role as string | undefined;
    if (privateRole !== 'teacher') {
      return NextResponse.json({ error: 'Forbidden: teacher role required' }, { status: 403 });
    }
  } catch {
    return NextResponse.json({ error: 'Failed to verify user' }, { status: 500 });
  }

  const body = await req.json().catch(() => null);
  if (!body || !body.title || !body.grade || !body.schoolId) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  // Minimal validation
  const id = crypto.randomUUID();

  // TODO: Persist to real DB. For now, return the created id and echo the payload.
  const quiz = {
    id,
    title: String(body.title),
    description: body.description ?? '',
    grade: String(body.grade),
    subject: body.subject ?? '',
    schoolId: String(body.schoolId),
    createdBy: userId,
    createdAt: new Date().toISOString(),
  };

  return NextResponse.json({ ok: true, quiz }, { status: 201 });
}
