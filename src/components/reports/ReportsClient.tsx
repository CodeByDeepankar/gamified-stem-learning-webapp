"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/hooks/useSession";
import { OfflineManager } from "@/lib/db/database";

export default function ReportsClient() {
  const { user } = useSession();
  const [csvReady, setCsvReady] = useState(false);

  useEffect(() => {
    setCsvReady(true);
  }, []);

  async function exportMinimalCSV() {
    if (!user?.schoolId) return;
    const students = await OfflineManager.getStudentsBySchool(user.schoolId);
    const header = 'Name,UserID,Grade\n';
    const body = students.map(s => `${s.name || ''},${s.userId},${s.grade}`).join('\n');
    const blob = new Blob([header + body], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'students.csv'; a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <section className="bg-white rounded-2xl border shadow-card p-6">
      <h1 className="text-2xl font-bold mb-2">Reports</h1>
      <p className="text-gray-600 mb-4">Generate offline CSV exports. PDF export can be done via Print to PDF.</p>
      <div className="flex gap-2">
        <button disabled={!csvReady} onClick={exportMinimalCSV} className="px-3 py-2 rounded bg-gray-900 text-white disabled:opacity-50">Export Students CSV</button>
      </div>
    </section>
  );
}

