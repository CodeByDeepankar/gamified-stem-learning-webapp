
import Link from "next/link";
import HomeGate from "@/components/home/HomeGate";
import EnvWarning from "@/components/home/EnvWarning";
import InstallCTAHome from "@/components/pwa/InstallCTAHome";
// import EntryRoleSelect from "@/components/home/EntryRoleSelect";

interface SubjectCardProps {
  title: string;
  titleOdia: string;
  description: string;
  icon: string;
  color: string;
  href: string;
}

function SubjectCard({ title, titleOdia, description, icon, color, href }: SubjectCardProps) {
  return (
    <Link href={href} className="group">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group-hover:scale-105 border border-gray-100 dark:border-gray-700/60">
        <div className={`bg-gradient-to-r ${color} p-6 text-center relative text-gray-50 dark:text-white`}>
          <div className="text-4xl mb-2">{icon}</div>
          <h3 className="text-xl font-bold drop-shadow-sm">{title}</h3>
          <p className="text-white/80 text-sm font-medium font-odia">{titleOdia}</p>
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
        </div>
        <div className="p-6">
          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{description}</p>
        </div>
      </div>
    </Link>
  );
}

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="text-center bg-white/60 dark:bg-gray-800/60 rounded-xl p-6 backdrop-blur border border-gray-200/70 dark:border-gray-700/50 shadow-sm">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

interface StatCardProps {
  number: string;
  label: string;
  sublabel: string;
}

function StatCard({ number, label, sublabel }: StatCardProps) {
  return (
    <div className="text-center md:text-left">
      <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2 drop-shadow-sm">{number}</div>
      <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">{label}</div>
      <div className="text-sm text-gray-500 dark:text-gray-400">{sublabel}</div>
    </div>
  );
}


export default function Home() {
  return (
  <div className="min-h-screen soft-app-gradient transition-colors">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
  <EnvWarning />
  <InstallCTAHome />
        <div className="text-center mb-10">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 drop-shadow-sm">STEM Learn</h1>
      <p className="text-sm text-gray-600 dark:text-gray-300 font-odia">ଶିକ୍ଷାକୁ ଆନନ୍ଦମୟ କରନ୍ତୁ</p>
        </div>
        {/* <EntryRoleSelect /> */}
        <HomeGate />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <SubjectCard title="Science" titleOdia="ବିଜ୍ଞାନ" description="Explore the natural world through experiments and discovery" icon="🔬" color="from-purple-500 to-pink-500" href="/subjects/science" />
          <SubjectCard title="Technology" titleOdia="ପ୍ରଯୁକ୍ତି" description="Learn about computers, coding, and digital innovation" icon="💻" color="from-blue-500 to-cyan-500" href="/subjects/technology" />
          <SubjectCard title="Engineering" titleOdia="ଇଞ୍ଜିନିୟରିଂ" description="Design, build, and solve real-world problems" icon="⚙️" color="from-orange-500 to-red-500" href="/subjects/engineering" />
          <SubjectCard title="Mathematics" titleOdia="ଗଣିତ" description="Master numbers, patterns, and logical thinking" icon="📐" color="from-green-500 to-teal-500" href="/subjects/mathematics" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <FeatureCard icon="🎮" title="Gamified Learning" description="Earn XP, unlock badges, and compete with friends while learning" />
          <FeatureCard icon="📱" title="Offline Ready" description="Learn anywhere, anytime with our progressive web app technology" />
          <FeatureCard icon="🌐" title="Bilingual Support" description="Content available in English and Odia for better understanding" />
        </div>
  <div className="bg-white dark:bg-gray-900/70 rounded-2xl shadow-xl p-8 text-center border border-gray-100 dark:border-gray-700/60 backdrop-blur">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <StatCard number="7" label="Grade Levels" sublabel="Grades 6-12" />
            <StatCard number="4" label="STEM Subjects" sublabel="Complete Coverage" />
            <StatCard number="∞" label="Practice Problems" sublabel="Adaptive Learning" />
            <StatCard number="🏆" label="Achievements" sublabel="Unlock & Earn" />
          </div>
        </div>
      </main>
    </div>
  );
}


