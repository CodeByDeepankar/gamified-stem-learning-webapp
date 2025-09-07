"use client";

import { useOffline } from "@/hooks/useOffline";
import { useTranslation } from "react-i18next";
import i18n from '@/lib/i18n';
import Link from "next/link";
import { Wifi, WifiOff, Languages } from "lucide-react";

function LangToggleSmall() {
  const { i18n: i18next } = useTranslation();
  const lang = i18next.language || "en";
  const next = lang.startsWith("or") ? "en" : "or";
  const label = next === "en" ? "EN" : "ଓଡ଼ିଆ";
  return (
    <button
      type="button"
  onClick={() => { 
        i18n.changeLanguage(next); 
        try { 
          localStorage.setItem('lang', next); 
          document.cookie = `lang=${next}; path=/; max-age=31536000; samesite=lax`;
        } catch {} 
      }}
      className="inline-flex items-center gap-1 px-2 py-1 rounded border text-xs text-gray-700 hover:bg-gray-50"
      aria-label="Toggle language"
    >
      <Languages className="w-3.5 h-3.5" /> {label}
    </button>
  );
}

export default function Footer() {
  const { t } = useTranslation("common");
  const { status } = useOffline();

  const OnlineIcon = status.isOnline ? Wifi : WifiOff;
  const onlineLabel = status.isOnline
    ? t("footer.online", "Synced")
    : t("footer.offline", "Offline");

  return (
    <footer className="border-t bg-white dark:bg-gray-900/80 border-gray-200 dark:border-gray-700 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-12 flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
        <div className="inline-flex items-center gap-1.5">
          <OnlineIcon className={`w-4 h-4 ${status.isOnline ? "text-emerald-500" : "text-gray-400 dark:text-gray-500"}`} />
          <span>
            {onlineLabel}
            {status.pendingSyncCount > 0 ? ` • ${status.pendingSyncCount} pending` : ""}
          </span>
        </div>
        <div className="inline-flex items-center gap-3">
          <Link href="#" className="hover:text-gray-900 dark:hover:text-gray-200">
            {t("footer.help", "Help / About")}
          </Link>
          <LangToggleSmall />
        </div>
      </div>
    </footer>
  );
}
