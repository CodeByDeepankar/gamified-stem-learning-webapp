"use client";

import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="max-w-md mx-auto py-12">
      <SignIn signUpUrl="/sign-up" afterSignInUrl="/dashboard-redirect" />
    </div>
  );
}

