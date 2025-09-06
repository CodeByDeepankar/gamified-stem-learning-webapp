"use client";
import { useOffline } from "@/hooks/useOffline";

export default function GlobalOfflineManager() {
  // Initialize and keep offline sync running via effects
  const { status } = useOffline();
  // Optionally could show a tiny status badge; keep hidden for now
  return (
    <div aria-hidden className="hidden" data-online={status.isOnline} />
  );
}

