# Gamified STEM Learning Platform

An interactive Progressive Web App (PWA) designed for students in rural India (grades 6–12) to improve STEM learning through engaging offline-friendly features, multilingual support (English + Odia), and gamified content.

## 🌟 Key Features

### 🎯 Educational Focus
- **Curriculum-aligned content** for grades 6-12
- **STEM subjects**: Science, Technology, Engineering, Mathematics
- **Bilingual support**: English and Odia languages
- **Offline-first design** for areas with limited connectivity
- **Progressive difficulty** with adaptive learning paths

### 🎮 Gamification
- **Points & Levels**: XP system with progressive unlocks
- **Badges & Achievements**: Earn rewards for consistent learning
- **Daily Challenges**: Engaging STEM problems
- **Streak Counter**: Motivate daily learning habits
- **Leaderboards**: Friendly competition with peers

### 📱 Technical Features
- **Progressive Web App (PWA)**: Installable, app-like experience
- **Offline Capability**: Content caching with IndexedDB
- **Responsive Design**: Works on phones, tablets, and desktops
- **Modern Tech Stack**: Next.js 15, TypeScript, Tailwind CSS
- **Smooth Animations**: Framer Motion for engaging interactions

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd gamified-stem-learning-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   Visit [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
├── components/             # React Components
│   ├── ui/                # Basic UI components
│   ├── gamification/      # Gamification components
│   └── learning/          # Learning-specific components
├── lib/                   # Utilities and configurations
│   ├── db/               # Database (IndexedDB) setup
│   ├── types/            # TypeScript type definitions
│   └── utils/            # Utility functions
├── data/                  # Static data and content
│   ├── content/          # Educational content
│   └── locales/          # Translation files
├── hooks/                 # Custom React hooks
├── contexts/              # React context providers
└── stores/                # State management

public/
├── icons/                 # PWA icons and app icons
├── sounds/                # Audio files for feedback
└── images/                # Static images and illustrations
```

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom educational theme
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **State Management**: Zustand

### PWA & Offline
- **PWA**: @ducanh2912/next-pwa
- **Database**: Dexie (IndexedDB wrapper)
- **Caching**: Service Worker with Workbox

### Internationalization
- **i18n**: next-i18next
- **Languages**: English, Odia (ଓଡ଼ିଆ)

### Development
- **Linting**: ESLint with Next.js config
- **Type Checking**: TypeScript strict mode
- **Package Manager**: npm/yarn/pnpm

## 🎨 Design System

### Colors
- **Primary**: Blue tones for learning and trust
- **Secondary**: Green tones for success and growth
- **Accent**: Orange tones for highlights and energy
- **Educational**: Carefully chosen for accessibility

### Typography
- **English**: Inter font family
- **Odia**: Noto Sans Oriya for proper script rendering
- **Responsive**: Fluid typography that scales with screen size

### Components
- **Accessible**: WCAG 2.1 AA compliant
- **Mobile-first**: Designed for touch interactions
- **Consistent**: Unified design language throughout

## 🌐 Internationalization

The platform supports bilingual education:

- **English**: Primary interface language
- **Odia (ଓଡ଼ିଆ)**: Local language support for rural Indian students
- **Content**: All educational materials available in both languages
- **UI**: Complete interface translation
- **RTL Ready**: Prepared for right-to-left language support

## 💾 Offline Functionality

### Content Caching
- **Topics**: Educational content cached locally
- **Media**: Images, videos, and audio files
- **Assessments**: Quizzes and interactive elements
- **Progress**: User progress stored locally and synced

### Sync Strategy
- **Background Sync**: Automatic when connection available
- **Conflict Resolution**: Smart merge of offline/online changes
- **Storage Management**: Automatic cleanup of old content
- **Bandwidth Awareness**: Optimized for low-bandwidth scenarios

## 🎯 Learning Management

### Content Organization
- **Subjects**: Science, Technology, Engineering, Mathematics
- **Grades**: 6, 7, 8, 9, 10, 11, 12
- **Difficulty Levels**: Beginner, Intermediate, Advanced
- **Learning Paths**: Guided sequences of topics

### Progress Tracking
- **Completion Status**: Not started, In progress, Completed, Mastered
- **Time Tracking**: Time spent on each topic
- **Assessment Scores**: Performance tracking
- **Learning Analytics**: Insights into learning patterns

## 🏆 Gamification System

### Experience Points (XP)
- **Activities**: Earned through learning activities
- **Levels**: Progressive unlocking based on XP
- **Bonuses**: Extra points for streaks and achievements

### Badges
- **Categories**: Learning, Streak, Challenge, Social, Milestone
- **Rarity**: Common, Uncommon, Rare, Epic, Legendary
- **Requirements**: Various criteria for earning

### Daily Challenges
- **Fresh Content**: New challenges every day
- **Subject Rotation**: Balanced across STEM subjects
- **Difficulty Adaptation**: Based on user performance

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file:

```env
# App Configuration
NEXT_PUBLIC_APP_NAME="STEM Learning Platform"
NEXT_PUBLIC_APP_VERSION="1.0.0"

# API Configuration (when backend is added)
# NEXT_PUBLIC_API_URL=https://your-api-url.com
# API_SECRET_KEY=your-secret-key

# PWA Configuration
NEXT_PUBLIC_PWA_NAME="STEM Learn"
NEXT_PUBLIC_PWA_SHORT_NAME="STEM Learn"
NEXT_PUBLIC_PWA_DESCRIPTION="Interactive STEM learning for rural students"
```

### PWA Manifest
The PWA manifest is configured in `public/manifest.json` with:
- App icons for various sizes
- Splash screens for different devices
- Offline capability declarations
- Shortcuts for quick access

## 📚 Content Management

### Adding New Content
1. **Create topic files** in `src/data/content/`
2. **Follow TypeScript interfaces** defined in `src/lib/types/content.ts`
3. **Include bilingual content** (English + Odia)
4. **Add media resources** to `public/images/`
5. **Update learning paths** as needed

### Content Structure
```typescript
// Example topic structure
const topic: Topic = {
  id: 'unique-topic-id',
  title: 'English Title',
  titleOdia: 'ଓଡ଼ିଆ ଶିରୋନାମ',
  subject: 'mathematics',
  grade: '8',
  difficulty: 'intermediate',
  // ... additional properties
}
```

## 🧪 Testing

### Running Tests
```bash
# Unit tests
npm test

# E2E tests
npm run test:e2e

# Type checking
npm run type-check

# Linting
npm run lint
```

### PWA Testing
1. **Lighthouse**: Run PWA audit in Chrome DevTools
2. **Offline Testing**: Disable network in DevTools
3. **Installation**: Test "Add to Home Screen" functionality
4. **Performance**: Monitor Core Web Vitals

## 🚀 Deployment

### Build for Production
```bash
npm run build
npm start
```

### Platform Options

#### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

#### Netlify
```bash
npm run build
# Upload 'out' folder to Netlify
```

#### Self-hosted
```bash
npm run build
npm start
# Or serve the 'out' folder with any static server
```

### PWA Considerations
- **HTTPS Required**: PWAs must be served over HTTPS
- **Service Worker**: Automatically generated and cached
- **App Store**: Can be submitted to app stores via PWABuilder

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Standards
- **TypeScript**: Strict mode enabled
- **ESLint**: Follow Next.js recommended rules
- **Prettier**: Code formatting (if configured)
- **Commit Messages**: Use conventional commit format

### Adding Translations
1. Update `src/data/locales/en/common.json`
2. Update `src/data/locales/or/common.json`
3. Test with language switcher
4. Verify text rendering in both languages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Rural Education Initiative**: Inspiration for offline-first design
- **Odia Language Community**: Translation and cultural guidance
- **Open Source Contributors**: Libraries and tools that make this possible
- **Students and Teachers**: Feedback and testing from the target audience

## 📞 Support

For questions, issues, or contributions:

- **GitHub Issues**: Technical bugs and feature requests
- **Discussions**: General questions and community support
- **Email**: [contact@yourdomain.com] for direct support

---

**Made with ❤️ for rural students in India**

*Empowering STEM education through technology, accessibility, and gamification.*
