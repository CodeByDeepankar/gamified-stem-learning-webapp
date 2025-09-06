"use client";

import { useEffect, useState } from "react";
import { clearCurrentUser, getCurrentUser, setCurrentUser, SessionUser } from "@/lib/session/session";

export function useSession() {
  const [user, setUser] = useState<SessionUser | null>(null);

  useEffect(() => {
    setUser(getCurrentUser());
    const handler = () => setUser(getCurrentUser());
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  return {
    user,
    setUser: (u: SessionUser) => setCurrentUser(u),
    clear: () => clearCurrentUser(),
    isLoggedIn: !!user,
  };
}

