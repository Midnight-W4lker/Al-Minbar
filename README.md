# Al-Minbar - The Islamic Super App

<div align="center">
  <p><strong>Your companion for Islamic knowledge, prayer times, and community</strong></p>
  <p>Built with React 19, Vite, Tailwind CSS, and Ollama AI</p>
</div>

## Features

- **Dashboard** - Real-time prayer times, Hijri date, daily ayah, and quick access to all features
- **Al-Quran Reader** - Full 114 surahs with Arabic, English, and Urdu translations, bookmarking, and font controls
- **Noor AI Companion** - Islamic study assistant powered by Ollama (local AI) with Quran & Hadith references
- **Masjid Finder** - Find nearby mosques with location-based search
- **Hadith Explorer** - Hierarchical collection browsing with fast retrieval by number, context, and source-backed themes (in active development)
- **Trust Controls** - Verified-only hadith mode, provenance badges, and explicit metadata integrity guardrails
- **Feature Flags** - Route-level and navigation-level gating with beta labeling for in-progress modules
- **Qibla Compass** - Direction to the Kaaba (requires device orientation)
- **Tasbih Counter** - Digital dhikr counter with preset targets
- **Islamic Calendar** - Hijri calendar with events (coming soon)
- **Bookmarks** - Save and organize your favorite ayahs and hadiths
- **Settings** - Language, theme, and Quran reader preferences

## Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | React 19 + TypeScript |
| Build Tool | Vite 6 |
| Styling | Tailwind CSS 4 |
| Routing | React Router 7 |
| State Management | Zustand 5 |
| Data Fetching | TanStack Query 5 |
| AI | Ollama (local, no API key required) |
| Fonts | Amiri, Noto Nastaliq Urdu, Playfair Display, Inter |

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm
- Ollama (for AI features) - Install from https://ollama.ai

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd al-minbar_-the-islamic-super-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up Ollama:
   ```bash
   # Install Ollama from https://ollama.ai
   # Pull the required model:
   ollama pull kimi-k2.5:cloud
   ```

4. Set up environment variables (optional):
   ```bash
   cp .env.example .env.local
   ```
   The default values work out of the box if Ollama is running locally.

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── components/
│   ├── common/          # Reusable UI primitives
│   ├── layout/          # AppLayout, Header, Sidebar, MobileNav
│   └── providers/       # React Query provider
├── config/              # Environment validation, query client
├── routes/              # Router config and page components
├── services/
│   └── api/             # Quran, Prayer Times, Masjid, Hadith APIs
├── store/               # Zustand stores (settings, bookmarks)
├── styles/              # Global CSS and Tailwind config
├── types/               # TypeScript type definitions
├── utils/               # Utility functions (cn class merger)
├── App.tsx              # Root component
└── main.tsx             # Entry point
```

## API Integrations

| Service | URL | Purpose |
|---------|-----|---------|
| Al-Quran Cloud | https://alquran.cloud/api | Quran text, audio, tafsir |
| Aladhan | https://aladhan.com/prayer-times-api | Prayer times, Hijri date |
| Mosques API | https://api.mosques.app | Masjid locations |
| Hadith API | https://api.hadith.gading.dev | Hadith collections |
| Ollama | http://localhost:11434 | Local AI companion (no API key) |

### API Caveats (Current)

- `api.hadith.gading.dev` enforces max `300` hadith per range request; indexing is chunked client-side.
- `api.mosques.app` may return non-browser-friendly responses for public client fetches; the app currently uses graceful fallback data when live fetch fails.
- Hadith multilingual parity (Arabic + English + Urdu for every record) is not yet complete from current provider payloads.

## Trust, Integrity, and Roadmap

- Quran and hadith source texts are rendered as immutable source payloads; enhancements are metadata overlays.
- A detailed review and implementation plan is maintained in `CODE_REVIEW_AND_DELIVERY_PLAN.md`.
- Existing long-form architecture planning remains in `MASTER_PLAN.md`.

### Implemented Plan Steps (Current)

1. Added hadith provenance metadata in API mapping and detail rendering.
2. Added verified-only and provenance-visibility controls in `Settings`.
3. Added explicit handling for unavailable sanad/rijal linkage (no fabricated IDs).
4. Added centralized feature flags (`src/config/env.ts`) and beta labels across nav/dashboard.
5. Added route-level guards to avoid partial-feature disruption.

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run format` | Format code with Prettier |

## Roadmap

- [ ] Full i18n support (English, Urdu, Arabic)
- [ ] Canonical hadith ordering for each enabled collection
- [ ] Verified hadith English + Urdu translation coverage with provenance metadata
- [ ] Rijal/sanad corpus linkage with explicit source IDs
- [ ] Expanded Quran word anatomy and morphology coverage
- [ ] PWA with offline support
- [ ] Audio recitation playback
- [ ] User authentication & cross-device sync
- [ ] Push notifications for prayer times
- [ ] Tafsir integration
- [ ] Zakat calculator
- [ ] Community features (events, announcements)

## License

This project is open source and available under the MIT License.

## Disclaimer

This application is a reference tool. For religious rulings, please consult a qualified scholar. AI-generated content may contain inaccuracies.
