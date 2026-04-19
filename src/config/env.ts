import { z } from 'zod';

const envSchema = z.object({
  VITE_OLLAMA_BASE_URL: z.string().url().default('http://localhost:11434'),
  VITE_OLLAMA_MODEL: z.string().default('llama3.2'),
  // API base URLs with fallbacks - use .default() for fallback when not specified
  VITE_QURAN_API_BASE: z.string().url().default('https://api.alquran.cloud/v1'),
  VITE_ALADHAN_API_BASE: z.string().url().default('https://api.aladhan.com/v1'),
  VITE_MOSQUES_API_BASE: z.string().url().default('https://api.mosques.app/v1'),
  VITE_HADITH_API_BASE: z.string().url().default('https://api.hadith.gading.dev'),

  VITE_FIREBASE_API_KEY: z.string().optional(),
  VITE_FIREBASE_AUTH_DOMAIN: z.string().optional(),
  VITE_FIREBASE_PROJECT_ID: z.string().optional(),
  VITE_FIREBASE_STORAGE_BUCKET: z.string().optional(),
  VITE_FIREBASE_MESSAGING_SENDER_ID: z.string().optional(),
  VITE_FIREBASE_APP_ID: z.string().optional(),
  VITE_GOOGLE_MAPS_API_KEY: z.string().optional(),
  VITE_SENTRY_DSN: z.string().optional(),
  VITE_ANALYTICS_ID: z.string().optional(),
});

export type Env = z.infer<typeof envSchema>;

// Validate environment variables at startup
const result = envSchema.safeParse(import.meta.env);

if (!result.success) {
  console.error('❌ Invalid environment variables:', result.error.flatten().fieldErrors);
  throw new Error('Environment validation failed. Check your .env.local file.');
}

export const env = result.data;

export const featureFlags = {
  aiCompanion: true,
  hadithExplorer: true,
  masjidFinder: true,
  calendar: true,
  quranStudyOverlays: true,
};

export const betaFeatures: Record<string, boolean> = {
  '/ai': true,
  '/hadith': true,
  '/calendar': true,
};

export function isRouteEnabled(path: string): boolean {
  if (path === '/ai') return featureFlags.aiCompanion;
  if (path === '/hadith') return featureFlags.hadithExplorer;
  if (path === '/masjids') return featureFlags.masjidFinder;
  if (path === '/calendar') return featureFlags.calendar;
  return true;
}

