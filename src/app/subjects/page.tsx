export default function SubjectsPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Subjects</h1>
      <p className="text-gray-600 mb-8">Choose a subject to explore learning paths and topics.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { href: "/subjects/science", title: "Science", icon: "🔬" },
          { href: "/subjects/technology", title: "Technology", icon: "💻" },
          { href: "/subjects/engineering", title: "Engineering", icon: "⚙️" },
          { href: "/subjects/mathematics", title: "Mathematics", icon: "📐" },
        ].map((s) => (
          <a key={s.href} href={s.href} className="p-6 rounded-xl border hover:shadow transition bg-white">
            <div className="text-3xl mb-2">{s.icon}</div>
            <div className="font-semibold">{s.title}</div>
          </a>
        ))}
      </div>
    </div>
  );
}

