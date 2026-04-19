export interface HarfEntry {
  letter: string;
  transliteration: string;
  name: string;
  category: 'shamsi' | 'qamari' | 'other';
  makhraj: string;
}

export interface GrammarRule {
  id: string;
  title: string;
  summary: string;
  example: string;
}

export interface TajweedQaidah {
  id: string;
  title: string;
  summary: string;
  minimumBeats?: number;
}

export interface RijalText {
  title: string;
  author: string;
  centuryHijri: string;
  focus: string;
}

export interface WordBreakdown {
  normalizedWord: string;
  root: string;
  partOfSpeech: string;
  gloss: string;
  pattern: string;
  notes: string;
}

export const ARABIC_HURUF: HarfEntry[] = [
  { letter: 'ا', transliteration: 'a', name: 'Alif', category: 'other', makhraj: 'Al-Jawf' },
  { letter: 'ب', transliteration: 'b', name: 'Ba', category: 'other', makhraj: 'Ash-Shafatan' },
  { letter: 'ت', transliteration: 't', name: 'Ta', category: 'shamsi', makhraj: 'Tip of tongue' },
  { letter: 'ث', transliteration: 'th', name: 'Tha', category: 'shamsi', makhraj: 'Tip of tongue with upper teeth' },
  { letter: 'ج', transliteration: 'j', name: 'Jim', category: 'other', makhraj: 'Middle of tongue' },
  { letter: 'ح', transliteration: 'h', name: 'Ha', category: 'other', makhraj: 'Middle throat' },
  { letter: 'خ', transliteration: 'kh', name: 'Kha', category: 'other', makhraj: 'Upper throat' },
  { letter: 'د', transliteration: 'd', name: 'Dal', category: 'shamsi', makhraj: 'Tip of tongue' },
  { letter: 'ذ', transliteration: 'dh', name: 'Dhal', category: 'shamsi', makhraj: 'Tip of tongue with upper teeth' },
  { letter: 'ر', transliteration: 'r', name: 'Ra', category: 'shamsi', makhraj: 'Tip of tongue near upper gum' },
  { letter: 'ز', transliteration: 'z', name: 'Zay', category: 'shamsi', makhraj: 'Tip of tongue near upper teeth' },
  { letter: 'س', transliteration: 's', name: 'Sin', category: 'shamsi', makhraj: 'Tip of tongue near upper teeth' },
  { letter: 'ش', transliteration: 'sh', name: 'Shin', category: 'shamsi', makhraj: 'Middle of tongue' },
  { letter: 'ص', transliteration: 's', name: 'Sad', category: 'shamsi', makhraj: 'Tip of tongue near upper teeth' },
  { letter: 'ض', transliteration: 'd', name: 'Dad', category: 'shamsi', makhraj: 'Side of tongue' },
  { letter: 'ط', transliteration: 't', name: 'Ta (heavy)', category: 'shamsi', makhraj: 'Tip of tongue with upper gum' },
  { letter: 'ظ', transliteration: 'z', name: 'Za', category: 'shamsi', makhraj: 'Tip of tongue with upper teeth' },
  { letter: 'ع', transliteration: 'a', name: 'Ayn', category: 'other', makhraj: 'Middle throat' },
  { letter: 'غ', transliteration: 'gh', name: 'Ghayn', category: 'other', makhraj: 'Upper throat' },
  { letter: 'ف', transliteration: 'f', name: 'Fa', category: 'other', makhraj: 'Lower lip with upper teeth' },
  { letter: 'ق', transliteration: 'q', name: 'Qaf', category: 'other', makhraj: 'Deep tongue with soft palate' },
  { letter: 'ك', transliteration: 'k', name: 'Kaf', category: 'other', makhraj: 'Back of tongue' },
  { letter: 'ل', transliteration: 'l', name: 'Lam', category: 'shamsi', makhraj: 'Tip edges of tongue' },
  { letter: 'م', transliteration: 'm', name: 'Mim', category: 'other', makhraj: 'Ash-Shafatan' },
  { letter: 'ن', transliteration: 'n', name: 'Nun', category: 'shamsi', makhraj: 'Tip of tongue with nasal cavity' },
  { letter: 'ه', transliteration: 'h', name: 'Ha', category: 'other', makhraj: 'Lower throat' },
  { letter: 'و', transliteration: 'w', name: 'Waw', category: 'other', makhraj: 'Ash-Shafatan' },
  { letter: 'ي', transliteration: 'y', name: 'Ya', category: 'other', makhraj: 'Middle of tongue' },
];

export const GRAMMAR_QAWAID: GrammarRule[] = [
  { id: 'ism', title: 'Ism (Noun)', summary: 'Names a person, thing, place, or concept.', example: 'اللَّهِ' },
  { id: 'fi-l', title: "Fi'l (Verb)", summary: 'Indicates an action linked to tense.', example: 'نَعْبُدُ' },
  { id: 'harf', title: 'Harf (Particle)', summary: 'Connective or functional word affecting grammar.', example: 'بِ' },
  { id: 'mudaf', title: 'Idafah (Possessive)', summary: 'Construct phrase showing ownership or relation.', example: 'رَبِّ الْعَالَمِينَ' },
  { id: 'jar-majrur', title: 'Jar wa Majrur', summary: 'Preposition with genitive noun phrase.', example: 'بِسْمِ اللَّهِ' },
  { id: 'nakirah-marifah', title: "Nakirah / Ma'rifah", summary: 'Indefinite vs. definite nouns.', example: 'الْكِتَابُ' },
  { id: 'jumlah-ismiyyah', title: 'Jumlah Ismiyyah', summary: 'Nominal sentence starting with a noun.', example: 'اللَّهُ غَفُورٌ' },
  { id: 'jumlah-filiyyah', title: "Jumlah Fi'liyyah", summary: 'Verbal sentence starting with a verb.', example: 'قَالَ رَبِّ' },
  { id: 'fa-il', title: "Fa'il (Doer)", summary: 'Subject performing an action.', example: 'اللَّهُ يَعْلَمُ' },
  { id: 'maf-ul', title: "Maf'ul (Object)", summary: 'Entity receiving an action.', example: 'اهْدِنَا الصِّرَاطَ' },
  { id: 'na-t', title: "Na't (Adjective)", summary: 'Describes a noun and matches its form.', example: 'الصِّرَاطَ الْمُسْتَقِيمَ' },
  { id: 'badal', title: 'Badal', summary: 'Appositional substitute term clarifying prior noun.', example: 'صِرَاطَ الَّذِينَ' },
];

export const TAJWEED_QAWAID: TajweedQaidah[] = [
  { id: 'izhar', title: 'Izhar', summary: 'Noon sakin or tanween pronounced clearly before throat letters.' },
  { id: 'idgham', title: 'Idgham', summary: 'Merging of noon sakin or tanween into following letters.' },
  { id: 'iqlab', title: 'Iqlab', summary: 'Noon sakin/tanween changes to mim before ba with ghunnah.' },
  { id: 'ikhfa', title: 'Ikhfa', summary: 'Partial concealment of noon sakin or tanween with ghunnah.' },
  { id: 'qalqala', title: 'Qalqalah', summary: 'Echoing bounce on ق ط ب ج د with sukun.' },
  { id: 'madd-asli', title: 'Madd Asli', summary: 'Natural elongation of 2 beats.', minimumBeats: 2 },
  { id: 'madd-fari', title: "Madd Far'i", summary: 'Secondary elongation usually 4-5 beats.', minimumBeats: 4 },
  { id: 'ghunnah', title: 'Ghunnah', summary: 'Nasalization held for about 2 beats.', minimumBeats: 2 },
  { id: 'lam-shamsiyyah', title: 'Lam Shamsiyyah', summary: 'Lam of definite article merges into sun letters.' },
  { id: 'lam-qamariyyah', title: 'Lam Qamariyyah', summary: 'Lam of definite article pronounced before moon letters.' },
];

export const RIJAL_TEXTS: RijalText[] = [
  { title: 'Tahdhib al-Kamal', author: 'Al-Mizzi', centuryHijri: '8th', focus: 'Biographical evaluation of narrators' },
  { title: 'Tahdhib al-Tahdhib', author: 'Ibn Hajar al-Asqalani', centuryHijri: '9th', focus: 'Condensed narrator criticism and praise' },
  { title: 'Taqrib al-Tahdhib', author: 'Ibn Hajar al-Asqalani', centuryHijri: '9th', focus: 'Short-status grading of narrators' },
  { title: 'Al-Jarh wa al-Ta-dil', author: 'Ibn Abi Hatim', centuryHijri: '4th', focus: 'Narrator reliability assessment' },
  { title: 'Al-Kamil fi Duafa al-Rijal', author: 'Ibn Adi', centuryHijri: '4th', focus: 'Weak narrators and report analysis' },
  { title: 'Mizan al-Itidal', author: 'Al-Dhahabi', centuryHijri: '8th', focus: 'Critical biographical judgments' },
  { title: 'Siyar A-lam al-Nubala', author: 'Al-Dhahabi', centuryHijri: '8th', focus: 'Historical biographies of scholars and narrators' },
  { title: 'Lisan al-Mizan', author: 'Ibn Hajar al-Asqalani', centuryHijri: '9th', focus: 'Supplementary narrator criticism corpus' },
];

const WORD_BREAKDOWN_DICTIONARY: Record<string, WordBreakdown> = {
  بسم: {
    normalizedWord: 'بسم',
    root: 'س م و',
    partOfSpeech: 'Preposition + Noun',
    gloss: 'In the name',
    pattern: 'bi + ism',
    notes: 'Common opening phrase; orthography may omit alif in connected script.',
  },
  الله: {
    normalizedWord: 'الله',
    root: 'ا ل ه',
    partOfSpeech: 'Proper Noun',
    gloss: 'Allah',
    pattern: 'Divine proper name',
    notes: 'Kept exactly as in Quranic script; no normalization in display text.',
  },
  الرحمن: {
    normalizedWord: 'الرحمن',
    root: 'ر ح م',
    partOfSpeech: 'Noun (Divine Name)',
    gloss: 'The Entirely Merciful',
    pattern: "fa'lan intensive form",
    notes: 'Indicates encompassing mercy.',
  },
  الرحيم: {
    normalizedWord: 'الرحيم',
    root: 'ر ح م',
    partOfSpeech: 'Noun (Divine Name)',
    gloss: 'The Especially Merciful',
    pattern: "fa'il pattern",
    notes: 'Indicates continuous and specific mercy.',
  },
};

const ARABIC_DIACRITICS_REGEX = /[\u064B-\u065F\u0670\u0640]/g;
const ARABIC_PUNCTUATION_REGEX = /[۞۩،؛؟.!,:'"()\[\]{}]/g;

export function normalizeArabicForLookup(word: string): string {
  return word
    .replace(ARABIC_DIACRITICS_REGEX, '')
    .replace(ARABIC_PUNCTUATION_REGEX, '')
    .trim();
}

export function splitArabicWords(text: string): string[] {
  return text.split(/\s+/).filter(Boolean);
}

export function getWordBreakdown(word: string): WordBreakdown {
  const normalizedWord = normalizeArabicForLookup(word);
  const fromDictionary = WORD_BREAKDOWN_DICTIONARY[normalizedWord];

  if (fromDictionary) {
    return fromDictionary;
  }

  return {
    normalizedWord,
    root: 'Not yet mapped',
    partOfSpeech: 'Needs lexical mapping',
    gloss: 'Reference entry pending',
    pattern: 'Pattern extraction pending',
    notes: 'Displayed text remains unchanged; this is a metadata placeholder.',
  };
}

