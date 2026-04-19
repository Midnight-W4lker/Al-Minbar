import type { HadithTheme } from '@/types';

// Theme labels are tied to canonical kitab headings, not generated ad-hoc.
export const HADITH_THEMES: HadithTheme[] = [
  {
    id: 'bukhari-faith',
    label: 'Faith (Iman)',
    source: 'Sahih al-Bukhari - Kitab al-Iman',
    sourceOfTruth: 'Sahih al-Bukhari kitab headings',
    keywords: ['faith', 'iman', 'belief', 'islam', 'deen', 'beliefs'],
  },
  {
    id: 'bukhari-prayer',
    label: 'Prayer (Salah)',
    source: 'Sahih al-Bukhari - Kitab al-Salah',
    sourceOfTruth: 'Sahih al-Bukhari kitab headings',
    keywords: ['prayer', 'salah', 'salat', 'masjid', 'adhan', 'imam'],
  },
  {
    id: 'bukhari-zakat',
    label: 'Zakat',
    source: 'Sahih al-Bukhari - Kitab al-Zakah',
    sourceOfTruth: 'Sahih al-Bukhari kitab headings',
    keywords: ['zakat', 'charity', 'sadaqah', 'wealth', 'poor'],
  },
  {
    id: 'bukhari-fasting',
    label: 'Fasting (Sawm)',
    source: 'Sahih al-Bukhari - Kitab al-Sawm',
    sourceOfTruth: 'Sahih al-Bukhari kitab headings',
    keywords: ['fasting', 'sawm', 'ramadan', 'iftar', 'suhoor'],
  },
  {
    id: 'bukhari-hajj',
    label: 'Hajj and Umrah',
    source: 'Sahih al-Bukhari - Kitab al-Hajj',
    sourceOfTruth: 'Sahih al-Bukhari kitab headings',
    keywords: ['hajj', 'umrah', 'tawaf', 'mina', 'arafah', 'ihram'],
  },
  {
    id: 'bukhari-marriage',
    label: 'Marriage',
    source: 'Sahih al-Bukhari - Kitab al-Nikah',
    sourceOfTruth: 'Sahih al-Bukhari kitab headings',
    keywords: ['marriage', 'nikah', 'family', 'spouse', 'husband', 'wife'],
  },
  {
    id: 'bukhari-manners',
    label: 'Good Manners (Adab)',
    source: 'Sahih al-Bukhari - Kitab al-Adab',
    sourceOfTruth: 'Sahih al-Bukhari kitab headings',
    keywords: ['manners', 'adab', 'character', 'akhlaq', 'kindness'],
  },
  {
    id: 'bukhari-tawhid',
    label: 'Tawhid',
    source: 'Sahih al-Bukhari - Kitab al-Tawhid',
    sourceOfTruth: 'Sahih al-Bukhari kitab headings',
    keywords: ['tawhid', 'allah', 'attributes', 'oneness', 'aqeedah'],
  },
];

export function findThemesByQuery(query: string): HadithTheme[] {
  const normalized = query.toLowerCase().trim();
  if (!normalized) return [];

  return HADITH_THEMES.filter((theme) => {
    if (theme.label.toLowerCase().includes(normalized)) return true;
    return theme.keywords.some((kw) => kw.includes(normalized));
  });
}


