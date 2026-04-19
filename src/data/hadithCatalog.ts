import type { HadithBookMeta } from '@/types';

export const HADITH_COLLECTION_DISPLAY: Record<string, { english: string; arabic: string; color: string }> = {
  bukhari: { english: 'Sahih al-Bukhari', arabic: 'صحيح البخاري', color: 'emerald' },
  muslim: { english: 'Sahih Muslim', arabic: 'صحيح مسلم', color: 'blue' },
  'abu-daud': { english: 'Sunan Abu Dawud', arabic: 'سنن أبي داود', color: 'amber' },
  tirmidzi: { english: "Jami' at-Tirmidhi", arabic: 'جامع الترمذي', color: 'purple' },
  nasai: { english: "Sunan an-Nasa'i", arabic: 'سنن النسائي', color: 'cyan' },
  'ibnu-majah': { english: 'Sunan Ibn Majah', arabic: 'سنن ابن ماجه', color: 'rose' },
  ahmad: { english: 'Musnad Ahmad', arabic: 'مسند أحمد', color: 'fuchsia' },
};

// Canonical Bukhari kitab order for hierarchical browsing.
export const BUKHARI_CANONICAL_BOOKS: HadithBookMeta[] = [
  { collectionId: 'bukhari', order: 1, title: 'Revelation', arabicTitle: 'بدء الوحي', sourceReference: 'Sahih al-Bukhari kitab index' },
  { collectionId: 'bukhari', order: 2, title: 'Faith', arabicTitle: 'الإيمان', sourceReference: 'Sahih al-Bukhari kitab index' },
  { collectionId: 'bukhari', order: 3, title: 'Knowledge', arabicTitle: 'العلم', sourceReference: 'Sahih al-Bukhari kitab index' },
  { collectionId: 'bukhari', order: 4, title: 'Ablution', arabicTitle: 'الوضوء', sourceReference: 'Sahih al-Bukhari kitab index' },
  { collectionId: 'bukhari', order: 5, title: 'Prayer', arabicTitle: 'الصلاة', sourceReference: 'Sahih al-Bukhari kitab index' },
  { collectionId: 'bukhari', order: 6, title: 'Friday Prayer', arabicTitle: 'الجمعة', sourceReference: 'Sahih al-Bukhari kitab index' },
  { collectionId: 'bukhari', order: 7, title: 'Zakat', arabicTitle: 'الزكاة', sourceReference: 'Sahih al-Bukhari kitab index' },
  { collectionId: 'bukhari', order: 8, title: 'Fasting', arabicTitle: 'الصوم', sourceReference: 'Sahih al-Bukhari kitab index' },
  { collectionId: 'bukhari', order: 9, title: 'Hajj', arabicTitle: 'الحج', sourceReference: 'Sahih al-Bukhari kitab index' },
  { collectionId: 'bukhari', order: 10, title: 'Transactions', arabicTitle: 'البيوع', sourceReference: 'Sahih al-Bukhari kitab index' },
  { collectionId: 'bukhari', order: 11, title: 'Marriage', arabicTitle: 'النكاح', sourceReference: 'Sahih al-Bukhari kitab index' },
  { collectionId: 'bukhari', order: 12, title: 'Food', arabicTitle: 'الأطعمة', sourceReference: 'Sahih al-Bukhari kitab index' },
  { collectionId: 'bukhari', order: 13, title: 'Medicine', arabicTitle: 'الطب', sourceReference: 'Sahih al-Bukhari kitab index' },
  { collectionId: 'bukhari', order: 14, title: 'Good Manners', arabicTitle: 'الأدب', sourceReference: 'Sahih al-Bukhari kitab index' },
  { collectionId: 'bukhari', order: 15, title: 'Tawhid', arabicTitle: 'التوحيد', sourceReference: 'Sahih al-Bukhari kitab index' },
];

export function getCanonicalBooksForCollection(collectionId: string): HadithBookMeta[] {
  if (collectionId === 'bukhari') {
    return BUKHARI_CANONICAL_BOOKS;
  }

  return [];
}


