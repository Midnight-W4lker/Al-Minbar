import { findThemesByQuery } from '@/data/hadithThemes';
import type { HadithRecord, HadithSearchResult } from '@/types';

const TOKEN_SPLIT_REGEX = /[^a-z0-9\u0600-\u06FF]+/i;

function normalize(text: string): string {
  return text.toLowerCase().trim();
}

function tokenize(text: string): string[] {
  return normalize(text)
    .split(TOKEN_SPLIT_REGEX)
    .map((token) => token.trim())
    .filter(Boolean);
}

function buildQueryContext(query: string) {
  const normalized = normalize(query);
  const numberQuery = normalized.match(/^#?(\d+)$/)?.[1];

  return {
    normalized,
    numberQuery: numberQuery ? Number(numberQuery) : null,
    tokens: tokenize(normalized),
    matchedThemes: findThemesByQuery(normalized),
  };
}

export function searchHadithRecords(records: HadithRecord[], query: string): HadithSearchResult[] {
  const ctx = buildQueryContext(query);

  if (!ctx.normalized) {
    return records.slice(0, 100).map((record) => ({ record, score: 0, reasons: ['default-window'] }));
  }

  const results: HadithSearchResult[] = [];

  for (const record of records) {
    let score = 0;
    const reasons: string[] = [];

    if (ctx.numberQuery !== null && record.number === ctx.numberQuery) {
      score += 100;
      reasons.push('hadith-number');
    }

    const translationCorpus = [
      record.translation,
      record.translationEnglish ?? '',
      record.translationUrdu ?? '',
    ]
      .join(' ')
      .toLowerCase();

    for (const token of ctx.tokens) {
      if (String(record.number) === token) {
        score += 70;
        reasons.push('number-token');
      }

      if (translationCorpus.includes(token)) {
        score += 5;
        reasons.push('translation-match');
      }

      if (record.arabic.includes(token)) {
        score += 6;
        reasons.push('arabic-match');
      }
    }

    const themeMatched = ctx.matchedThemes.some((theme) => record.themes.includes(theme.id));
    if (themeMatched) {
      score += 40;
      reasons.push('theme-match');
    }

    if (score > 0) {
      results.push({ record, score, reasons: Array.from(new Set(reasons)) });
    }
  }

  return results.sort((a, b) => b.score - a.score).slice(0, 100);
}


