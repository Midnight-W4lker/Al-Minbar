# Al-Minbar Execution Roadmap

## Objective

Deliver a trustworthy, reverent, fast Islamic super app that preserves sacred text integrity while improving usability, search, and AI guidance.

## Guiding Constraints

- Quran text stays immutable.
- Hadith text stays immutable.
- Any enrichment must be metadata-only.
- Anything unverified must be clearly labeled.
- Incomplete features must be marked as beta.

## Phase 1 - Trust & Provenance Hardening

### Goals

- Make provenance visible in all trust-sensitive surfaces.
- Keep verified-only mode on by default.
- Prevent the UI from implying completeness where there is none.

### Tasks

1. Surface `sourceOfTruth` and provenance badges in Hadith theme/result views.
2. Keep sanad/rijal mapping explicitly marked as planned unless verified corpus IDs exist.
3. Add trust badges to Quran study overlays only when source-backed.
4. Extend settings with provenance visibility defaults and trust toggles.

### Files

- `src/routes/pages/HadithPage.tsx`
- `src/data/hadithThemes.ts`
- `src/services/api/hadithApi.ts`
- `src/store/useSettingsStore.ts`
- `src/routes/pages/SettingsPage.tsx`

## Phase 2 - Canonical Ordering & Retrieval

### Goals

- Expand canonical book ordering across collections.
- Keep search deterministic and explainable.

### Tasks

1. Add canonical kitab mappings for Muslim and other collections.
2. Connect retrieval cards to canonical book order.
3. Keep ranking formula deterministic and documented.
4. Add language-aware search across Arabic, English, and Urdu fields.

### Files

- `src/data/hadithCatalog.ts`
- `src/services/hadithSearch.ts`
- `src/routes/pages/HadithPage.tsx`
- `src/services/api/hadithApi.ts`

## Phase 3 - Quran Word Anatomy Expansion

### Goals

- Improve token-aware Quran overlays.
- Expand morphology, grammar, and lexicon coverage.

### Tasks

1. Replace character-level tajweed logic with token-aware segmentation.
2. Expand the word breakdown dictionary into a larger lexicon.
3. Add confidence and provenance labels to derived metadata.
4. Keep Quran source text untouched.

### Files

- `src/routes/pages/QuranPage.tsx`
- `src/data/quranStudyLibrary.ts`
- `src/data/tajweedRules.ts`

## Phase 4 - Noor AI Grounding & Quantization

### Goals

- Keep Noor AI citation-first and humble.
- Improve retrieval grounding before generation.

### Tasks

1. Add a retrieval layer for Quran/Hadith snippets before model generation.
2. Keep system instructions strict about uncertainty and fatwa boundaries.
3. Document Ollama quantization trade-offs for local devices.
4. Add graceful fallback when local AI is unavailable.

### Files

- `src/services/ollamaService.ts`
- `src/routes/pages/AICompanionPage.tsx`
- `ARCHITECTURE_DEEP_DIVE.md`

## Phase 5 - UI Rhythm & Feature Flags

### Goals

- Prevent incomplete modules from breaking the app rhythm.
- Make beta/incomplete areas visible and intentional.

### Tasks

1. Keep route gating centralized.
2. Keep mobile navigation and sidebar labels synchronized.
3. Ensure loading/empty/error states stay consistent.
4. Refine accessibility and spacing across primary journeys.

### Files

- `src/config/env.ts`
- `src/routes/index.tsx`
- `src/components/layout/Sidebar.tsx`
- `src/components/layout/MobileNav.tsx`
- `src/routes/pages/DashboardPage.tsx`

## Initial Success Criteria

- No sacred text is altered in rendering.
- No unverified sanad/rijal linkage is implied.
- Provenance is visible where it matters.
- Beta areas are clearly labeled.
- Search and retrieval remain fast and explainable.
- The UI remains calm and readable on mobile and desktop.

## Start Here

1. Add provenance visibility to Hadith theme chips/results.
2. Expand canonical ordering beyond Bukhari.
3. Add token-aware Quran study overlay design.

