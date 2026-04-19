# Al-Minbar Architecture Deep Dive

## Purpose

This document turns the current Al-Minbar codebase into a clear product and engineering blueprint. The goal is not just to add features, but to ensure the app serves its people with:

- trustable religious text handling
- smooth navigation rhythm
- useful search and retrieval
- respectful AI assistance
- mobile-first usability
- graceful degradation when APIs fail

## Non-Negotiable Integrity Rules

1. **Quran text is immutable**
   - Source text must never be rewritten, normalized for display in a way that changes meaning, or replaced by generated text.
   - All tajweed, morphology, grammar, and lexical information must be overlays or metadata.

2. **Hadith text is immutable**
   - Arabic source, translation payloads, and references must remain distinct fields.
   - No sanad, rijal, or thematic claim may be fabricated.

3. **Everything not verified must be labeled**
   - If provenance is incomplete, say so.
   - If a mapping is inferred rather than authoritative, mark it as inferred.

4. **The UI must preserve reverence and clarity**
   - No noisy overlays.
   - No conflicting states.
   - No hidden fallbacks masquerading as canonical data.

## Current Architecture Map

The current app is already organized into a sensible layered structure:

- `src/App.tsx` — root composition
- `src/routes/index.tsx` — route definitions and lazy loading
- `src/components/layout/*` — app shell, sidebar, header, mobile nav
- `src/components/common/*` — skeletons and error boundaries
- `src/services/api/*` — external data integrations
- `src/services/*` — local logic and AI orchestration
- `src/data/*` — curated static domain knowledge
- `src/store/*` — persistent settings and local user state
- `src/routes/pages/*` — feature screens

This is already a good base. The next step is not to flatten it, but to sharpen the boundaries.

## Recommended System Model

Think of the app in 5 layers:

### 1. Presentation Layer

Responsible for:

- responsive layouts
- accessibility
- RTL support
- typography
- theme and visual hierarchy
- loading, error, and empty states

Files:

- `src/components/layout/*`
- `src/components/common/*`
- `src/routes/pages/*`

### 2. Domain Layer

Responsible for:

- Quran metadata
- Hadith canonical indices
- tajweed rules
- grammar and morphology dictionaries
- themes, provenance, and trust rules

Files:

- `src/data/*`
- `src/types/index.ts`

### 3. Data Access Layer

Responsible for:

- API requests
- normalization
- response validation
- graceful fallback
- timeout handling

Files:

- `src/services/api/*`
- `src/utils/fetchWithTimeout.ts`

### 4. Interaction Logic Layer

Responsible for:

- search ranking
- hadith retrieval scoring
- query parsing
- AI message orchestration
- settings and feature flags

Files:

- `src/services/hadithSearch.ts`
- `src/services/ollamaService.ts`
- `src/store/*`
- `src/config/env.ts`

### 5. Trust & Governance Layer

Responsible for:

- provenance labels
- verified-only controls
- feature gating
- beta labeling
- auditability
- integrity disclaimers

Files:

- `src/config/env.ts`
- `src/routes/pages/SettingsPage.tsx`
- `CODE_REVIEW_AND_DELIVERY_PLAN.md`

## UI/UX System Deep Dive

### Design goals

The app should feel:

- calm
- sacred
- readable
- fast
- mobile-first
- dependable

### Navigation rhythm

Good rhythm means the user can move between dashboard, Quran, Hadith, AI, and masjid discovery without friction or surprise.

Current strengths:

- lazy-loaded routes
- shell layout with desktop + mobile nav
- clear visual hierarchy
- beta labeling for in-progress modules
- fallback handling for unreliable APIs

Areas to keep enforcing:

- one primary action per screen
- stable spacing between major sections
- consistent loading states
- consistent card semantics
- avoid overloading the user with too many controls at once

### UI hierarchy formula

A useful screen order is:

1. **Identity** — what screen am I on?
2. **Primary content** — Quran text, hadith text, or AI response
3. **Context** — translation, provenance, commentary
4. **Actions** — search, bookmark, share, filter
5. **Fallback** — what happens if live data fails?

If the UI respects this order, users remain oriented.

### Accessibility and reverence

- High-contrast text for sacred text
- RTL-aware spacing and alignment
- Avoid decorative elements inside source text lines
- Keep buttons and chips visually distinct from source text
- Never let the metadata visually dominate the revelation text

## Quran Reader Deep Dive

### Current system

The Quran page already has:

- surah list
- surah detail view
- tajweed highlight mode
- study overlays for grammar, huruf, qawaid, rijal references
- word breakdown panel

### What is structurally correct already

- Source text remains intact
- Overlays are separate from the source line
- Search/filter and reading are distinct
- Detail view and list view are separated

### What should be added next

#### 1. Token-aware rendering

Current rendering is character-based. The next step is token-aware, diacritic-aware rendering.

Better approach:

- split by Quranic token boundaries
- maintain punctuation and diacritics as attached metadata
- apply tajweed spans to token segments, not raw characters

#### 2. Morphology engine

For each word token, derive:

- root
- pattern
- part of speech
- grammatical role
- derived meaning
- confidence level

This should be a metadata engine, not a text editor.

#### 3. Word anatomy drill-down

A reader should be able to tap a word and see:

- Arabic token
- root letters
- morphology
- grammar note
- tajweed note
- citations

#### 4. Quran knowledge graph

Link tokens to:

- grammar rules
- tajweed qawaid
- lexical dictionary entries
- tafsir references
- recitation notes

### Recommended formula for token confidence

A simple useful score:

`confidence = (source_match_weight + grammar_match_weight + morphology_match_weight + reference_match_weight) / 4`

Use this only for internal ranking or display priority. Do not show it as a religious verdict.

## Hadith Explorer Deep Dive

### Current system

The hadith flow now supports:

- collection selection
- canonical book order seed for Bukhari
- search by number/context/theme
- provenance metadata
- verified-only toggle
- provenance badges

### What needs to be structurally respected

Hadith data should be treated as:

- collection
- book / kitab
- hadith number
- Arabic text
- translation(s)
- provenance
- verification status
- sanad / rijal linkage when actually available

### Retrieval architecture

The current retrieval flow is a good start:

1. load an indexed window
2. search by number
3. search by context keywords
4. search by source-backed themes
5. rank and sort results

### Ranking logic formula

A practical retrieval score can be computed as:

`score = 100*(exact_number_match) + 70*(number_token_match) + 6*(arabic_token_match) + 5*(translation_token_match) + 40*(theme_match) - penalty`

Where:

- `exact_number_match` is 1 when the query is an exact hadith number
- `theme_match` is 1 when a source-backed theme maps to the record
- `penalty` can represent weak provenance, conflicting edition, or incomplete translation

This is a deterministic ranking baseline and works well before ML.

### Canonical hadith ordering

Canonical order matters more than the UI style.

Recommended hierarchy:

- Collection
- Kitab / Book
- Hadith number
- Variant / edition

For Bukhari, the app should show:

- a canonical kitab order table
- the ability to filter by kitab
- clear source reference labels

### Provenance model

Every hadith should carry:

- provider
- endpoint
- source ID
- edition
- language coverage
- verification fields

If sanad or rijal is not mapped, the UI should show that explicitly rather than implying completeness.

### Translation model

Separate translation channels:

- provider stream
- verified English translation
- verified Urdu translation

If a language is missing, display that as a gap instead of fabricating a placeholder as if it were a verified translation.

## Noor AI / ML Deep Dive

### Current system

Noor AI is a local Ollama-powered assistant with a strict system instruction:

- cite Quran and Hadith
- do not hallucinate fatwas
- respond respectfully
- admit uncertainty

This is the correct direction.

### Recommended ML responsibilities

Noor AI should do:

- summarization
- question answering
- source-grounded explanation
- translation assistance
- retrieval-aware response drafting
- user-friendly Islamic education

Noor AI should not do:

- issuing fatwas
- claiming scholarly authority
- inventing references
- replacing qualified scholarship

### RAG architecture recommendation

A robust AI flow should be:

1. user asks question
2. query is normalized
3. relevant Quran/Hadith/tafsir chunks are retrieved
4. AI response is generated from retrieved context only
5. answer includes citations and uncertainty if needed

### Retrieval scoring for RAG

A useful retrieval score:

`R = α * lexical_similarity + β * semantic_similarity + γ * source_trust + δ * recency_or_preference - ε * contradiction_penalty`

Where:

- lexical similarity: keyword overlap
- semantic similarity: embedding cosine similarity
- source trust: Quran > sahih hadith > curated commentary > fallback notes
- contradiction penalty: reduces rank for weak or ambiguous matches

### Quantization strategy

For local deployment, quantization matters because it defines speed, memory, and quality.

#### Practical model sizes

- **FP16**: best quality, heavy memory use
- **8-bit**: good compromise
- **4-bit**: strong for local consumer devices, best speed/memory balance for many apps

#### General memory estimate

Model memory can be approximated as:

`memory_bytes ≈ parameters × bits_per_weight / 8 + activation_overhead + KV_cache`

Examples:

- 7B parameters at 4-bit  roughly 3.5 GB weights before overhead
- 8-bit roughly doubles weight memory compared to 4-bit

#### Quantization trade-off rule

- If the model is a chat companion with citations, 4-bit is often enough.
- If the model is doing nuanced religious summarization, prefer the highest quality quantization that still fits local hardware reliably.

#### KV cache note

Longer conversations increase the KV cache footprint. For chat UX, keep conversation context compact and summarize older turns.

### Recommended AI architecture for Al-Minbar

- local Ollama-first
- retrieval-grounded prompting
- strict system prompt
- citations required
- fallback messages when the model is unavailable

## Algorithms and Data Structures That Fit This App

### 1. Trie or prefix index for search

Good for:

- Quran surah search
- hadith keyword search
- theme search

### 2. Inverted index

Best for:

- hadith retrieval
- word anatomy lookup
- source-reference linking

### 3. Priority queue / ranking heap

Best for top-K retrieval results.

### 4. Content-addressable metadata map

Good for preventing duplicate and conflicting source overlays.

### 5. State machine for screen flow

Recommended for complex pages:

- loading
- empty
- error
- browsing
- detail
- overlay open
- fallback active

This avoids UI rhythm breaks.

## Performance and UX Metrics

### Useful formulas

#### Cache hit rate

`hit_rate = hits / (hits + misses)`

Aim for high hit rate on:

- hadith search windows
- surah list data
- settings
- canonical book metadata

#### Render stability

`stability = successful_frames / total_frames`

You want high stability in scroll-heavy pages.

#### Interaction latency

`latency = t_response - t_input`

Target: feel instant for local interactions, and under ~300ms for remote data decisions when feasible.

#### Search usefulness

`precision@k = relevant_results_in_top_k / k`

This is especially useful for hadith ranking and theme search.

### UX targets

- quick entry into Quran and Hadith pages
- no dead ends
- graceful fallbacks for failed endpoints
- obvious beta labels for incomplete modules
- no surprising layout jumps

## Recommended Implementation Priority

### Immediate

1. Keep Quran and Hadith text immutable.
2. Add provenance everywhere trust matters.
3. Keep verified-only mode default on.
4. Mark incomplete modules as beta.
5. Preserve routing rhythm and fallback behavior.

### Short term

1. Expand canonical hadith indexing beyond Bukhari.
2. Add verified English and Urdu sources.
3. Expand Quran word anatomy coverage.
4. Build proper sanad/rijal linkage from curated corpora.

### Medium term

1. Add offline caches.
2. Add vector embeddings for semantic retrieval.
3. Add stronger testing around search and trust rules.
4. Add observability for API failures and fallback usage.

### Long term

1. Build a full Quran/Hadith knowledge graph.
2. Add scholar-reviewed content packs.
3. Add multi-device sync and offline study mode.
4. Add source-evidence panels across AI and study flows.

## What Success Looks Like

The app succeeds when:

- the Quran page feels like a respectful reading environment, not a demo
- the Hadith page feels structured, sourced, and transparent
- Noor AI feels helpful but humble
- every incomplete feature is clearly labeled
- the system degrades gracefully instead of breaking
- users trust the app because it tells the truth about what it knows and what it does not know

## Final Principle

Al-Minbar should not merely display Islamic content.
It should preserve, organize, and respect it.

That means:

- no fabricated certainty
- no hidden transformations
- no confusing UI noise
- no ambiguous provenance
- no disrespect to sacred text

This is the foundation for a trustworthy Islamic super app.

