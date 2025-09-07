"use client";
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import { useEffect } from 'react';

interface Props { children: React.ReactNode; initialLang?: string }

export default function I18nProvider({ children, initialLang }: Props) {
  // Pre-sync language without casting to any: use internal set (safe fallback)
  if (initialLang && i18n.language !== initialLang) {
    // i18next exposes changeLanguage which is async; for initial hydration we optimistically set
    // the resolvedLanguage property if available to avoid flicker.
    try {
      // Shallow mutate private property to sync before first paint; falls back to changeLanguage if it fails.
      (i18n as unknown as { resolvedLanguage?: string }).resolvedLanguage = initialLang;
    } catch {
      void i18n.changeLanguage(initialLang);
    }
  }
  useEffect(() => {
    if (initialLang && i18n.language !== initialLang) {
      i18n.changeLanguage(initialLang).catch(() => {});
    }
  }, [initialLang]);
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
