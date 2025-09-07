"use client";

import React from "react";
import Link from "next/link";
import { SignInButton } from "@clerk/nextjs";

export default function AuthSection() {
  return (
    <section className="mb-16">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden p-6">
          <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4">Sign in or create an account</h3>

          <p className="text-sm text-gray-600 mb-4">Students and teachers sign up with email/password. Teachers may also use Google or Microsoft sign-in if enabled in Clerk.</p>

          <div className="flex gap-3">
            <SignInButton>
              <button className="px-4 py-2 rounded bg-blue-600 text-white">Sign in</button>
            </SignInButton>

            {/* Role-specific sign-up: pass role via query param to onboarding flow */}
            <Link href="/sign-up?role=student" className="px-4 py-2 rounded border">Sign up (Student)</Link>

            <Link href="/sign-up?role=teacher" className="px-4 py-2 rounded border">Sign up (Teacher)</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

