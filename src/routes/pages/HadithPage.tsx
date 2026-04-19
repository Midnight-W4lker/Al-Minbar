import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { hadithApi } from '@/services/api/hadithApi';
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton';
import { cn } from '@/utils/cn';
import { BookOpen, ChevronRight, Search, Info } from 'lucide-react';
import { HADITH_THEMES } from '@/data/hadithThemes';
import { getCanonicalBooksForCollection, HADITH_COLLECTION_DISPLAY } from '@/data/hadithCatalog';
import { searchHadithRecords } from '@/services/hadithSearch';
import { useSettingsStore } from '@/store/useSettingsStore';

const COLOR_STYLES: Record<string, string> = {
  emerald: 'bg-emerald-500/20 text-emerald-400',
  blue: 'bg-blue-500/20 text-blue-400',
  purple: 'bg-purple-500/20 text-purple-400',
  amber: 'bg-amber-500/20 text-amber-400',
  rose: 'bg-rose-500/20 text-rose-400',
  cyan: 'bg-cyan-500/20 text-cyan-400',
  fuchsia: 'bg-fuchsia-500/20 text-fuchsia-400',
};

export default function HadithPage() {
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
  const [selectedHadith, setSelectedHadith] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedThemeId, setSelectedThemeId] = useState<string | null>(null);
  const [selectedCanonicalBookOrder, setSelectedCanonicalBookOrder] = useState<number | null>(null);
  const hadithSettings = useSettingsStore((s) => s.hadith);

  const { data: collections, isLoading: collectionsLoading } = useQuery({
    queryKey: ['hadithBooks'],
    queryFn: hadithApi.getCollections,
  });

  const currentCollection = collections?.find((collection) => collection.id === selectedCollection);

  const { data: indexedHadiths, isLoading: indexLoading } = useQuery({
    queryKey: ['hadithIndex', selectedCollection, currentCollection?.available],
    queryFn: () => {
      if (!selectedCollection) return [];
      const windowSize = Math.min(currentCollection?.available ?? 300, 800);
      return hadithApi.loadSearchWindow(selectedCollection, windowSize);
    },
    enabled: !!selectedCollection,
  });

  const { data: hadithDetail, isLoading: hadithDetailLoading } = useQuery({
    queryKey: ['hadithDetail', selectedCollection, selectedHadith],
    queryFn: () => (selectedCollection && selectedHadith ? hadithApi.getHadithDetail(selectedCollection, selectedHadith) : null),
    enabled: !!selectedCollection && !!selectedHadith,
  });

  const selectedTheme = HADITH_THEMES.find((theme) => theme.id === selectedThemeId);
  const retrievalQuery = [searchQuery, selectedTheme?.label ?? ''].join(' ').trim();

  const retrievalResults = useMemo(() => {
    const base = searchHadithRecords(indexedHadiths ?? [], retrievalQuery);
    const verified = hadithSettings.verifiedOnly
      ? base.filter((entry) => entry.record.verification.sourceText)
      : base;

    if (selectedCanonicalBookOrder === null) return verified;

    return verified.filter((entry) => entry.record.canonicalBook?.order === selectedCanonicalBookOrder);
  }, [indexedHadiths, retrievalQuery, hadithSettings.verifiedOnly, selectedCanonicalBookOrder]);

  const canonicalBooks = selectedCollection ? getCanonicalBooksForCollection(selectedCollection) : [];
  const collectionThemes = HADITH_THEMES.filter((theme) => !selectedCollection || theme.id.startsWith(selectedCollection));

  const collectionDisplay = selectedCollection ? HADITH_COLLECTION_DISPLAY[selectedCollection] : null;
  const colorClass = collectionDisplay ? COLOR_STYLES[collectionDisplay.color] ?? 'bg-gold-500/20 text-gold-400' : 'bg-gold-500/20 text-gold-400';

  if (selectedCollection && selectedHadith && hadithDetail) {
    return (
      <div className="h-full flex flex-col max-w-4xl mx-auto">
        <div className="sticky top-0 z-20 bg-gradient-to-b from-lapis-900 via-lapis-900/95 to-lapis-900/90 backdrop-blur-xl border-b border-gold-500/20">
          <div className="flex items-center justify-between p-4">
            <button
              onClick={() => setSelectedHadith(null)}
              className="flex items-center gap-2 text-gold-400 hover:text-gold-300 transition-colors"
            >
              <ChevronRight className="w-5 h-5 rotate-180" />
              <span className="font-heading uppercase text-sm tracking-widest">Back to Retrieval</span>
            </button>
            <div className="text-center">
              <h2 className="font-heading text-xl text-parchment-100">
                {collectionDisplay?.english ?? currentCollection?.name}
              </h2>
              <p className="text-xs text-gold-500">Hadith #{selectedHadith}</p>
            </div>
            <div className="w-20"></div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-gradient-to-b from-parchment-50 via-parchment-100 to-parchment-100 text-lapis-900">
          {hadithDetailLoading ? (
            <LoadingSkeleton count={3} />
          ) : (
            <div className="space-y-6">
              <div className="text-center">
                <p className="font-arabic text-2xl md:text-3xl dir-rtl leading-loose text-lapis-800">
                  {hadithDetail.arabic || 'Arabic text unavailable from source API response.'}
                </p>
              </div>

              <div className="flex items-center justify-center gap-4">
                <div className="w-16 h-px bg-gold-400/50" />
                <div className="px-4 py-2 bg-emerald-500/20 text-emerald-700 rounded-full text-sm font-medium">
                  {selectedCollection} #{selectedHadith}
                </div>
                <div className="w-16 h-px bg-gold-400/50" />
              </div>

              <div className="bg-white/50 p-6 rounded-2xl border border-gold-400/20">
                <h3 className="text-lg font-heading text-lapis-800 mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-gold-500" />
                  English Translation
                </h3>
                <p className="text-lg text-slate-700 leading-relaxed">
                  {hadithDetail.translationEnglish || 'Verified English translation is not linked for this record yet.'}
                </p>
              </div>

              <div className="bg-white/50 p-6 rounded-2xl border border-gold-400/20">
                <h3 className="text-lg font-heading text-lapis-800 mb-4">Urdu Translation</h3>
                <p className="text-lg text-slate-700 leading-relaxed font-urdu dir-rtl text-right">
                  {hadithDetail.translationUrdu || 'اس حدیث کے لئے مصدقہ اردو ترجمہ ابھی منسلک نہیں ہے۔'}
                </p>
              </div>

              <div className="bg-white/50 p-6 rounded-2xl border border-gold-400/20">
                <h3 className="text-lg font-heading text-lapis-800 mb-4">Provider Translation Stream</h3>
                <p className="text-base text-slate-700 leading-relaxed">
                  {hadithDetail.translation || 'No provider-side translation payload found.'}
                </p>
              </div>

              <div className="bg-lapis-900/80 p-4 rounded-xl border border-gold-500/20 text-slate-200">
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="px-3 py-1 rounded-full text-[10px] uppercase tracking-wider bg-emerald-500/15 text-emerald-300 border border-emerald-500/25">
                    {hadithDetail.provenance.provider}
                  </span>
                  <span className="px-3 py-1 rounded-full text-[10px] uppercase tracking-wider bg-gold-500/15 text-gold-300 border border-gold-500/25">
                    {hadithDetail.provenance.edition}
                  </span>
                  <span className={cn(
                    'px-3 py-1 rounded-full text-[10px] uppercase tracking-wider border',
                    hadithDetail.verification.sourceText
                      ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/25'
                      : 'bg-amber-500/15 text-amber-300 border-amber-500/25'
                  )}>
                    Source text {hadithDetail.verification.sourceText ? 'verified' : 'unverified'}
                  </span>
                  <span className={cn(
                    'px-3 py-1 rounded-full text-[10px] uppercase tracking-wider border',
                    hadithDetail.verification.englishTranslation
                      ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/25'
                      : 'bg-slate-700/40 text-slate-300 border-slate-500/25'
                  )}>
                    English {hadithDetail.verification.englishTranslation ? 'verified' : 'pending'}
                  </span>
                  <span className={cn(
                    'px-3 py-1 rounded-full text-[10px] uppercase tracking-wider border',
                    hadithDetail.verification.urduTranslation
                      ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/25'
                      : 'bg-slate-700/40 text-slate-300 border-slate-500/25'
                  )}>
                    Urdu {hadithDetail.verification.urduTranslation ? 'verified' : 'pending'}
                  </span>
                </div>
                <p className="text-sm mb-1"><span className="text-gold-400">Reference:</span> {selectedCollection}:{selectedHadith}</p>
                <p className="text-sm mb-1"><span className="text-gold-400">Themes:</span> {hadithDetail.themes.length > 0 ? hadithDetail.themes.join(', ') : 'No source-backed theme matched yet'}</p>
                {hadithDetail.canonicalBook && (
                  <p className="text-sm mb-1"><span className="text-gold-400">Canonical Book (Inferred):</span> #{hadithDetail.canonicalBook.order} {hadithDetail.canonicalBook.title}</p>
                )}
                <p className="text-sm"><span className="text-gold-400">Rijal/Sanad Linkage:</span> Planned corpus mapping (not yet linked per narrator chain).</p>
              </div>

              {hadithSettings.showProvenance && (
                <div className="bg-lapis-900/80 p-4 rounded-xl border border-emerald-500/30 text-slate-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Info className="w-4 h-4 text-emerald-400" />
                    <p className="text-sm text-emerald-400 font-semibold">Provenance</p>
                  </div>
                  <p className="text-sm"><span className="text-gold-400">Provider:</span> {hadithDetail.provenance.provider}</p>
                  <p className="text-sm"><span className="text-gold-400">Edition:</span> {hadithDetail.provenance.edition}</p>
                  <p className="text-sm"><span className="text-gold-400">Source ID:</span> {hadithDetail.provenance.sourceId}</p>
                  <p className="text-sm"><span className="text-gold-400">Languages:</span> {hadithDetail.provenance.languageCoverage.join(', ')}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (selectedCollection) {
    return (
      <div className="h-full flex flex-col max-w-4xl mx-auto">
        <div className="sticky top-0 z-20 bg-gradient-to-b from-lapis-900 via-lapis-900/95 to-lapis-900/90 backdrop-blur-xl border-b border-gold-500/20">
          <div className="flex items-center justify-between p-4">
            <button
              onClick={() => {
                setSelectedCollection(null);
                setSelectedThemeId(null);
                setSearchQuery('');
              }}
              className="flex items-center gap-2 text-gold-400 hover:text-gold-300 transition-colors"
            >
              <ChevronRight className="w-5 h-5 rotate-180" />
              <span className="font-heading uppercase text-sm tracking-widest">All Collections</span>
            </button>
            <div className="text-center">
              <h2 className="font-heading text-xl text-parchment-100">{collectionDisplay?.english ?? currentCollection?.name}</h2>
              <p className="text-xs text-gold-500">{collectionDisplay?.arabic ?? 'Hadith collection'}</p>
            </div>
            <div className="w-20"></div>
          </div>
        </div>

        <div className="p-4 border-b border-gold-500/10 space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="text"
              placeholder="Search by hadith number, context, or source-backed theme..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-lapis-800/60 border border-gold-500/20 rounded-xl text-parchment-100 placeholder-slate-500 focus:outline-none focus:border-gold-500"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {collectionThemes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => setSelectedThemeId((prev) => (prev === theme.id ? null : theme.id))}
                className={cn(
                  'px-3 py-2 rounded-full text-xs border transition-colors text-left',
                  selectedThemeId === theme.id
                    ? 'bg-gold-500/20 border-gold-500/40 text-gold-300'
                    : 'bg-lapis-800/50 border-gold-500/20 text-slate-300 hover:border-gold-500/40'
                )}
                title={`${theme.source} • ${theme.sourceOfTruth}`}
              >
                <span className="block font-medium leading-tight">{theme.label}</span>
                <span className="block mt-1 text-[10px] uppercase tracking-wider text-slate-400">
                  {theme.sourceOfTruth}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="rounded-2xl bg-lapis-800/40 border border-gold-500/10 p-4">
            <h3 className="text-gold-400 font-heading mb-3">Canonical Book Order</h3>
            {canonicalBooks.length === 0 ? (
              <p className="text-sm text-slate-400">Canonical book list is currently curated for Bukhari first and will be expanded collection-by-collection.</p>
            ) : (
              <div className="grid md:grid-cols-2 gap-2">
                {canonicalBooks.map((book) => (
                  <button
                    key={book.order}
                    onClick={() => {
                      setSearchQuery(book.title);
                      setSelectedCanonicalBookOrder((prev) => (prev === book.order ? null : book.order));
                    }}
                    className={cn(
                      'text-left rounded-xl border bg-lapis-900/40 px-3 py-2 transition-colors',
                      selectedCanonicalBookOrder === book.order
                        ? 'border-gold-500/50 ring-1 ring-gold-500/30'
                        : 'border-gold-500/10 hover:border-gold-500/40'
                    )}
                    title={book.sourceReference}
                  >
                    <p className="text-xs text-gold-500">Book {book.order}</p>
                    <p className="text-sm text-parchment-100">{book.title}</p>
                    <p className="text-xs text-slate-400 font-arabic">{book.arabicTitle}</p>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-2xl bg-lapis-800/40 border border-gold-500/10 p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gold-400 font-heading">RAG Retrieval Results</h3>
              <span className="text-xs text-slate-400">Indexed window: {indexedHadiths?.length ?? 0} hadith</span>
            </div>

            <p className="text-xs text-slate-400 mb-3">
              Retrieval order combines hadith number match, context keywords, and source-backed theme alignment.
            </p>

            {hadithSettings.verifiedOnly && (
              <p className="text-xs text-emerald-400 mb-3">Verified-only mode is enabled in settings.</p>
            )}
            {selectedCanonicalBookOrder !== null && (
              <p className="text-xs text-gold-400 mb-3">Canonical book filter: #{selectedCanonicalBookOrder}</p>
            )}
            {selectedTheme && (
              <p className="text-xs text-slate-400 mb-3">
                Theme provenance: {selectedTheme.source} • {selectedTheme.sourceOfTruth}
              </p>
            )}

            {indexLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 8 }).map((_, i) => <LoadingSkeleton key={i} className="h-20" />)}
              </div>
            ) : retrievalResults.length === 0 ? (
              <p className="text-sm text-slate-400">No hadith matched the current query.</p>
            ) : (
              <div className="space-y-3">
                {retrievalResults.map((result) => (
                  <button
                    key={result.record.number}
                    onClick={() => setSelectedHadith(result.record.number)}
                    className="w-full text-left p-4 rounded-xl bg-lapis-900/40 border border-gold-500/10 hover:bg-lapis-700/60 hover:border-gold-500/30 transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <div className={cn('w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0', colorClass)}>
                        {result.record.number}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-arabic text-lg text-parchment-100 mb-2 dir-rtl line-clamp-2">{result.record.arabic || 'النص غير متوفر في الاستجابة الحالية'}</p>
                        <p className="text-sm text-slate-400 line-clamp-2">{result.record.translationEnglish || result.record.translation || 'No translation payload in the current API response.'}</p>
                        {result.record.canonicalBook && (
                          <p className="text-xs text-emerald-400 mt-2">
                            Book #{result.record.canonicalBook.order}: {result.record.canonicalBook.title}
                          </p>
                        )}
                        <p className="text-xs text-gold-500 mt-2">score {result.score} • {result.reasons.join(', ')}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-500 flex-shrink-0" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-4xl mx-auto h-full overflow-y-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-emerald-400" />
          </div>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-gold-400">Hadith Collections</h2>
        </div>
        <p className="text-slate-400 font-body">Hierarchical collection explorer with source-backed retrieval</p>
      </div>

      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
        <input
          type="text"
          placeholder="Search collections..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-4 bg-lapis-800/60 border border-gold-500/20 rounded-2xl text-parchment-100 placeholder-slate-500 focus:outline-none focus:border-gold-500"
        />
      </div>

      {collectionsLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <LoadingSkeleton key={i} className="h-32" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(collections ?? []).filter((collection) => {
            const display = HADITH_COLLECTION_DISPLAY[collection.id];
            const english = (display?.english ?? collection.name).toLowerCase();
            const arabic = display?.arabic ?? '';
            const query = searchQuery.toLowerCase();
            return english.includes(query) || arabic.includes(searchQuery);
          }).map((collection) => {
            const display = HADITH_COLLECTION_DISPLAY[collection.id];
            const color = display?.color ?? 'emerald';

            return (
            <button
              key={collection.id}
              onClick={() => {
                setSelectedCollection(collection.id);
                setSearchQuery('');
                setSelectedThemeId(null);
              }}
              className="group relative overflow-hidden p-6 rounded-2xl bg-lapis-800/40 border border-gold-500/10 hover:bg-lapis-700/60 hover:border-gold-500/40 hover:shadow-lg transition-all text-left"
            >
              <div className={cn(
                'absolute top-0 right-0 w-24 h-24 rounded-full -translate-y-1/2 translate-x-1/2 opacity-20',
                color === 'emerald' && 'bg-emerald-500',
                color === 'blue' && 'bg-blue-500',
                color === 'purple' && 'bg-purple-500',
                color === 'amber' && 'bg-amber-500',
                color === 'rose' && 'bg-rose-500',
                color === 'cyan' && 'bg-cyan-500',
                color === 'fuchsia' && 'bg-fuchsia-500',
              )} />
              
              <div className="relative">
                <div className={cn(
                  'w-12 h-12 rounded-xl mb-4 flex items-center justify-center',
                  COLOR_STYLES[color] ?? 'bg-emerald-500/20 text-emerald-400'
                )}>
                  <BookOpen className="w-6 h-6" />
                </div>
                
                <h3 className="font-heading text-xl text-parchment-100 mb-1 group-hover:text-gold-400 transition-colors">
                  {display?.english ?? collection.name}
                </h3>
                <p className="font-arabic text-gold-500 mb-2 dir-rtl">{display?.arabic ?? ''}</p>

                <div className="flex items-center justify-between text-sm text-slate-400">
                  <span>{collection.available.toLocaleString()} hadiths</span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </button>
          )})}
        </div>
      )}

      {(collections ?? []).filter((collection) => {
        const display = HADITH_COLLECTION_DISPLAY[collection.id];
        const english = (display?.english ?? collection.name).toLowerCase();
        const arabic = display?.arabic ?? '';
        const query = searchQuery.toLowerCase();
        return english.includes(query) || arabic.includes(searchQuery);
      }).length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-400">No collections found matching "{searchQuery}"</p>
        </div>
      )}

      <div className="mt-8 p-4 rounded-xl border border-gold-500/20 bg-lapis-800/40 text-sm text-slate-300">
        <p className="text-gold-400 font-semibold mb-1">Data Integrity</p>
        <p>
          Retrieval uses source API payloads and source-backed theme labels. No hadith wording is altered; indexing only adds searchable metadata.
        </p>
      </div>
    </div>
  );
}