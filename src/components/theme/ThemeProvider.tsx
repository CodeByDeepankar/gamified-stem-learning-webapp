"use client";
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';
interface ThemeContextValue {
  theme: Theme;
  toggle: () => void;
  setTheme: (t: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);
const STORAGE_KEY = 'theme';

export function ThemeProvider({ children, initialTheme }: { children: React.ReactNode; initialTheme?: Theme }) {
  // Internal helper first so all effects can use it without hoisting issues.
  const applyThemeClass = (t: Theme, animate: boolean) => {
    const root = document.documentElement;
    if (animate) {
      root.classList.add('theme-transition');
      window.setTimeout(() => root.classList.remove('theme-transition'), 350);
    }
    if (t === 'dark') root.classList.add('dark'); else root.classList.remove('dark');
    root.setAttribute('data-theme', t); // debug aid / CSS hook
  };
  const [theme, setThemeState] = useState<Theme>(initialTheme || 'light');

  // Mount: determine effective theme (precedence: localStorage > existing html class attribute > OS pref)
  useEffect(() => {
    try {
      const root = document.documentElement;
      let detected: Theme = root.classList.contains('dark') ? 'dark' : 'light';
      const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
      if (stored === 'dark' || stored === 'light') {
        detected = stored;
        if (stored === 'dark' && !root.classList.contains('dark')) applyThemeClass(stored, false);
        if (stored === 'light' && root.classList.contains('dark')) applyThemeClass(stored, false);
      } else {
        // No stored preference: keep whatever server/inline script decided (detected)
        applyThemeClass(detected, false);
      }
      setThemeState(detected);
    } catch {
      // ignore
    }
  }, []);

  const setTheme = useCallback((t: Theme) => {
    setThemeState(prev => {
      if (prev === t) return prev; // no-op
      applyThemeClass(t, true);
      try { localStorage.setItem(STORAGE_KEY, t); } catch {}
      try { document.cookie = `theme=${t}; path=/; max-age=31536000; samesite=lax`; } catch {}
      return t;
    });
  }, []);

  const toggle = useCallback(() => setTheme(theme === 'dark' ? 'light' : 'dark'), [theme, setTheme]);

  // Sync effect (covers programmatic external changes in future)
  useEffect(() => { applyThemeClass(theme, false); }, [theme]);

  return (
  <ThemeContext.Provider value={{ theme, toggle, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
