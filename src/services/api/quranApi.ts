import { env } from '@/config/env';
import { fetchWithTimeout } from '@/utils/fetchWithTimeout';
import type { Surah, Ayah, SurahDetail, Juz, Reciter, ApiResponse } from '@/types';

const BASE_URL = env.VITE_QURAN_API_BASE;

// Helper to normalize API ayah response to our internal type
// normalizeAyah function is reserved for future use when more API formats are supported

export const quranApi = {
  async getAllSurahs(): Promise<Surah[]> {
    const res: ApiResponse<any[]> = await fetchWithTimeout(`${BASE_URL}/surah`);

    return res.data.map((s) => ({
      number: s.number,
      nameArabic: s.name ?? '',
      nameEnglish: s.englishName ?? '',
      nameUrdu: s.name ?? '',
      meaningEnglish: s.englishNameTranslation ?? '',
      revelationType: s.revelationType,
      ayahCount: s.numberOfAyahs,
    }));
  },

  async getSurah(number: number, editions: string[] = ['quran-uthmani', 'en.sahih', 'ur.jalandhry']): Promise<SurahDetail> {
    const editionsParam = editions.join(',');
    const res: ApiResponse<any[]> = await fetchWithTimeout(`${BASE_URL}/surah/${number}/editions/${editionsParam}`);
    
    // The API returns an array of edition objects
    const [arabic, english, urdu] = res.data;
    if (!arabic) throw new Error('Arabic edition missing from API response');
    
    const surahInfo: Surah = {
      number: arabic.number,
      nameArabic: arabic.name,
      nameEnglish: arabic.englishName,
      nameUrdu: urdu?.name ?? arabic.name,
      meaningEnglish: arabic.englishNameTranslation,
      revelationType: arabic.revelationType,
      ayahCount: arabic.numberOfAyahs,
    };
    
    // Map ayahs with translations properly
    const ayahs: Ayah[] = arabic.ayahs.map((a: any, idx: number) => ({
      number: a.number,
      surahNumber: number,
      ayahNumber: a.numberInSurah,
      textArabic: a.text,
      textEnglish: english?.ayahs?.[idx]?.text ?? '',
      textUrdu: urdu?.ayahs?.[idx]?.text ?? '',
    }));
    
    return {
      ...surahInfo,
      ayahs,
    };
  },

  async getAyah(surah: number, ayah: number, edition: string = 'quran-uthmani'): Promise<Ayah> {
    const data: ApiResponse<Ayah> = await fetchWithTimeout(`${BASE_URL}/ayah/${surah}:${ayah}/${edition}`);
    return data.data;
  },

  async getJuz(number: number): Promise<Juz> {
    const data: ApiResponse<Juz> = await fetchWithTimeout(`${BASE_URL}/juz/${number}/quran-uthmani`);
    return data.data;
  },

  getAudioUrl(ayahIdentifier: string, reciter: string = 'ar.alafasy'): string {
    return `https://cdn.islamic.network/quran/audio/128/${reciter}/${ayahIdentifier}.mp3`;
  },

  async getReciters(): Promise<Reciter[]> {
    const data: ApiResponse<Reciter[]> = await fetchWithTimeout(`${BASE_URL}/reciters`);
    return data.data;
  },
};
