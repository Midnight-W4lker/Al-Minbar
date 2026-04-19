import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  language: 'en' | 'ur' | 'ar';
  theme: 'dark' | 'light' | 'auto';
  calculationMethod: number;
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
  hadith: {
    verifiedOnly: boolean;
    showProvenance: boolean;
  };
  setLanguage: (lang: 'en' | 'ur' | 'ar') => void;
  setTheme: (theme: 'dark' | 'light' | 'auto') => void;
  toggleNotification: (key: keyof SettingsState['notifications']) => void;
  setQuranSetting: <K extends keyof SettingsState['quran']>(key: K, value: SettingsState['quran'][K]) => void;
  setHadithSetting: <K extends keyof SettingsState['hadith']>(key: K, value: SettingsState['hadith'][K]) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      language: 'en',
      theme: 'auto',
      calculationMethod: 1,
      notifications: { prayer: true, jummah: true, quranDaily: false },
      quran: {
        translations: ['en.sahih', 'ur.jalandhry'],
        showTransliteration: false,
        autoPlayAudio: false,
        reciter: 'ar.alafasy',
        fontSize: 24,
      },
      hadith: {
        verifiedOnly: true,
        showProvenance: true,
      },
      setLanguage: (lang) => set({ language: lang }),
      setTheme: (theme) => set({ theme }),
      toggleNotification: (key) => set((state) => ({
        notifications: { ...state.notifications, [key]: !state.notifications[key] }
      })),
      setQuranSetting: (key, value) => set((state) => ({
        quran: { ...state.quran, [key]: value }
      })),
      setHadithSetting: (key, value) => set((state) => ({
        hadith: { ...state.hadith, [key]: value }
      })),
    }),
    { name: 'al-minbar-settings' }
  )
);
