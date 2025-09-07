"use client";

import { SignUp } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";

export default function Page() {
  const search = useSearchParams();
  const role = search?.get('role');
  const after = role ? `/onboarding?role=${encodeURIComponent(role)}` : '/onboarding';

  return (
    <div className="max-w-md mx-auto py-12">
      <SignUp afterSignUpUrl={after} />
    </div>
  );
}

