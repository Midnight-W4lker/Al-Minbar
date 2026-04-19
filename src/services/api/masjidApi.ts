import { env } from '@/config/env';
import { fetchWithTimeout } from '@/utils/fetchWithTimeout';
import { MASJID_FALLBACK_DATA } from '@/data/masjidFallback';
import type { Masjid } from '@/types';

const BASE_URL = env.VITE_MOSQUES_API_BASE;
const KNOWN_UNSUPPORTED_BROWSER_BASE = 'https://api.mosques.app/v1';

export const masjidApi = {
  async searchNearby(lat: number, lng: number, radius: number = 5000) {
    const fallback = MASJID_FALLBACK_DATA.map((masjid) => ({
      ...masjid,
      tags: Array.from(new Set([...masjid.tags, 'Offline Source'])),
    }));

    // This endpoint currently returns 404 HTML and fails CORS from browser; avoid noisy retries.
    if (BASE_URL === KNOWN_UNSUPPORTED_BROWSER_BASE) {
      return fallback;
    }

    try {
      const data = await fetchWithTimeout<{ results?: Masjid[] }>(
        `${BASE_URL}/search?lat=${lat}&lng=${lng}&radius=${radius}`
      );

      if (!data.results || data.results.length === 0) {
        return fallback;
      }

      return data.results as Masjid[];
    } catch {
      return fallback;
    }
  },

  async getDetails(masjidId: string) {
    const data = await fetchWithTimeout<Masjid>(`${BASE_URL}/masjid/${masjidId}`);
    return data as Masjid;
  },
};