import { env } from '@/config/env';
import { fetchWithTimeout } from '@/utils/fetchWithTimeout';
import { HADITH_THEMES } from '@/data/hadithThemes';
import { getCanonicalBooksForCollection } from '@/data/hadithCatalog';
import { getHadithProvenance } from '@/data/hadithProvenance';
import type { HadithCollection, HadithRecord } from '@/types';

const BASE_URL = env.VITE_HADITH_API_BASE;
const HADITH_MAX_RANGE_SIZE = 300;

interface HadithApiEnvelope<T> {
  code: number;
  message: string;
  data: T;
  error?: boolean;
}

interface HadithRangeRaw {
  number: number;
  arab?: string;
  id?: string;
}

function inferThemeIds(arabic: string, translation: string): string[] {
  const corpus = `${arabic} ${translation}`.toLowerCase();

  return HADITH_THEMES
    .filter((theme) => theme.keywords.some((keyword) => corpus.includes(keyword.toLowerCase())))
    .map((theme) => theme.id);
}

function mapRangeItem(collectionId: string, item: HadithRangeRaw): HadithRecord {
  const arabic = item.arab ?? '';
  const translation = item.id ?? '';
  const themes = inferThemeIds(arabic, translation);
  const sourceBookHints = themes
    .map((themeId) => HADITH_THEMES.find((theme) => theme.id === themeId)?.source)
    .filter((source): source is string => Boolean(source));

  const canonicalBooks = getCanonicalBooksForCollection(collectionId);
  const canonicalBook = canonicalBooks.find((book) =>
    sourceBookHints.some((hint) => hint.toLowerCase().includes(book.title.toLowerCase()))
  );

  const provenance = getHadithProvenance(collectionId);

  return {
    collectionId,
    number: item.number,
    arabic,
    translation,
    translationEnglish: '',
    translationUrdu: '',
    themes,
    sourceBookHints,
    provenance: {
      ...provenance,
      sourceId: `${provenance.sourceId}:${item.number}`,
    },
    verification: {
      sourceText: Boolean(arabic),
      englishTranslation: false,
      urduTranslation: false,
      sanadMapped: false,
      rijalMapped: false,
    },
    canonicalBook: canonicalBook
      ? {
          order: canonicalBook.order,
          title: canonicalBook.title,
          arabicTitle: canonicalBook.arabicTitle,
        }
      : undefined,
  };
}

export const hadithApi = {
  async getCollections(): Promise<HadithCollection[]> {
    const res = await fetchWithTimeout<HadithApiEnvelope<Array<{ id: string; name: string; available: number }>>>(`${BASE_URL}/books`);
    return (res.data ?? []).map((item) => ({
      id: item.id,
      name: item.name,
      available: item.available,
    }));
  },

  async getHadithRange(collectionId: string, from: number, to: number): Promise<HadithRecord[]> {
    const safeFrom = Math.max(1, Math.floor(from));
    const safeTo = Math.max(safeFrom, Math.floor(to));
    const clampedTo = Math.min(safeTo, safeFrom + HADITH_MAX_RANGE_SIZE - 1);
    const range = `${safeFrom}-${clampedTo}`;
    const res = await fetchWithTimeout<HadithApiEnvelope<{ hadiths: HadithRangeRaw[] }>>(
      `${BASE_URL}/books/${collectionId}?range=${range}`
    );

    const hadiths = res.data?.hadiths ?? [];
    return hadiths.map((item) => mapRangeItem(collectionId, item));
  },

  async getHadithDetail(collectionId: string, number: number): Promise<HadithRecord> {
    const res = await fetchWithTimeout<HadithApiEnvelope<{ contents: HadithRangeRaw }>>(
      `${BASE_URL}/books/${collectionId}/${number}`
    );

    return mapRangeItem(collectionId, res.data.contents);
  },

  async loadSearchWindow(collectionId: string, maxRecords: number = 800): Promise<HadithRecord[]> {
    const target = Math.max(1, Math.floor(maxRecords));
    const chunks: Array<Promise<HadithRecord[]>> = [];

    for (let start = 1; start <= target; start += HADITH_MAX_RANGE_SIZE) {
      const end = Math.min(start + HADITH_MAX_RANGE_SIZE - 1, target);
      chunks.push(this.getHadithRange(collectionId, start, end));
    }

    const settled = await Promise.allSettled(chunks);
    const records: HadithRecord[] = [];

    for (const part of settled) {
      if (part.status === 'fulfilled') {
        records.push(...part.value);
      }
    }

    return records;
  },
};