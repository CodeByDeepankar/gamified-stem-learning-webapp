"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import i18n from "@/lib/i18n";
import {
  LayoutDashboard,
  Users,
  FileBarChart,
  User,
  Languages,
  Wifi,
  WifiOff,
  Home,
  Target,
  BarChart2,
  Moon,
  Sun,
  Menu,
  X,
  type LucideIcon,
} from "lucide-react";
import { UserButton, useUser } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";

// Custom typing for the non-standard beforeinstallprompt event
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

function InstallPWAButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setVisible(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const install = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') setVisible(false);
  };

  // Only show on Chrome/Edge and if event fired
  if (!visible) return null;
  return (
    <button
      onClick={install}
      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md border text-xs font-medium border-blue-400 bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors shadow-sm"
      aria-label="Install app"
    >
      <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" d="M12 3v12m0 0l-4-4m4 4l4-4m-9 7h10"/></svg>
      Install App
    </button>
  );
}
import { useSession } from "@/hooks/useSession";
import { useOffline } from "@/hooks/useOffline";
import { useTheme } from "@/components/theme/ThemeProvider";

function LangToggle() {
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
          localStorage.setItem("lang", next);
          document.cookie = `lang=${next}; path=/; max-age=31536000; samesite=lax`;
        } catch {}
      }}
      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md border text-xs font-medium border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 bg-white/70 dark:bg-gray-800/60 backdrop-blur-sm shadow-sm hover:bg-white dark:hover:bg-gray-700 transition-colors"
      aria-label="Toggle language"
    >
      <Languages className="w-4 h-4" /> {label}
    </button>
  );
}

function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const nextTheme = theme === "dark" ? "light" : "dark";
  const Icon = theme === "dark" ? Sun : Moon;
  return (
    <button
      type="button"
      onClick={() => {
        toggle();
      }}
      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md border text-xs font-medium border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 bg-white/70 dark:bg-gray-800/60 backdrop-blur-sm shadow-sm hover:bg-white dark:hover:bg-gray-700 transition-colors"
      aria-label="Toggle theme"
    >
      <Icon className="w-4 h-4" />
      <span className="hidden sm:inline">
        {nextTheme === "dark" ? "Dark" : "Light"}
      </span>
    </button>
  );
}

function SyncIndicator() {
  const { status, syncData } = useOffline();
  const OnlineIcon = status.isOnline ? Wifi : WifiOff;
  return (
    <button
      type="button"
      onClick={() => syncData()}
      title={
        status.isOnline
          ? status.pendingSyncCount > 0
            ? `${status.pendingSyncCount} pending`
            : "Synced"
          : "Offline"
      }
      className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md border text-xs ${
        status.isOnline
          ? "text-emerald-700 hover:bg-emerald-50"
          : "text-gray-600 hover:bg-gray-50"
      }`}
      aria-label="Sync status"
    >
      <OnlineIcon
        className={`w-4 h-4 ${
          status.isOnline ? "text-emerald-600" : "text-gray-400"
        }`}
      />
      <span className="hidden sm:inline">
        {status.isOnline
          ? status.pendingSyncCount > 0
            ? `${status.pendingSyncCount} pending`
            : "Synced"
          : "Offline"}
      </span>
    </button>
  );
}

export default function NavBar() {
  const { t } = useTranslation("common");
  const pathname = usePathname();
  const { user } = useSession();
  const { user: clerkUser } = useUser();
  const [mobileOpen, setMobileOpen] = useState(false);
  const toggleMobile = () => setMobileOpen(o => !o);
  // Close menu when route changes
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const isTeacher = user?.role === "teacher";

  const NavItem = ({
    href,
    label,
    Icon,
  }: {
    href: string;
    label: string;
    Icon: LucideIcon;
  }) => {
    const active = pathname === href;
    return (
      <Link
        href={href}
        className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-md text-sm transition-colors font-medium ${
          active
            ? "bg-gray-100 dark:bg-gray-700/70 text-gray-900 dark:text-white shadow-sm"
            : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800/70"
        }`}
      >
        <Icon className="w-4 h-4" />
  <span className="hidden sm:inline" suppressHydrationWarning>{label}</span>
      </Link>
    );
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-gray-900/80 backdrop-blur border-b border-gray-200 dark:border-gray-700 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-green-500 rounded-lg grid place-items-center shadow-sm">
            <span className="text-white font-bold drop-shadow-sm">S</span>
          </div>
          <span className="font-semibold text-gray-900 dark:text-gray-100">
            STEM Learn
          </span>
        </Link>

  {/* Desktop navigation */}
  <nav className="hidden md:flex items-center gap-1 sm:gap-2">
          {isTeacher ? (
            <>
              <NavItem
                href="/"
                label={t("navigation.dashboard", "Dashboard")}
                Icon={LayoutDashboard}
              />
              <NavItem
                href="/class"
                label={t("navigation.class", "Class")}
                Icon={Users}
              />
              <NavItem
                href="/reports"
                label={t("navigation.reports", "Reports")}
                Icon={FileBarChart}
              />
              <NavItem
                href="/profile"
                label={t("navigation.profile", "Profile")}
                Icon={User}
              />
            </>
          ) : (
            <>
              <NavItem
                href="/"
                label={t("navigation.home", "Home")}
                Icon={Home}
              />
              <NavItem
                href="/daily-challenge"
                label={t("navigation.missions", "Missions")}
                Icon={Target}
              />
              <NavItem
                href="/achievements"
                label={t("navigation.progress", "Progress")}
                Icon={BarChart2}
              />
              <NavItem
                href="/profile"
                label={t("navigation.profile", "Profile")}
                Icon={User}
              />
            </>
          )}
          <SyncIndicator />
          <InstallPWAButton />
          <ThemeToggle />
          <LangToggle />
          <div className="hidden sm:inline-flex items-center gap-2">
            {clerkUser && (
              <Image
                src={clerkUser.imageUrl}
                alt={clerkUser.fullName || clerkUser.username || 'User'}
                width={32}
                height={32}
                className="rounded-full border border-gray-300 dark:border-gray-600 object-cover shadow-sm"
                referrerPolicy="no-referrer"
              />
            )}
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  userButtonTrigger:
                    "rounded-md border border-gray-300 dark:border-gray-600 bg-white/70 dark:bg-gray-800/60 hover:bg-white dark:hover:bg-gray-700 transition-colors shadow-sm",
                  userButtonPopoverCard:
                    "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xl",
                  userButtonPopoverActionButton:
                    "hover:bg-gray-100 dark:hover:bg-gray-700",
                },
              }}
            />
          </div>
        </nav>
        {/* Mobile controls */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            aria-label="Toggle navigation"
            aria-expanded={mobileOpen}
            onClick={toggleMobile}
            className="inline-flex items-center justify-center w-9 h-9 rounded-md border border-gray-300 dark:border-gray-600 bg-white/70 dark:bg-gray-800/60 text-gray-700 dark:text-gray-200 hover:bg-white dark:hover:bg-gray-700 transition-colors"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>
      {/* Mobile navigation panel */}
      <div className={`md:hidden overflow-hidden transition-[max-height] duration-300 ease-out bg-white/95 dark:bg-gray-900/95 backdrop-blur border-b border-gray-200 dark:border-gray-700 ${mobileOpen ? 'max-h-[520px]' : 'max-h-0'}`}>
        <div className="px-4 py-4 space-y-4">
          <div className="grid grid-cols-2 gap-2">
            {isTeacher ? (
              <>
                <MobileLink href="/" label={t('navigation.dashboard','Dashboard')} Icon={LayoutDashboard} />
                <MobileLink href="/class" label={t('navigation.class','Class')} Icon={Users} />
                <MobileLink href="/reports" label={t('navigation.reports','Reports')} Icon={FileBarChart} />
                <MobileLink href="/profile" label={t('navigation.profile','Profile')} Icon={User} />
              </>
            ) : (
              <>
                <MobileLink href="/" label={t('navigation.home','Home')} Icon={Home} />
                <MobileLink href="/daily-challenge" label={t('navigation.missions','Missions')} Icon={Target} />
                <MobileLink href="/achievements" label={t('navigation.progress','Progress')} Icon={BarChart2} />
                <MobileLink href="/profile" label={t('navigation.profile','Profile')} Icon={User} />
              </>
            )}
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <SyncIndicator />
            <LangToggle />
            <InstallPWAButton />
            <div className="inline-flex">
              <UserButton
                afterSignOutUrl="/"
                appearance={{ elements: { userButtonTrigger: 'rounded-full border border-gray-300 dark:border-gray-600 bg-white/80 dark:bg-gray-800/60' } }}
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

function MobileLink({ href, label, Icon }: { href: string; label: string; Icon: LucideIcon }) {
  const pathname = usePathname();
  const active = pathname === href;
  return (
    <Link
      href={href}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors border ${active ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-700' : 'bg-white/60 dark:bg-gray-800/60 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 border-gray-200 dark:border-gray-700'}`}
    >
      <Icon className="w-4 h-4" />
  <span suppressHydrationWarning>{label}</span>
    </Link>
  );
}
