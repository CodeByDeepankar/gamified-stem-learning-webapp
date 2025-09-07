"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "next-i18next";

// Type for non-standard event
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

function isStandaloneDisplayMode(): boolean {
  if (typeof window === "undefined") return false;
  // PWA installed on iOS Safari
interface CustomNavigator extends Navigator {
  standalone?: boolean;
}
  const isiOSStandalone = (window.navigator as CustomNavigator)?.standalone === true;
  // Standard display-mode check
  const isStandalone = window.matchMedia?.("(display-mode: standalone)").matches ?? false;
  return isiOSStandalone || isStandalone;
}

function isIosSafari(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent || navigator.vendor;
  return /iPad|iPhone|iPod/.test(ua) && /Safari/.test(ua) && !/CriOS|FxiOS/.test(ua);
}

const DISMISS_KEY = "pwa-install-dismissed-until";
const DISMISS_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export default function InstallPrompt() {
  const { t } = useTranslation("common");
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [iosHint, setIosHint] = useState(false);
  const shownOnceRef = useRef(false);

  const canShow = useMemo(() => {
    if (typeof window === "undefined") return false;
    if (isStandaloneDisplayMode()) return false; // already installed
    const until = Number(localStorage.getItem(DISMISS_KEY) || 0);
    if (until && Date.now() < until) return false; // snoozed
    return true;
  }, []);

  // Listen for the install prompt on supported browsers
  useEffect(() => {
    if (!canShow) return;

    const onBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
      // Avoid flashing multiple times if route changes
      if (!shownOnceRef.current) {
        setVisible(true);
        shownOnceRef.current = true;
      }
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt as EventListener);

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt as EventListener);
    };
  }, [canShow]);

  // iOS Safari does not fire beforeinstallprompt; show hint banner
  useEffect(() => {
    if (!canShow) return;
    if (deferred) return; // Chrome path will handle
    if (isIosSafari()) {
      const timer = setTimeout(() => setIosHint(true), 1200);
      return () => clearTimeout(timer);
    }
  }, [canShow, deferred]);

  const hideForAWhile = useCallback(() => {
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now() + DISMISS_MS));
    } catch {}
    setVisible(false);
    setIosHint(false);
  }, []);

  const onInstall = useCallback(async () => {
    if (!deferred) return;
    try {
      await deferred.prompt();
      const choice = await deferred.userChoice;
      if (choice.outcome === "accepted") {
        setVisible(false);
      } else {
        hideForAWhile();
      }
    } catch {
      // If prompt fails, just snooze
      hideForAWhile();
    } finally {
      setDeferred(null);
    }
  }, [deferred, hideForAWhile]);

  if (!visible && !iosHint) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 px-4 pb-4 sm:pb-6 pointer-events-none">
      <div className="max-w-xl mx-auto pointer-events-auto">
        <div className="rounded-2xl border border-gray-200 bg-white shadow-xl p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <div className="text-2xl">📲</div>
            <div className="flex-1">
              <div className="font-semibold text-gray-900 text-sm sm:text-base">
                {iosHint
                  ? t("pwa.installIosTitle", "Add to Home Screen")
                  : t("pwa.installTitle", "Install the app for offline access")}
              </div>
              <div className="text-xs sm:text-sm text-gray-600 mt-1">
                {iosHint
                  ? t(
                      "pwa.installIosHint",
                      "Tap the Share button and choose \"Add to Home Screen\" to install."
                    )
                  : t(
                      "pwa.installDescription",
                      "Install this app for a faster, full-screen offline experience."
                    )}
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 justify-end">
            <button
              type="button"
              onClick={hideForAWhile}
              className="px-3 py-1.5 rounded-lg text-sm text-gray-700 hover:bg-gray-100 border"
            >
              {t("actions.cancel", "Cancel")}
            </button>
            {!iosHint && (
              <button
                type="button"
                onClick={onInstall}
                className="px-3 py-1.5 rounded-lg text-sm bg-blue-600 text-white hover:bg-blue-700 shadow"
              >
                {t("pwa.installButton", "Install")}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
