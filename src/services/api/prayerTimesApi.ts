import { env } from '@/config/env';
import { fetchWithTimeout } from '@/utils/fetchWithTimeout';
import type { PrayerTimesResponse, HijriDate } from '@/types';

const BASE_URL = env.VITE_ALADHAN_API_BASE;

function formatDateForApi(date: Date) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

export const prayerTimesApi = {
  async getPrayerTimes(date: Date, latitude: number, longitude: number, method: number = 1) {
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      throw new Error('Invalid coordinates for prayer times request.');
    }

    const dateStr = formatDateForApi(date);
    
    const res = await fetchWithTimeout<{ code: number; data: { timings: PrayerTimesResponse; meta: any; date: { hijri: HijriDate } } }>(
      `${BASE_URL}/timings/${dateStr}?latitude=${latitude}&longitude=${longitude}&method=${method}`
    );
    return res.data;
  },

  async getHijriDate(date: Date = new Date()) {
    const dateStr = formatDateForApi(date);
    
    const res = await fetchWithTimeout<{ code: number; data: { hijri: HijriDate } }>(`${BASE_URL}/gToH/${dateStr}`);
    return res.data.hijri;
  },

  async getMonthlyCalendar(year: number, month: number, latitude: number, longitude: number) {
    const data = await fetchWithTimeout<any>(
      `${BASE_URL}/calendar/${year}/${month}?latitude=${latitude}&longitude=${longitude}`
    );
    return data;
  },
};