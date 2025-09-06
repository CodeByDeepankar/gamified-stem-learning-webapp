# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Development Commands

### Setup and Development
```bash
# Install dependencies
npm install

# Start development server with Turbopack
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

### Testing and Quality Assurance
```bash
# Type checking
npx tsc --noEmit

# Check PWA functionality
npm run build && npm start
# Then test offline mode in Chrome DevTools

# Test specific grade content
# Navigate to src/data/content/ and validate JSON structures
```

## Architecture Overview

### Core Architecture Patterns

**Progressive Web App (PWA) with Offline-First Design**
- Built on Next.js 15 with App Router architecture
- Service Worker handles offline content caching via Workbox
- IndexedDB (Dexie) provides local data persistence
- Automatic background sync when connectivity returns

**Bilingual Content Management System**
- Every content piece has both English and Odia (`titleOdia`, `contentOdia`, etc.) versions
- Content is structured using TypeScript interfaces in `src/lib/types/content.ts`
- Uses next-i18next with custom locale path: `src/data/locales/`
- Locale configuration: English ('en') default, Odia ('or') secondary

**Gamification Engine Architecture**
- XP/Level system with granular progress tracking
- Badge system with rarity tiers (common → legendary)
- Daily challenges with subject rotation logic
- Streak counters and leaderboard systems
- All gamification data structures defined in `src/lib/types/gamification.ts`

### Data Layer Architecture

**Database Design (IndexedDB via Dexie)**
- `LearningPlatformDB` class in `src/lib/db/database.ts` manages all local storage
- Tables: users, userProgress, topics, badges, achievements, learningSessions, dailyChallenges
- `OfflineManager` class handles caching, sync queue, and storage management
- Automatic cleanup of old cached content (configurable retention periods)

**Content Structure Hierarchy**
```
Subject (science|technology|engineering|mathematics)
├── Grade (6-12)
├── LearningPath (curated topic sequences)
└── Topic
    ├── ContentSection (lesson|exercise|project|assessment|experiment)
    ├── MediaResource (image|video|audio|animation|simulation)
    ├── InteractiveElement (quiz|drag_drop|matching|simulation)
    └── Assessment (formative|summative with questions)
```

**Offline Synchronization Strategy**
- `SyncQueue` table tracks all pending changes
- Background sync occurs every 30 seconds when online
- Conflict resolution for offline/online data merges
- Storage quota monitoring and automatic cleanup

### Component Architecture

**Gamification Components** (`src/components/gamification/`)
- `XPProgressBar`: Animated progress tracking with Framer Motion
- `BadgeDisplay`: Achievement visualization
- `StreakCounter`: Daily learning streak tracking

**Hooks Architecture** (`src/hooks/`)
- `useOffline`: Comprehensive offline state management, sync orchestration, storage monitoring

### Styling System

**Tailwind Configuration** (`tailwind.config.ts`)
- Educational color palette: primary (blue), secondary (green), accent (orange)
- Custom animations: bounceIn, slideUp, confetti for gamification feedback
- Odia font support: 'Noto Sans Oriya' for proper script rendering
- Responsive breakpoints optimized for mobile-first rural usage

## Key Development Guidelines

### Content Development
- All new topics must be added to `src/data/content/grade{X}-{subject}.ts` files
- Follow the `Topic` interface structure with bilingual content
- Set `isOfflineReady: true` for content intended for offline access
- Include proper `prerequisites` array for learning path dependencies

### Database Operations
```typescript
// Cache content for offline access
await OfflineManager.cacheContent(topicId, 'topic', topicData);

// Sync progress (automatically queued for background sync)
await OfflineManager.saveProgress(userId, progressUpdate);

// Check cached content availability
const cachedTopic = await OfflineManager.getCachedContent(topicId, 'topic');
```

### Gamification Integration
- XP rewards are defined in `XPReward` interface with bilingual reasons
- Badge requirements use flexible `BadgeRequirement` system
- All gamification actions should trigger appropriate feedback animations

### Internationalization Workflow
- Locale files stored in `src/data/locales/[en|or]/`
- Use `next-i18next` for UI text, direct object properties for content
- Test both languages using browser language switcher or URL params

### PWA Development
- Service Worker automatically configured via `@ducanh2912/next-pwa`
- PWA disabled in development mode (`next.config.ts`)
- Test installation and offline functionality in production builds

## Environment Configuration

### Required Environment Variables
Create `.env.local`:
```env
# PWA Configuration
NEXT_PUBLIC_PWA_NAME="STEM Learn"
NEXT_PUBLIC_PWA_SHORT_NAME="STEM Learn"
NEXT_PUBLIC_PWA_DESCRIPTION="Interactive STEM learning for rural students"

# App Configuration
NEXT_PUBLIC_APP_NAME="STEM Learning Platform"
NEXT_PUBLIC_APP_VERSION="1.0.0"
```

### PWA Manifest
- Located in `public/manifest.json`
- Includes app icons, splash screens, and offline capability declarations
- Shortcuts configured for quick access to different subjects

## Performance Considerations

### Build Optimization
- Turbopack enabled for faster development and production builds
- Aggressive front-end navigation caching enabled
- Service Worker minification enabled via SWC

### Storage Management
- Automatic cleanup of content older than 30 days (configurable)
- Storage quota monitoring and alerts
- Progressive download of content based on user learning paths

### Offline Strategy
- Critical learning paths cached on first app launch
- Media resources downloaded on-demand with offline availability
- Assessment data synchronized when connectivity allows

## Testing Offline Functionality

### Manual Testing Steps
1. Build and run production version
2. Open Chrome DevTools → Application → Service Workers
3. Check "Offline" checkbox
4. Navigate through cached content
5. Complete assessments and verify local storage
6. Re-enable network and verify background sync

### Content Validation
- Ensure all bilingual content pairs are complete
- Validate TypeScript interfaces against actual content
- Test learning path prerequisite chains
- Verify XP calculations and level progressions
