"use client";

import Link from "next/link";
import { useSession } from "@/hooks/useSession";
import { useMemo } from "react";
import { grade6MathTopics } from "@/data/content/grade6-mathematics";

export default function Dashboard() {
  const { user } = useSession();
  const grade = user?.grade ?? "";
  const name = user?.name ?? "Learner";

  const recommended = useMemo(() => {
    if (grade === "6") {
      return grade6MathTopics.slice(0, 2).map((t) => ({
        id: t.id,
        title: t.title,
        subject: t.subject,
        href: `/subjects/mathematics?topic=${t.id}`,
      }));
    }
    return [] as { id: string; title: string; subject: string; href: string }[];
  }, [grade]);

  return (
    <section className="mb-16">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Welcome, {name} 👋</h3>
            <p className="text-gray-600">Grade {grade || "-"} • Personalized dashboard</p>
          </div>
          <Link href="/profile" className="text-blue-600 hover:underline">View profile</Link>
        </div>

        <div className="mt-6">
          <div className="mb-2 text-sm text-gray-600">XP Progress</div>
          {/* Placeholder XP bar visually; XPProgressBar likely requires props - render a simple placeholder if unavailable */}
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-blue-600 w-1/4" />
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <MenuCard href={`/quiz?grade=${grade}`} title="Take Quiz" icon="📝" color="from-blue-500 to-indigo-500" />
          <MenuCard href={`/notes?grade=${grade}`} title="Notes" icon="📒" color="from-amber-500 to-orange-500" />
          <MenuCard href={`/games?grade=${grade}`} title="Games" icon="🎮" color="from-emerald-500 to-teal-500" />
          <MenuCard href={`/daily-challenge?grade=${grade}`} title="Daily Challenge" icon="🔥" color="from-rose-500 to-pink-500" />
          <MenuCard href={`/subjects`} title="Continue Learning" icon="📚" color="from-purple-500 to-fuchsia-500" />
          <MenuCard href={`/achievements`} title="Achievements" icon="🏆" color="from-sky-500 to-cyan-500" />
        </div>

        <div className="mt-10">
          <h4 className="text-lg font-semibold mb-3">Recommended for Grade {grade || "-"}</h4>
          {recommended.length === 0 ? (
            <div className="text-gray-500 text-sm">More recommendations coming soon for your grade.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recommended.map((rec) => (
                <Link key={rec.id} href={rec.href} className="block p-4 rounded-xl border hover:shadow transition">
                  <div className="text-xs uppercase text-gray-500">{rec.subject}</div>
                  <div className="font-medium">{rec.title}</div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function MenuCard({ href, title, icon, color }: { href: string; title: string; icon: string; color: string }) {
  return (
    <Link href={href} className="group block">
      <div className={`rounded-xl p-4 bg-gradient-to-br ${color} text-white shadow-lg hover:shadow-xl transition transform group-hover:-translate-y-0.5`}>
        <div className="text-2xl">{icon}</div>
        <div className="mt-2 text-sm font-semibold">{title}</div>
      </div>
    </Link>
  );
}

