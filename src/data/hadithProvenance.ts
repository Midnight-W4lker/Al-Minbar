import type { HadithProvenance } from '@/types';

const DEFAULT_PROVENANCE: HadithProvenance = {
  provider: 'Hadith Gading API',
  endpoint: 'https://api.hadith.gading.dev/books',
  sourceId: 'gading-default',
  edition: 'provider-default',
  languageCoverage: ['arabic', 'indonesian'],
};

const COLLECTION_PROVENANCE: Record<string, HadithProvenance> = {
  bukhari: {
    provider: 'Hadith Gading API',
    endpoint: 'https://api.hadith.gading.dev/books/bukhari',
    sourceId: 'gading-bukhari',
    edition: 'Sahih al-Bukhari (provider stream)',
    languageCoverage: ['arabic', 'indonesian'],
  },
  muslim: {
    provider: 'Hadith Gading API',
    endpoint: 'https://api.hadith.gading.dev/books/muslim',
    sourceId: 'gading-muslim',
    edition: 'Sahih Muslim (provider stream)',
    languageCoverage: ['arabic', 'indonesian'],
  },
};

export function getHadithProvenance(collectionId: string): HadithProvenance {
  return COLLECTION_PROVENANCE[collectionId] ?? DEFAULT_PROVENANCE;
}

