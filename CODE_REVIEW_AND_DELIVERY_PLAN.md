# Code Review and Delivery Plan (April 2026)

## Review Scope

This review focuses on critical user journeys and trust-sensitive religious content:

1. Quran reading integrity and tajweed overlays
2. Hadith collection hierarchy, retrieval, and metadata trust
3. Masjid discovery reliability
4. Feature gating and rhythm of navigation flows
5. Data provenance and display transparency

## Critical Findings

### P0 - Religious metadata trust gap in Hadith presentation

- The app currently shows generated/inferred metadata that may be interpreted as canonical classification.
- Mitigation already applied: explicit wording in UI that sanad/rijal linkage is not fully mapped.
- Required next step: only expose verified sanad/rijal chains from curated corpora with source IDs.

### P0 - Incomplete Hadith translation requirements

- Current source endpoint payload does not provide full English+Urdu pairs across all records.
- The app must not imply language completeness until a verified multilingual corpus is integrated.
- Required next step: add language-specific providers with provenance per hadith.

### P1 - Quran study anatomy is partial

- Word-breakdown dictionary is currently a seed dataset and not exhaustive.
- Required next step: lexicon expansion pipeline with root, pattern, POS, and source references.

### P1 - Masjid endpoint reliability

- The configured endpoint currently returns 404/CORS issues for browser usage.
- Mitigation already applied: fallback dataset and graceful degrade behavior.
- Required next step: server-side proxy or provider replacement with browser-safe endpoint.

### P1 - Canonical order breadth

- Canonical book ordering is curated for Bukhari first and not yet expanded uniformly.
- Required next step: add canonical ordering tables collection-by-collection from verified bibliographic sources.

## What Has Been Implemented Already

1. Hadith range chunking and clamping to API max request size
2. Hierarchical hadith page with retrieval search (number/context/theme)
3. Quran overlay panel (tajweed, grammar, huruf, references)
4. Quran tajweed underline color logic upgraded to deterministic hex mapping
5. Masjid finder fallback strategy to keep UX responsive

## Delivery Plan (Execution Steps)

### Phase 1 - Trust and Source Integrity (Immediate)

1. Add `sourceOfTruth` metadata to each hadith record and theme mapping.
2. Add a strict "verified only" toggle (default on).
3. Hide unverifiable sanad/rijal fields from primary cards.
4. Add user-visible provenance badges in hadith detail.

### Phase 2 - Hadith Canonical Structuring

1. Create `hadithBookIndex` dataset per collection with canonical book order.
2. Map hadith number ranges to book IDs where source allows.
3. Add hierarchical navigation: Collection -> Book -> Hadith.
4. Add deterministic formatting template for Arabic + translations + references.

### Phase 3 - Multilingual Hadith

1. Integrate English and Urdu sources with stable IDs.
2. Add conflict handling when translations differ by edition.
3. Add language switch in hadith detail.
4. Add citation footer with provider + edition identifiers.

### Phase 4 - Quran Word Anatomy Expansion

1. Replace static dictionary with indexed lexicon file(s).
2. Add token-level morphology attributes and confidence level.
3. Add right-to-left word drill-down panel with references.
4. Cache morphology lookups for smooth interactions.

### Phase 5 - Feature Rhythm and Flags

1. Add centralized feature-flag config with environment overrides.
2. Move incomplete sections behind explicit "beta" labels.
3. Add route-level loading and empty-state consistency pass.
4. Add accessibility and contrast validation for Quran/Hadith color usage.

## Acceptance Criteria for "Complete" Status

- All displayed hadith metadata has explicit provenance and source IDs.
- Canonical ordering exists for each enabled collection.
- Hadith detail supports Arabic + verified English + verified Urdu.
- Quran word breakdown coverage exceeds 95% of rendered tokens in enabled surahs.
- No major flow fails hard under endpoint/network failure.

## Notes

- Text integrity rule: Quran and hadith source text must remain immutable in rendering paths.
- Any enrichment must be attached as metadata overlays, never text mutation.

## Implementation Progress (Applied)

- Added hadith provenance and verification metadata into `HadithRecord` and API mapping.
- Added hadith trust controls to persisted settings (`verifiedOnly`, `showProvenance`).
- Updated hadith detail formatting to separate Arabic, English, Urdu, and provider translation streams.
- Added provenance badge block in hadith detail (provider, edition, source ID, language coverage).
- Added centralized feature flags and beta labeling through config exports and navigation usage.
- Added route-level feature gating redirects for disabled modules.
- Improved Quran tajweed color rendering reliability with deterministic hex color mapping.
- Added hadith theme `sourceOfTruth` metadata for auditable thematic labels.
- Added canonical-book filter controls in hadith retrieval list.
- Removed duplicate hadith item in mobile more menu and improved overlay click behavior.



