import Link from "next/link";
import HomeGate from "@/components/home/HomeGate";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">STEM Learn</h1>
            </div>
            <nav className="flex space-x-6">
              <Link href="/subjects" className="text-gray-600 hover:text-blue-600 transition-colors">
                Subjects
              </Link>
              <Link href="/profile" className="text-gray-600 hover:text-blue-600 transition-colors">
                Profile
              </Link>
              <Link href="/achievements" className="text-gray-600 hover:text-blue-600 transition-colors">
                Achievements
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Interactive <span className="text-blue-600">STEM</span> Learning
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Explore Science, Technology, Engineering, and Mathematics through engaging, 
            gamified lessons designed for students in grades 6-12.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/subjects"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors shadow-lg"
            >
              Start Learning
            </Link>
            <Link 
              href="/demo"
              className="border border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
            >
              Take Demo
            </Link>
          </div>
        </div>

        <HomeGate />

        {/* Subject Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <SubjectCard 
            title="Science" 
            titleOdia="ବିଜ୍ଞାନ"
            description="Explore the natural world through experiments and discovery"
            icon="🔬"
            color="from-purple-500 to-pink-500"
            href="/subjects/science"
          />
          <SubjectCard 
            title="Technology" 
            titleOdia="ପ୍ରଯୁକ୍ତି"
            description="Learn about computers, coding, and digital innovation"
            icon="💻"
            color="from-blue-500 to-cyan-500"
            href="/subjects/technology"
          />
          <SubjectCard 
            title="Engineering" 
            titleOdia="ଇଞ୍ଜିନିୟରିଂ"
            description="Design, build, and solve real-world problems"
            icon="⚙️"
            color="from-orange-500 to-red-500"
            href="/subjects/engineering"
          />
          <SubjectCard 
            title="Mathematics" 
            titleOdia="ଗଣିତ"
            description="Master numbers, patterns, and logical thinking"
            icon="📐"
            color="from-green-500 to-teal-500"
            href="/subjects/mathematics"
          />
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <FeatureCard 
            icon="🎮"
            title="Gamified Learning"
            description="Earn XP, unlock badges, and compete with friends while learning"
          />
          <FeatureCard 
            icon="📱"
            title="Offline Ready"
            description="Learn anywhere, anytime with our progressive web app technology"
          />
          <FeatureCard 
            icon="🌐"
            title="Bilingual Support"
            description="Content available in English and Odia for better understanding"
          />
        </div>

        {/* Stats Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <StatCard number="7" label="Grade Levels" sublabel="Grades 6-12" />
            <StatCard number="4" label="STEM Subjects" sublabel="Complete Coverage" />
            <StatCard number="∞" label="Practice Problems" sublabel="Adaptive Learning" />
            <StatCard number="🏆" label="Achievements" sublabel="Unlock & Earn" />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className="text-xl font-bold">STEM Learn</span>
          </div>
          <p className="text-gray-400 mb-4">
            Empowering rural students with interactive STEM education
          </p>
          <div className="flex justify-center space-x-6 text-sm text-gray-400">
            <span>© 2024 STEM Learning Platform</span>
            <span>•</span>
            <span>Built with Next.js</span>
            <span>•</span>
            <span>PWA Ready</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Subject Card Component
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
      <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group-hover:scale-105">
        <div className={`bg-gradient-to-r ${color} p-6 text-center`}>
          <div className="text-4xl mb-2">{icon}</div>
          <h3 className="text-xl font-bold text-white">{title}</h3>
          <p className="text-white/80 text-sm font-medium">{titleOdia}</p>
        </div>
        <div className="p-6">
          <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
        </div>
      </div>
    </Link>
  );
}

// Feature Card Component
interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="text-center">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

// Stat Card Component
interface StatCardProps {
  number: string;
  label: string;
  sublabel: string;
}

function StatCard({ number, label, sublabel }: StatCardProps) {
  return (
    <div>
      <div className="text-3xl font-bold text-blue-600 mb-2">{number}</div>
      <div className="text-lg font-semibold text-gray-900">{label}</div>
      <div className="text-sm text-gray-500">{sublabel}</div>
    </div>
  );
}
