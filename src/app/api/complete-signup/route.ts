import { auth, clerkClient as _clerkClient } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { userId } = auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json().catch(() => null);
  if (!body || !body.role) return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });

  const role = body.role as 'student' | 'teacher';

  try {
    // write to privateMetadata for security-sensitive role information
  const clerkClient = _clerkClient();
  await clerkClient.users.updateUser(userId, { privateMetadata: { role } });

  // also keep a minimal public flag for UI checks
  await clerkClient.users.updateUser(userId, { publicMetadata: { role: role === 'teacher' ? 'teacher' : 'student' } });

    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Failed to update user';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
