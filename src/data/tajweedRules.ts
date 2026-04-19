// Tajweed Rules - definitions and highlighting patterns
export const TAJWEED_RULES = [
  {
    id: 'noon-sakin',
    name: 'Noon Sakinah / Tanween',
    arabic: 'نون ساكنة / تنوين',
    definition: 'A noon or tanween that is followed by one of the 15 letters of the moon (excluding the sun letters). It is pronounced with ghunnah (nasal sound) for 2 beats.',
    letters: ['ي', 'و', 'ن', 'م', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ', 'ع', 'غ', 'ف', 'ق', 'ك'],
    color: 'bg-emerald-500',
  },
  {
    id: 'meem-sakin',
    name: 'Meem Sakinah',
    arabic: 'ميم ساكنة',
    definition: 'A meem that is followed by a ba. The meem is pronounced with ghunnah (nasal sound) and the ba is pronounced clearly.',
    letters: ['ب'],
    rule: 'ghunnah',
    color: 'bg-blue-500',
  },
  {
    id: 'alif-khana',
    name: 'Alif Khan',
    arabic: 'ألف خالية',
    definition: 'An alif that is not pronounced. It appears as a dagger (dagger alif) above certain letters.',
    letters: ['ٱ'],
    color: 'bg-amber-500',
  },
  {
    id: 'lam-shamsi',
    name: 'Lam Shamsi',
    arabic: 'لام شمسية',
    definition: 'The lam in "ال" when followed by a sun letter. The lam is pronounced clearly and not doubled.',
    letters: ['ت', 'ث', 'د', 'ذ', 'ر', 'ز', 'س', 'ش', 'ص', 'ض', 'ط', 'ظ', 'ل', 'ن'],
    sunLetters: true,
    color: 'bg-yellow-500',
  },
  {
    id: 'qalqala',
    name: 'Qalqalah',
    arabic: 'قلقلة',
    definition: 'A consonant that has a sukoon and is one of the 5 letters: ق ط ب ج د. It is pronounced with a slight bounce.',
    letters: ['ق', 'ط', 'ب', 'ج', 'د'],
    color: 'bg-red-500',
  },
  {
    id: 'madd',
    name: 'Madd (Prolongation)',
    arabic: 'مد',
    definition: 'Prolongation of the sound. There are different types: Madd Asli (2 beats), Madd Far i (4-5 beats), Madd Lazim (4-5 beats).',
    letters: ['ا', 'ي', 'و'],
    color: 'bg-purple-500',
  },
  {
    id: 'hamza',
    name: 'Hamzat al-Wasl',
    arabic: 'همزة الوصل',
    definition: 'A hamza that comes after an alif in certain words. It is only pronounced when the word begins with a vowel sound.',
    letters: ['ٱ', 'أ'],
    color: 'bg-cyan-500',
  },
];

// Function to highlight tajweed rules in Arabic text
export function applyTajweedHighlighting(text: string): { text: string; rule: string }[] {
  const segments: { text: string; rule: string }[] = [];
  
  // This is a simplified version - in production you'd use a proper Arabic text parser
  for (const rule of TAJWEED_RULES) {
    for (const letter of rule.letters) {
      if (text.includes(letter)) {
        segments.push({ text, rule: rule.id });
        return segments;
      }
    }
  }
  
  segments.push({ text, rule: 'none' });
  return segments;
}

// Tajweed rule selector definitions
export const TAJWEED_SETTINGS = [
  { id: 'none', name: 'None', description: 'No highlighting' },
  { id: 'noon-sakin', name: 'Noon Sakinah & Tanween', color: '#10B981' },
  { id: 'meem-sakin', name: 'Meem Sakinah', color: '#3B82F6' },
  { id: 'alif-khana', name: 'Alif Khan (Silent)', color: '#F59E0B' },
  { id: 'lam-shamsi', name: 'Lam Shamsi', color: '#EAB308' },
  { id: 'qalqala', name: 'Qalqalah', color: '#EF4444' },
  { id: 'madd', name: 'Madd (Prolongation)', color: '#8B5CF6' },
  { id: 'hamza', name: 'Hamza', color: '#06B6D4' },
  { id: 'all', name: 'All Rules', color: '#C9A84C' },
];