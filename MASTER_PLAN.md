# Al-Minbar: Master Professional Version - Comprehensive Plan

## Executive Summary

The current codebase is a **proof-of-concept demo** with mock data, no real routing, no state management, and minimal features. This plan outlines the complete transformation into a **production-grade Islamic super application** with enterprise-level architecture, real API integrations, and a comprehensive feature set.

---

## Current Architecture Analysis

### Critical Issues

| Category | Current State | Required State |
|----------|--------------|----------------|
| **Routing** | State-based `useState` | React Router v6 with lazy loading |
| **State Management** | Component `useState` only | Zustand/Redux + React Context |
| **Data Layer** | Hardcoded mock data | Real APIs + caching layer |
| **Authentication** | None | Firebase Auth / Supabase |
| **Styling** | Tailwind CDN | Tailwind CLI + design tokens |
| **Testing** | Zero tests | Vitest + React Testing Library |
| **PWA** | None | Service Worker + offline support |
| **i18n** | Hardcoded strings | react-i18next with 3+ languages |
| **Performance** | No optimization | Code splitting, memoization, virtualization |
| **Accessibility** | None | WCAG 2.1 AA compliance |

### File Structure Problems
- No separation of concerns (components handle everything)
- No custom hooks for reusable logic
- No error boundaries
- No loading skeleton components
- No API service abstraction layer
- No type-safe environment variables
- No utility functions directory
- No assets directory (images, icons, sounds)

---

## Phase 1: Infrastructure & Tooling (Week 1)

### 1.1 Package & Dependency Upgrades

```json
{
  "dependencies": {
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "react-router-dom": "^7.x",
    "zustand": "^5.x",
    "@tanstack/react-query": "^5.x",
    "@tanstack/react-virtual": "^3.x",
    "react-i18next": "^15.x",
    "i18next": "^24.x",
    "react-hook-form": "^7.x",
    "zod": "^3.x",
    "date-fns": "^4.x",
    "date-fns-hijri": "^1.x",
    "clsx": "^2.x",
    "tailwind-merge": "^3.x",
    "@google/genai": "^1.30.0",
    "idb": "^8.x"
  },
  "devDependencies": {
    "typescript": "~5.8.x",
    "vite": "^6.x",
    "@vitejs/plugin-react": "^5.x",
    "tailwindcss": "^4.x",
    "@tailwindcss/vite": "^4.x",
    "vitest": "^3.x",
    "@testing-library/react": "^16.x",
    "@testing-library/jest-dom": "^6.x",
    "jsdom": "^26.x",
    "eslint": "^9.x",
    "@eslint/js": "^9.x",
    "prettier": "^3.x",
    "husky": "^9.x",
    "lint-staged": "^15.x"
  }
}
```

### 1.2 New Directory Structure

```
al-minbar/
├── public/
│   ├── manifest.json              # PWA manifest
│   ├── sw.js                      # Service worker
│   ├── icons/                     # App icons (all sizes)
│   ├── sounds/                    # Adhan audio files
│   └── fonts/                     # Self-hosted fonts
│
├── src/
│   ├── assets/
│   │   ├── images/                # SVGs, PNGs, geometric patterns
│   │   ├── icons/                 # Custom icon components
│   │   └── animations/            # Lottie animations
│   │
│   ├── components/
│   │   ├── common/                # Reusable UI primitives
│   │   │   ├── Button/
│   │   │   ├── Card/
│   │   │   ├── Modal/
│   │   │   ├── Skeleton/
│   │   │   ├── ErrorBoundary/
│   │   │   ├── LoadingSpinner/
│   │   │   └── EmptyState/
│   │   │
│   │   ├── layout/
│   │   │   ├── AppLayout.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── MobileNav.tsx
│   │   │   └── Footer.tsx
│   │   │
│   │   ├── features/
│   │   │   ├── dashboard/
│   │   │   ├── quran/
│   │   │   ├── prayer-times/
│   │   │   ├── ai-companion/
│   │   │   ├── masjid-finder/
│   │   │   ├── qibla-compass/
│   │   │   ├── tasbih-counter/
│   │   │   ├── calendar/
│   │   │   ├── bookmarks/
│   │   │   └── settings/
│   │   │
│   │   └── providers/
│   │       ├── ThemeProvider.tsx
│   │       ├── AuthProvider.tsx
│   │       ├── I18nProvider.tsx
│   │       └── QueryProvider.tsx
│   │
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── usePrayerTimes.ts
│   │   ├── useGeolocation.ts
│   │   ├── useLocalStorage.ts
│   │   ├── useDebounce.ts
│   │   ├── useMediaQuery.ts
│   │   └── useKeyboardShortcut.ts
│   │
│   ├── services/
│   │   ├── api/
│   │   │   ├── quranApi.ts        # Al-Quran Cloud API
│   │   │   ├── prayerTimesApi.ts  # Aladhan API
│   │   │   ├── masjidApi.ts       # Mosques API
│   │   │   └── hadithApi.ts       # Hadith collections
│   │   ├── geminiService.ts
│   │   ├── audioService.ts        # Adhan, recitation playback
│   │   ├── notificationService.ts # Push notifications
│   │   └── storageService.ts      # IndexedDB wrapper
│   │
│   ├── store/
│   │   ├── useAppStore.ts         # Global app state
│   │   ├── useAuthStore.ts        # Authentication state
│   │   ├── useSettingsStore.ts    # User preferences
│   │   ├── useBookmarkStore.ts    # Bookmarks state
│   │   └── useReadingStore.ts     # Reading progress
│   │
│   ├── routes/
│   │   ├── index.tsx              # Route definitions
│   │   ├── ProtectedRoute.tsx
│   │   └── pages/
│   │       ├── HomePage.tsx
│   │       ├── DashboardPage.tsx
│   │       ├── QuranPage.tsx
│   │       ├── SurahDetailPage.tsx
│   │       ├── AICompanionPage.tsx
│   │       ├── MasjidFinderPage.tsx
│   │       ├── QiblaPage.tsx
│   │       ├── TasbihPage.tsx
│   │       ├── CalendarPage.tsx
│   │       ├── BookmarksPage.tsx
│   │       ├── SettingsPage.tsx
│   │       ├── LoginPage.tsx
│   │       └── NotFoundPage.tsx
│   │
│   ├── utils/
│   │   ├── cn.ts                  # Class name merger
│   │   ├── formatDate.ts
│   │   ├── formatHijriDate.ts
│   │   ├── calculatePrayerTimes.ts
│   │   ├── qiblaDirection.ts
│   │   ├── validators.ts
│   │   └── constants.ts
│   │
│   ├── types/
│   │   ├── index.ts
│   │   ├── quran.ts
│   │   ├── prayer.ts
│   │   ├── masjid.ts
│   │   ├── chat.ts
│   │   ├── user.ts
│   │   └── api.ts
│   │
│   ├── locales/
│   │   ├── en/
│   │   │   └── translation.json
│   │   ├── ur/
│   │   │   └── translation.json
│   │   └── ar/
│   │       └── translation.json
│   │
│   ├── styles/
│   │   ├── globals.css
│   │   ├── animations.css
│   │   └── print.css
│   │
│   ├── config/
│   │   ├── env.ts                 # Type-safe env vars
│   │   ├── i18n.ts
│   │   └── queryClient.ts
│   │
│   ├── App.tsx
│   ├── main.tsx
│   └── vite-env.d.ts
│
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── .env.local
├── .env.example
├── .eslintrc.cjs
├── .prettierrc
├── vite.config.ts
├── tsconfig.json
└── package.json
```

### 1.3 Environment Configuration

```typescript
// src/config/env.ts
import { z } from 'zod';

const envSchema = z.object({
  VITE_GEMINI_API_KEY: z.string().min(1),
  VITE_QURAN_API_BASE: z.string().url().default('https://api.alquran.cloud/v2'),
  VITE_ALADHAN_API_BASE: z.string().url().default('https://api.aladhan.com/v1'),
  VITE_MOSQUES_API_BASE: z.string().url().default('https://api.mosques.app/v1'),
  VITE_FIREBASE_API_KEY: z.string().optional(),
  VITE_FIREBASE_AUTH_DOMAIN: z.string().optional(),
  VITE_GOOGLE_MAPS_API_KEY: z.string().optional(),
  VITE_SENTRY_DSN: z.string().optional(),
  VITE_ANALYTICS_ID: z.string().optional(),
});

export const env = envSchema.parse(import.meta.env);
```

### 1.4 Tailwind Configuration (Proper Setup)

```css
/* src/styles/globals.css */
@import "tailwindcss";

@theme {
  --color-lapis-900: #0F1B33;
  --color-lapis-800: #1D2D50;
  --color-lapis-700: #2A406E;
  --color-lapis-600: #3A5580;
  
  --color-gold-400: #E6C27A;
  --color-gold-500: #C5A059;
  --color-gold-600: #A38243;
  
  --color-parchment-100: #F7F4E9;
  --color-parchment-200: #EDE8D5;
  
  --font-arabic: 'Amiri', serif;
  --font-urdu: 'Noto Nastaliq Urdu', serif;
  --font-heading: 'Playfair Display', serif;
  --font-body: 'Inter', sans-serif;
}
```

---

## Phase 2: State Management & Routing (Week 2)

### 2.1 React Router Setup

```typescript
// src/routes/index.tsx
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', lazy: () => import('./pages/DashboardPage') },
      { path: 'quran', lazy: () => import('./pages/QuranPage') },
      { path: 'quran/:surahNumber', lazy: () => import('./pages/SurahDetailPage') },
      { path: 'quran/:surahNumber/:ayahNumber', lazy: () => import('./pages/SurahDetailPage') },
      { path: 'ai', lazy: () => import('./pages/AICompanionPage') },
      { path: 'masjids', lazy: () => import('./pages/MasjidFinderPage') },
      { path: 'qibla', lazy: () => import('./pages/QiblaPage') },
      { path: 'tasbih', lazy: () => import('./pages/TasbihPage') },
      { path: 'calendar', lazy: () => import('./pages/CalendarPage') },
      { path: 'bookmarks', lazy: () => import('./pages/BookmarksPage') },
      { path: 'settings', lazy: () => import('./pages/SettingsPage') },
    ],
  },
  { path: '/login', lazy: () => import('./pages/LoginPage') },
  { path: '*', element: <NotFoundPage /> },
]);
```

### 2.2 Zustand Stores

```typescript
// src/store/useSettingsStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  language: 'en' | 'ur' | 'ar';
  theme: 'dark' | 'light' | 'auto';
  calculationMethod: string;
  notifications: {
    prayer: boolean;
    jummah: boolean;
    quranDaily: boolean;
  };
  quran: {
    translations: string[];
    showTransliteration: boolean;
    autoPlayAudio: boolean;
    reciter: string;
  };
  setLanguage: (lang: 'en' | 'ur' | 'ar') => void;
  setTheme: (theme: 'dark' | 'light' | 'auto') => void;
  toggleNotification: (key: string) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      language: 'en',
      theme: 'auto',
      calculationMethod: 'university_islamic_sciences_karachi',
      notifications: { prayer: true, jummah: true, quranDaily: false },
      quran: {
        translations: ['en.sahih', 'ur.jalandhry'],
        showTransliteration: false,
        autoPlayAudio: false,
        reciter: 'ar.alafasy',
      },
      setLanguage: (lang) => set({ language: lang }),
      setTheme: (theme) => set({ theme }),
      toggleNotification: (key) => set((state) => ({
        notifications: { ...state.notifications, [key]: !state.notifications[key] }
      })),
    }),
    { name: 'al-minbar-settings' }
  )
);
```

### 2.3 React Query Setup

```typescript
// src/config/queryClient.ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30,   // 30 minutes
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});
```

---

## Phase 3: API Integration & Data Layer (Week 2-3)

### 3.1 Quran API Service

```typescript
// src/services/api/quranApi.ts
import { env } from '@/config/env';
import type { Surah, Ayah, Juz, Reciter } from '@/types/quran';

const BASE_URL = env.VITE_QURAN_API_BASE;

export const quranApi = {
  async getAllSurahs(): Promise<Surah[]> {
    const res = await fetch(`${BASE_URL}/surah`);
    const data = await res.json();
    return data.data;
  },

  async getSurah(number: number, editions: string[] = ['quran-uthmani']): Promise<Surah> {
    const editionsParam = editions.join(',');
    const res = await fetch(`${BASE_URL}/surah/${number}/editions/${editionsParam}`);
    const data = await res.json();
    return data.data;
  },

  async getAyah(surah: number, ayah: number, edition: string = 'quran-uthmani'): Promise<Ayah> {
    const res = await fetch(`${BASE_URL}/ayah/${surah}:${ayah}/${edition}`);
    const data = await res.json();
    return data.data;
  },

  async getJuz(number: number): Promise<Juz> {
    const res = await fetch(`${BASE_URL}/juz/${number}/quran-uthmani`);
    const data = await res.json();
    return data.data;
  },

  async getAudioUrl(ayahIdentifier: string, reciter: string = 'ar.alafasy'): Promise<string> {
    return `https://cdn.islamic.network/quran/audio/128/${reciter}/${ayahIdentifier}.mp3`;
  },

  async getReciters(): Promise<Reciter[]> {
    const res = await fetch(`${BASE_URL}/reciters`);
    const data = await res.json();
    return data.data;
  },
};
```

### 3.2 Prayer Times API Service

```typescript
// src/services/api/prayerTimesApi.ts
import { env } from '@/config/env';

const BASE_URL = env.VITE_ALADHAN_API_BASE;

export const prayerTimesApi = {
  async getPrayerTimes(date: Date, latitude: number, longitude: number, method: number = 1) {
    const timestamp = Math.floor(date.getTime() / 1000);
    const res = await fetch(
      `${BASE_URL}/timings/${timestamp}?lat=${latitude}&lng=${longitude}&method=${method}`
    );
    const data = await res.json();
    return data.data;
  },

  async getHijriDate(date: Date = new Date()) {
    const timestamp = Math.floor(date.getTime() / 1000);
    const res = await fetch(`${BASE_URL}/dateInfo/${timestamp}`);
    const data = await res.json();
    return data.data;
  },

  async getMonthlyCalendar(year: number, month: number, latitude: number, longitude: number) {
    const res = await fetch(
      `${BASE_URL}/calendar/${year}/${month}?latitude=${latitude}&longitude=${longitude}`
    );
    const data = await res.json();
    return data.data;
  },
};
```

### 3.3 Masjid API Service

```typescript
// src/services/api/masjidApi.ts
import { env } from '@/config/env';

const BASE_URL = env.VITE_MOSQUES_API_BASE;

export const masjidApi = {
  async searchNearby(lat: number, lng: number, radius: number = 5000) {
    const res = await fetch(
      `${BASE_URL}/search?lat=${lat}&lng=${lng}&radius=${radius}`
    );
    const data = await res.json();
    return data.results;
  },

  async getDetails(masjidId: string) {
    const res = await fetch(`${BASE_URL}/masjid/${masjidId}`);
    const data = await res.json();
    return data;
  },
};
```

### 3.4 Hadith API Service

```typescript
// src/services/api/hadithApi.ts
const BASE_URL = 'https://api.hadith.gading.dev';

export const hadithApi = {
  async getBooks() {
    const res = await fetch(`${BASE_URL}/books`);
    const data = await res.json();
    return data.data;
  },

  async getHadith(book: string, number: number) {
    const res = await fetch(`${BASE_URL}/books/${book}/${number}`);
    const data = await res.json();
    return data.data;
  },

  async searchHadith(book: string, query: string) {
    const res = await fetch(`${BASE_URL}/books/${book}?search=${encodeURIComponent(query)}`);
    const data = await res.json();
    return data.data;
  },
};
```

---

## Phase 4: Component Redesign & New Features (Week 3-5)

### 4.1 New Features to Add

| Feature | Priority | Description |
|---------|----------|-------------|
| **Qibla Compass** | High | Real-time Qibla direction using device sensors |
| **Tasbih Counter** | High | Digital counter with presets, history, goals |
| **Islamic Calendar** | High | Hijri calendar with events, fasting days |
| **Bookmarks System** | High | Save ayahs, hadiths, with notes |
| **Reading Progress** | Medium | Track Quran reading progress, last read |
| **Audio Player** | High | Full Quran recitation with controls |
| **User Authentication** | High | Firebase auth for sync across devices |
| **Push Notifications** | Medium | Prayer time reminders, daily ayah |
| **Dark/Light Theme** | Medium | System-aware theme switching |
| **Khutbah Library** | Medium | Weekly khutbahs with audio |
| **Du'a Collection** | Medium | Categorized du'as with audio |
| **Zakat Calculator** | Medium | Interactive calculator |
| **Ramadan Mode** | Low | Special Ramadan features |
| **Community Features** | Low | Local masjid events, announcements |

### 4.2 Dashboard Redesign

```typescript
// Key improvements:
// - Real-time prayer times from API
// - Accurate Hijri date
// - Dynamic daily ayah (rotates through all 6236)
// - Weather integration for prayer context
// - Quick access to all features
// - Personalized greeting based on time
// - Prayer countdown timer
// - Weekly progress stats
```

### 4.3 Quran Reader Redesign

```typescript
// Key improvements:
// - Full 114 surahs from API
// - Multiple translations (English, Urdu, Arabic, etc.)
// - Audio playback per ayah
// - Bookmarking system
// - Reading progress tracking
// - Tafsir integration
// - Word-by-word translation
// - Search functionality
// - Juz view
// - Night mode for reading
// - Font size controls
// - Copy/share ayah
```

### 4.4 AI Companion Redesign

```typescript
// Key improvements:
// - Streaming responses
// - Conversation history persistence
// - Multiple AI personas (Scholar, Historian, Teacher)
// - Source citations with clickable references
// - Voice input/output
// - Image analysis (for Islamic art, architecture)
// - Context-aware suggestions
// - Safety filters for sensitive topics
// - Export conversation
// - Rate limiting & cost management
```

### 4.5 Masjid Finder Redesign

```typescript
// Key improvements:
// - Real Google Maps / Mapbox integration
// - Real masjid data from APIs
// - User reviews and ratings
// - Prayer time per masjid
// - Event listings
// - Directions integration
// - Filter by amenities
// - Report incorrect info
// - Offline map caching
```

---

## Phase 5: Performance & PWA (Week 5-6)

### 5.1 Performance Optimizations

```typescript
// Code splitting
const QuranPage = React.lazy(() => import('./pages/QuranPage'));

// Virtualization for long lists
import { useVirtualizer } from '@tanstack/react-virtual';

// Memoization
const AyahCard = React.memo(({ ayah }: { ayah: Ayah }) => {
  // ... component
});

// Image optimization
// - Self-host fonts instead of Google Fonts CDN
// - Preload critical resources
// - Use WebP/AVIF images
```

### 5.2 PWA Configuration

```json
// public/manifest.json
{
  "name": "Al-Minbar - Islamic Super App",
  "short_name": "Al-Minbar",
  "description": "Your companion for Islamic knowledge, prayer times, and community",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0F1B33",
  "theme_color": "#1D2D50",
  "orientation": "portrait-primary",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ],
  "categories": ["lifestyle", "education", "reference"],
  "lang": "en",
  "dir": "ltr"
}
```

### 5.3 Service Worker Strategy

```typescript
// Cache strategies:
// - Quran text: Cache-first (rarely changes)
// - Prayer times: Network-first (time-sensitive)
// - Audio: Cache-first with storage quota
// - AI responses: Network-only
// - Static assets: Stale-while-revalidate
```

---

## Phase 6: Testing, Accessibility & Production (Week 6-7)

### 6.1 Testing Strategy

```typescript
// Unit tests
// - Utility functions (date formatting, qibla calculation)
// - Store logic
// - API service mocks

// Integration tests
// - Component interactions
// - API data flow
// - Routing

// E2E tests
// - User journeys
// - Critical paths
// - Cross-browser testing
```

### 6.2 Accessibility Checklist

- [ ] All interactive elements keyboard accessible
- [ ] ARIA labels on all icons and buttons
- [ ] Color contrast ratio 4.5:1 minimum
- [ ] Screen reader testing
- [ ] Focus management on route changes
- [ ] Skip navigation link
- [ ] RTL support for Arabic/Urdu
- [ ] Reduced motion support
- [ ] Font scaling support

### 6.3 Security Hardening

- [ ] Environment variable validation
- [ ] API rate limiting
- [ ] Input sanitization
- [ ] CSP headers
- [ ] HTTPS enforcement
- [ ] XSS protection
- [ ] CSRF tokens (if using cookies)

---

## Execution Order & Timeline

| Phase | Duration | Dependencies |
|-------|----------|--------------|
| **Phase 1: Infrastructure** | Week 1 | None |
| **Phase 2: State & Routing** | Week 2 | Phase 1 |
| **Phase 3: API Integration** | Week 2-3 | Phase 2 |
| **Phase 4: Features** | Week 3-5 | Phase 3 |
| **Phase 5: Performance/PWA** | Week 5-6 | Phase 4 |
| **Phase 6: Testing/Production** | Week 6-7 | Phase 5 |

**Total Estimated Timeline: 7 weeks**

---

## API Resources

| Service | URL | Purpose |
|---------|-----|---------|
| Al-Quran Cloud | https://alquran.cloud/api | Quran text, audio, tafsir |
| Aladhan | https://aladhan.com/prayer-times-api | Prayer times, Hijri date |
| Islamic Network | https://islamic.network/ | Additional Quran data |
| Hadith API | https://hadith.gading.dev | Hadith collections |
| Mosques API | https://api.mosques.app | Masjid locations |
| Google Gemini | https://ai.google.dev | AI companion |
| Google Maps | https://maps.google.com | Maps integration |

---

## Migration Strategy

### Step-by-Step Execution

1. **Create new project structure** - Set up all directories
2. **Install dependencies** - Run `npm install` with new packages
3. **Configure Tailwind properly** - Move from CDN to proper setup
4. **Set up React Router** - Replace state-based routing
5. **Create Zustand stores** - Migrate from useState
6. **Set up React Query** - Configure caching layer
7. **Implement API services** - Replace mock data
8. **Rebuild components** - One by one, starting with common UI
9. **Add new features** - Qibla, Tasbih, Calendar, etc.
10. **Implement i18n** - Add language switching
11. **Add authentication** - Firebase/Supabase
12. **Set up PWA** - Service worker, manifest
13. **Write tests** - Unit, integration, E2E
14. **Accessibility audit** - Fix all issues
15. **Performance optimization** - Lighthouse audit
16. **Production deployment** - Vercel/Netlify/Cloudflare Pages

---

## Cost Considerations

| Service | Free Tier | Paid |
|---------|-----------|------|
| Gemini API | 15 RPM free | $0.35/1M tokens |
| Al-Quran Cloud | Free | Free |
| Aladhan | Free | Free |
| Firebase Auth | Free tier | Pay as you go |
| Google Maps | $200/mo credit | After credit |
| Vercel/Netlify | Free tier | $20/mo pro |
| Sentry | 5K errors/mo free | $26/mo |

**Estimated Monthly Cost: $0-50** depending on usage

---

## Success Metrics

- [ ] Lighthouse score: 95+ across all categories
- [ ] First Contentful Paint: < 1.5s
- [ ] Time to Interactive: < 3.5s
- [ ] Bundle size: < 200KB gzipped
- [ ] Test coverage: > 80%
- [ ] Accessibility: WCAG 2.1 AA
- [ ] PWA: Installable, offline support
- [ ] All 114 surahs accessible
- [ ] Real-time prayer times
- [ ] Working Qibla compass
- [ ] Functional AI with streaming
- [ ] User authentication working
- [ ] Bookmarks sync across devices
