// ==========================================
// Core Domain Types for Al-Minbar
// ==========================================

// --- Navigation ---
export type ViewType = 'dashboard' | 'quran' | 'ai' | 'masjid' | 'qibla' | 'tasbih' | 'calendar' | 'bookmarks' | 'settings';

// --- Quran ---
export interface Surah {
  number: number;
  nameArabic: string;
  nameEnglish: string;
  nameUrdu: string;
  meaningEnglish: string;
  revelationType: 'Meccan' | 'Medinan';
  ayahCount: number;
}

export interface Ayah {
  number: number;
  surahNumber: number;
  ayahNumber: number;
  textArabic: string;
  textUrdu?: string;
  textEnglish?: string;
  transliteration?: string;
  audioUrl?: string;
  juz?: number;
  page?: number;
}

export interface SurahDetail extends Surah {
  ayahs: Ayah[];
}

export interface Juz {
  number: number;
  ayahs: Ayah[];
}

export interface Reciter {
  identifier: string;
  name: string;
  language: string;
}

// --- Prayer Times ---
export interface PrayerTime {
  name: string;
  time: string;
  icon: string;
}

export interface PrayerTimesResponse {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Sunset: string;
  Maghrib: string;
  Isha: string;
  Imsak: string;
  Midnight: string;
}

export interface HijriDate {
  date: string;
  format: string;
  day: string;
  weekday: { en: string; ar: string };
  month: { number: number; en: string; ar: string };
  year: string;
  designation: { abbreviated: string; expanded: string };
}

// --- Masjid ---
export interface Masjid {
  id: string;
  name: string;
  distance: string;
  address: string;
  latitude: number;
  longitude: number;
  nextJummah?: string;
  tags: string[];
  prayerTimes?: Partial<PrayerTimesResponse>;
}

// --- Chat / AI ---
export interface ChatMessage {
  id: string;
  role: 'user' | 'model' | 'system';
  text: string;
  timestamp: Date;
  isThinking?: boolean;
  references?: Citation[];
}

export interface Citation {
  source: 'quran' | 'hadith' | 'tafsir';
  reference: string;
  text?: string;
}

// --- Bookmark ---
export interface Bookmark {
  id: string;
  type: 'ayah' | 'hadith' | 'dua';
  contentId: string;
  title: string;
  text: string;
  note?: string;
  createdAt: Date;
}

// --- Tasbih ---
export interface TasbihPreset {
  id: string;
  name: string;
  arabic: string;
  transliteration: string;
  translation: string;
  target: number;
}

export interface TasbihSession {
  id: string;
  presetId: string;
  count: number;
  target: number;
  completedAt?: Date;
  createdAt: Date;
}

// --- Hadith ---
export interface HadithCollection {
  id: string;
  name: string;
  arabicName?: string;
  available: number;
}

export interface HadithBookMeta {
  collectionId: string;
  order: number;
  title: string;
  arabicTitle?: string;
  sourceReference: string;
}

export interface HadithTheme {
  id: string;
  label: string;
  source: string;
  sourceOfTruth: string;
  keywords: string[];
}

export interface HadithProvenance {
  provider: string;
  endpoint: string;
  sourceId: string;
  edition: string;
  languageCoverage: string[];
}

export interface HadithVerification {
  sourceText: boolean;
  englishTranslation: boolean;
  urduTranslation: boolean;
  sanadMapped: boolean;
  rijalMapped: boolean;
}

export interface HadithReference {
  collectionId: string;
  hadithNumber: number;
  rijalCorpusIds?: string[];
}

export interface HadithRecord {
  collectionId: string;
  number: number;
  arabic: string;
  translation: string;
  translationEnglish?: string;
  translationUrdu?: string;
  themes: string[];
  sourceBookHints: string[];
  provenance: HadithProvenance;
  verification: HadithVerification;
  canonicalBook?: Pick<HadithBookMeta, 'order' | 'title' | 'arabicTitle'>;
}

export interface HadithSearchResult {
  record: HadithRecord;
  score: number;
  reasons: string[];
}

// --- User / Auth ---
export interface UserProfile {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  createdAt: Date;
  preferences: UserPreferences;
}

export interface UserPreferences {
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
    fontSize: number;
  };
}

// --- API Response ---
export interface ApiResponse<T> {
  code: number;
  status: string;
  data: T;
}
