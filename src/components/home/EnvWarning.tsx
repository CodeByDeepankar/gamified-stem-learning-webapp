"use client";
import React, { useEffect, useState } from 'react';

// Only include client-exposed env vars (NEXT_PUBLIC_*) here; server-only vars
// like CLERK_SECRET_KEY / DATABASE_URL cannot be reliably or safely checked
// from the browser. Their absence would surface build / runtime errors server-side.
const REQUIRED_PUBLIC_VARS = [
  'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
  'NEXT_PUBLIC_API_URL',
];

export default function EnvWarning() {
  const [missing, setMissing] = useState<string[] | null>(null);

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;
    // Only expose variable names, never their values. Client only sees NEXT_PUBLIC_* values directly.
  const names = REQUIRED_PUBLIC_VARS.filter((k) => !(process.env as Record<string, string | undefined>)[k]);
    setMissing(names.length ? names : []);
  }, []);

  if (missing === null || missing.length === 0) return null;
  return (
    <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded mb-6 text-sm">
      <strong className="block mb-1">Missing environment variables (public):</strong>
      <ul className="list-disc ml-6">
        {missing.map((key) => (
          <li key={key}>{key}</li>
        ))}
      </ul>
      <div className="mt-2 text-xs">Add each as NEXT_PUBLIC_*=... in <code>.env.local</code> then restart dev server.</div>
    </div>
  );
}
