"use client";
import { usePWAInstallPrompt } from '@/hooks/usePWAInstallPrompt';

export default function InstallCTAHome(){
  const { canInstall, promptInstall, installed } = usePWAInstallPrompt();
  if (installed || !canInstall) return null;
  return (
    <div className="relative overflow-hidden rounded-2xl border border-blue-200 dark:border-blue-700/40 bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-blue-900/30 dark:via-gray-900 dark:to-blue-900/20 p-6 mb-12 shadow-sm">
      <div className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.25),transparent_60%)]" />
      <div className="relative flex flex-col md:flex-row items-center gap-6">
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-1">Install STEM Learn</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 max-w-xl">Add the app to your device for a faster, fullscreen, offline-first learning experience.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={promptInstall} className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v12"/><path d="m8 11 4 4 4-4"/><rect x="4" y="17" width="16" height="4" rx="1"/></svg>
            Install
          </button>
          <a href="/offline.html" className="text-xs text-blue-700 dark:text-blue-400 underline hover:no-underline">Offline mode</a>
        </div>
      </div>
    </div>
  );
}
