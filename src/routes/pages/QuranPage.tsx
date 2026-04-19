import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { quranApi } from '@/services/api/quranApi';
import { useSettingsStore } from '@/store/useSettingsStore';
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton';
import { useBookmarkStore } from '@/store/useBookmarkStore';
import { TAJWEED_RULES, TAJWEED_SETTINGS } from '@/data/tajweedRules';
import { ARABIC_HURUF, GRAMMAR_QAWAID, TAJWEED_QAWAID, RIJAL_TEXTS, splitArabicWords, getWordBreakdown } from '@/data/quranStudyLibrary';
import { Bookmark, ChevronLeft, Search, Settings, Share2, Eye, X, Info } from 'lucide-react';
import { cn } from '@/utils/cn';

export default function QuranPage() {
  const navigate = useNavigate();
  const { surahNumber } = useParams<{ surahNumber: string }>();
  const [selectedSurah, setSelectedSurah] = useState<number | null>(surahNumber ? parseInt(surahNumber) : null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showTajweedPanel, setShowTajweedPanel] = useState(false);
  const [showStudyPanel, setShowStudyPanel] = useState(false);
  const [activeTajweedRule, setActiveTajweedRule] = useState<string>('none');
  const [selectedWord, setSelectedWord] = useState<string>('');
  const fontSize = useSettingsStore((s) => s.quran.fontSize);
  const isBookmarked = useBookmarkStore((s) => s.isBookmarked);
  const addBookmark = useBookmarkStore((s) => s.addBookmark);

  // Fetch all surahs
  const { data: surahs, isLoading } = useQuery({
    queryKey: ['surahs'],
    queryFn: quranApi.getAllSurahs,
  });

  // Fetch selected surah
  const { data: surahDetail, isLoading: surahLoading } = useQuery({
    queryKey: ['surah', selectedSurah],
    queryFn: () => selectedSurah ? quranApi.getSurah(selectedSurah) : null,
    enabled: !!selectedSurah,
  });

  // Filter surahs by search
  const normalizedQuery = searchQuery.toLowerCase();
  const filteredSurahs = surahs?.filter((surah) => {
    const englishName = (surah.nameEnglish ?? '').toLowerCase();
    const arabicName = surah.nameArabic ?? '';
    const meaning = (surah.meaningEnglish ?? '').toLowerCase();

    return (
      englishName.includes(normalizedQuery) ||
      arabicName.includes(searchQuery) ||
      meaning.includes(normalizedQuery)
    );
  });

  const selectedWordBreakdown = selectedWord ? getWordBreakdown(selectedWord) : null;

  const getTajweedRuleForChar = (char: string, rule: string) => {
    if (rule === 'none') return '';

    if (rule === 'all') {
      const matchedRule = TAJWEED_RULES.find((r) => r.letters.includes(char));
      return matchedRule?.id ?? '';
    }

    const tajweedRule = TAJWEED_RULES.find((r) => r.id === rule);
    if (!tajweedRule) return '';
    return tajweedRule.letters.includes(char) ? tajweedRule.id : '';
  };

  const getTajweedHex = (ruleId: string): string => {
    const fromSettings = TAJWEED_SETTINGS.find((setting) => setting.id === ruleId);
    return fromSettings?.color ?? '#C9A84C';
  };

  // Show loading when surah selected but loading
  if (selectedSurah && surahLoading) {
    return (
      <div className="h-full flex items-center justify-center p-8">
        <LoadingSkeleton count={5} />
      </div>
    );
  }

  // Surah Detail View
  if (selectedSurah && surahDetail) {
    return (
      <div className="h-full flex flex-col max-w-5xl mx-auto">
        {/* Reader Header */}
        <div className="sticky top-0 z-20 bg-gradient-to-b from-lapis-900 via-lapis-900/95 to-lapis-900/90 backdrop-blur-xl border-b border-gold-500/20">
          <div className="flex items-center justify-between p-4 md:p-5">
            <button
              onClick={() => {
                setSelectedSurah(null);
                navigate('/quran');
              }}
              className="flex items-center gap-2 text-gold-400 hover:text-gold-300 transition-colors group"
            >
              <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-heading uppercase text-sm tracking-widest hidden sm:inline">All Surahs</span>
            </button>
            
            <div className="text-center">
              <h2 className="font-heading text-xl md:text-2xl text-parchment-100">{surahDetail.nameEnglish}</h2>
              <p className="font-arabic text-gold-500 text-lg">{surahDetail.nameArabic}</p>
              <p className="text-xs text-slate-500 mt-1">{surahDetail.meaningEnglish} • {surahDetail.ayahCount} verses</p>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Tajweed Toggle Button */}
              <button 
                onClick={() => setShowTajweedPanel(!showTajweedPanel)}
                className={cn(
                  'p-2 rounded-lg transition-colors',
                  showTajweedPanel 
                    ? 'text-gold-400 bg-gold-500/20' 
                    : 'text-slate-400 hover:text-gold-400 hover:bg-lapis-800'
                )}
                title="Toggle Tajweed Rules"
              >
                <Eye className="w-5 h-5" />
              </button>
              <button className="p-2 rounded-lg text-slate-400 hover:text-gold-400 hover:bg-lapis-800 transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setShowStudyPanel(!showStudyPanel)}
                className={cn(
                  'p-2 rounded-lg transition-colors',
                  showStudyPanel
                    ? 'text-gold-400 bg-gold-500/20'
                    : 'text-slate-400 hover:text-gold-400 hover:bg-lapis-800'
                )}
                title="Toggle Study Library"
              >
                <Info className="w-5 h-5" />
              </button>
              <button 
                onClick={() => navigate('/settings')}
                className="p-2 rounded-lg text-slate-400 hover:text-gold-400 hover:bg-lapis-800 transition-colors"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          {/* Tajweed Rules Panel */}
          {showTajweedPanel && (
            <div className="p-4 border-t border-gold-500/10 bg-lapis-800/50">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-heading text-gold-400">Tajweed Rules</h3>
                <button 
                  onClick={() => setShowTajweedPanel(false)}
                  className="p-1 text-slate-400 hover:text-gold-400"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              {/* Clickable Rule Selectors */}
              <div className="flex flex-wrap gap-2">
                {TAJWEED_SETTINGS.map((setting) => (
                  <button
                    key={setting.id}
                    onClick={() => setActiveTajweedRule(setting.id)}
                    className={cn(
                      'px-3 py-1.5 rounded-full text-xs font-medium transition-all',
                      activeTajweedRule === setting.id
                        ? 'ring-2 ring-gold-400 ring-offset-2 ring-offset-lapis-800'
                        : 'hover:bg-lapis-700',
                      setting.id === 'none' && 'bg-slate-700 text-slate-300',
                      setting.id !== 'none' && setting.color && `bg-[${setting.color}]/20 text-[${setting.color}]`
                    )}
                    style={setting.id !== 'none' && setting.color ? { backgroundColor: `${setting.color}20`, color: setting.color } : {}}
                  >
                    {setting.name}
                  </button>
                ))}
              </div>
              
              {/* Active Rule Info */}
              {activeTajweedRule !== 'none' && activeTajweedRule !== 'all' && (
                <div className="mt-3 p-3 bg-lapis-900/50 rounded-xl">
                  {(() => {
                    const rule = TAJWEED_RULES.find(r => r.id === activeTajweedRule);
                    if (!rule) return null;
                    return (
                      <div className="flex items-start gap-3">
                        <div className={cn('w-3 h-3 rounded-full mt-1', rule.color)} />
                        <div>
                          <h4 className="text-sm font-bold text-parchment-100">{rule.name}</h4>
                          <p className="text-xs text-gold-500 font-arabic mb-1">{rule.arabic}</p>
                          <p className="text-xs text-slate-400">{rule.definition}</p>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-gradient-to-b from-parchment-50 via-parchment-100 to-parchment-100 text-lapis-900">
          {/* Bismillah */}
          <div className="text-center mb-10">
            <p className="font-arabic text-3xl md:text-4xl lg:text-5xl text-lapis-800 mb-4 select-none drop-shadow-sm dir-rtl">
              بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
            </p>
            <div className="flex items-center justify-center gap-4">
              <div className="w-20 h-px bg-gold-400/50" />
              <div className="w-3 h-3 rotate-45 bg-gold-400" />
              <div className="w-20 h-px bg-gold-400/50" />
            </div>
          </div>

          {showStudyPanel && (
            <div className="mb-8 p-4 md:p-6 rounded-2xl border border-gold-500/20 bg-lapis-900/90 text-slate-100">
              <p className="text-xs text-gold-400 font-semibold uppercase tracking-wider mb-2">Integrity Note</p>
              <p className="text-sm text-slate-300 mb-4">
                The Quranic text is rendered exactly from the source. Tajweed, grammar, and lexical content below are metadata overlays only.
              </p>

              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div className="rounded-xl bg-lapis-800/70 p-3 border border-gold-500/10">
                  <h4 className="text-gold-400 font-semibold mb-2">Arabic Huruf Library</h4>
                  <div className="max-h-40 overflow-y-auto space-y-1">
                    {ARABIC_HURUF.map((harf) => (
                      <p key={harf.letter} className="text-slate-300">
                        <span className="font-arabic text-lg text-parchment-100">{harf.letter}</span> - {harf.name} ({harf.transliteration}), {harf.makhraj}
                      </p>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl bg-lapis-800/70 p-3 border border-gold-500/10">
                  <h4 className="text-gold-400 font-semibold mb-2">Core Grammar Qawaid</h4>
                  <div className="max-h-40 overflow-y-auto space-y-2">
                    {GRAMMAR_QAWAID.map((rule) => (
                      <p key={rule.id} className="text-slate-300">
                        <span className="text-parchment-100">{rule.title}:</span> {rule.summary}
                      </p>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl bg-lapis-800/70 p-3 border border-gold-500/10">
                  <h4 className="text-gold-400 font-semibold mb-2">Tajweed Qaidah Reference</h4>
                  <div className="max-h-40 overflow-y-auto space-y-2">
                    {TAJWEED_QAWAID.map((rule) => (
                      <p key={rule.id} className="text-slate-300">
                        <span className="text-parchment-100">{rule.title}:</span> {rule.summary}
                      </p>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl bg-lapis-800/70 p-3 border border-gold-500/10">
                  <h4 className="text-gold-400 font-semibold mb-2">Rijal Texts (Reference)</h4>
                  <div className="max-h-40 overflow-y-auto space-y-2">
                    {RIJAL_TEXTS.map((text) => (
                      <p key={text.title} className="text-slate-300">
                        <span className="text-parchment-100">{text.title}</span> - {text.author}
                      </p>
                    ))}
                  </div>
                </div>
              </div>

              {selectedWordBreakdown && (
                <div className="mt-4 rounded-xl bg-lapis-800/70 p-3 border border-gold-500/10 text-sm text-slate-300">
                  <h4 className="text-gold-400 font-semibold mb-2">Word Structure Breakdown</h4>
                  <p><span className="text-parchment-100">Word:</span> {selectedWord}</p>
                  <p><span className="text-parchment-100">Root:</span> {selectedWordBreakdown.root}</p>
                  <p><span className="text-parchment-100">Part of speech:</span> {selectedWordBreakdown.partOfSpeech}</p>
                  <p><span className="text-parchment-100">Gloss:</span> {selectedWordBreakdown.gloss}</p>
                  <p><span className="text-parchment-100">Pattern:</span> {selectedWordBreakdown.pattern}</p>
                  <p><span className="text-parchment-100">Notes:</span> {selectedWordBreakdown.notes}</p>
                </div>
              )}
            </div>
          )}

          {surahLoading ? (
            <LoadingSkeleton count={5} />
          ) : (
            <div className="space-y-8 md:space-y-12">
              {surahDetail.ayahs.map((ayah, idx) => (
                <div key={idx} className="relative group">
                  {/* Arabic Text with Tajweed */}
                  <div className="text-right mb-6">
                    <p 
                      className="font-arabic dir-rtl leading-[2.5] md:leading-[3]"
                      style={{ fontSize: `${fontSize}px` }}
                    >
                      {activeTajweedRule !== 'none' ? (
                        // Render with tajweed highlighting
                        <span>
                          {ayah.textArabic.split('').map((char, charIdx) => {
                            const matchedRuleId = getTajweedRuleForChar(char, activeTajweedRule);
                            const matchedRule = matchedRuleId ? TAJWEED_RULES.find((r) => r.id === matchedRuleId) : null;

                            return (
                              <span
                                key={charIdx}
                                className={cn(
                                  'relative',
                                  matchedRuleId && 'underline decoration-2 underline-offset-2'
                                )}
                                style={{
                                  textDecorationColor: matchedRuleId ? getTajweedHex(matchedRuleId) : 'transparent',
                                }}
                                title={matchedRule?.name ?? ''}
                              >
                                {char}
                              </span>
                            );
                          })}
                          <span className={cn(
                            'inline-flex items-center justify-center ml-3 text-sm align-middle font-sans',
                            'w-7 h-7 md:w-8 md:h-8 border border-gold-400/50 rounded-full text-gold-600'
                          )}>
                            {ayah.ayahNumber}
                          </span>
                        </span>
                      ) : (
                        <>
                          {ayah.textArabic}
                          <span className={cn(
                            'inline-flex items-center justify-center ml-3 text-sm align-middle font-sans',
                            'w-7 h-7 md:w-8 md:h-8 border border-gold-400/50 rounded-full text-gold-600'
                          )}>
                            {ayah.ayahNumber}
                          </span>
                        </>
                      )}
                    </p>
                  </div>

                  {showStudyPanel && (
                    <div className="mb-4 flex flex-wrap gap-2 justify-end">
                      {splitArabicWords(ayah.textArabic).map((word, wordIdx) => (
                        <button
                          key={`${idx}-${wordIdx}`}
                          onClick={() => setSelectedWord(word)}
                          className={cn(
                            'px-2 py-1 rounded-lg text-sm border transition-colors',
                            selectedWord === word
                              ? 'bg-gold-500/20 border-gold-500/40 text-gold-200'
                              : 'bg-lapis-900/80 border-gold-500/20 text-parchment-200 hover:border-gold-500/40'
                          )}
                        >
                          {word}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Translations */}
                  <div className="grid md:grid-cols-2 gap-4 md:gap-6 pl-4 md:pl-0 border-l-2 md:border-l-0 md:border-r-2 border-gold-400/30 md:ml-6">
                    {ayah.textUrdu && (
                      <div className="text-right pr-4 md:pr-0">
                        <p className="font-urdu text-xl md:text-2xl text-lapis-800 leading-loose dir-rtl">
                          {ayah.textUrdu}
                        </p>
                      </div>
                    )}
                    {ayah.textEnglish && (
                      <div className="pl-4 md:pl-0">
                        <p className="font-body text-lg md:text-xl text-slate-700 leading-relaxed">
                          {ayah.textEnglish}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Bookmark Button */}
                  <button
                    onClick={() => {
                      if (!isBookmarked('ayah', `${surahDetail.number}:${ayah.ayahNumber}`)) {
                        addBookmark({
                          type: 'ayah',
                          contentId: `${surahDetail.number}:${ayah.ayahNumber}`,
                          title: `${surahDetail.nameEnglish} - Ayah ${ayah.ayahNumber}`,
                          text: ayah.textArabic,
                        });
                      }
                    }}
                    className={cn(
                      'absolute top-0 -left-2 md:left-0 p-2 rounded-full transition-all duration-300',
                      isBookmarked('ayah', `${surahDetail.number}:${ayah.ayahNumber}`)
                        ? 'text-gold-500 opacity-100'
                        : 'text-slate-400 opacity-0 group-hover:opacity-100 hover:text-gold-400'
                    )}
                  >
                    <Bookmark 
                      className="w-5 h-5" 
                      fill={isBookmarked('ayah', `${surahDetail.number}:${ayah.ayahNumber}`) ? 'currentColor' : 'none'} 
                    />
                  </button>

                  <div className="w-full h-px bg-gold-400/20 mt-8 md:mt-10" />
                </div>
              ))}
            </div>
          )}
          
          <div className="h-20"></div>
        </div>
      </div>
    );
  }

  // Surah List View
  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-4xl mx-auto h-full overflow-y-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-gold-500/20 flex items-center justify-center">
            <svg className="w-6 h-6 text-gold-400" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L14.5 9H22L16 13.5L18.5 21L12 16.5L5.5 21L8 13.5L2 9H9.5L12 2Z" />
            </svg>
          </div>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-gold-400">The Noble Quran</h2>
        </div>
        <p className="text-slate-400 font-body">114 Surahs • المبلغ الكريم</p>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
        <input
          type="text"
          placeholder="Search by name, meaning, or Arabic..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-4 bg-lapis-800/60 border border-gold-500/20 rounded-2xl text-parchment-100 placeholder-slate-500 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500/30 transition-all"
        />
      </div>

      {/* Surah Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <LoadingSkeleton key={i} className="h-24" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          {filteredSurahs?.map((surah) => (
            <button
              key={surah.number}
              onClick={() => {
                setSelectedSurah(surah.number);
                navigate(`/quran/${surah.number}`);
              }}
              className="group flex items-center justify-between p-4 md:p-5 rounded-2xl bg-lapis-800/40 border border-gold-500/10 hover:bg-lapis-700/60 hover:border-gold-500/40 hover:shadow-lg hover:shadow-gold-500/5 transition-all duration-300 text-left"
            >
              <div className="flex items-center gap-4">
                <div className="relative w-12 h-12 flex items-center justify-center flex-shrink-0">
                  <div className="absolute inset-0 rounded-full bg-gold-500/10 group-hover:bg-gold-500/20 transition-colors" />
                  <svg className="absolute inset-0 w-full h-full text-gold-500/40 group-hover:text-gold-500 transition-colors" viewBox="0 0 24 24" fill="currentColor" style={{ opacity: 0.3 }}>
                    <path d="M12 2L14.5 7H20L16.5 11L19 16L14 15L12 20L10 15L5 16L7.5 11L4 7H9.5L12 2Z" />
                  </svg>
                  <span className="relative z-10 text-sm font-bold font-mono text-gold-400">{surah.number}</span>
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-parchment-100 group-hover:text-gold-400 transition-colors truncate">{surah.nameEnglish}</h3>
                  <p className="text-xs text-slate-500 truncate">{surah.meaningEnglish} • {surah.ayahCount} verses</p>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="font-arabic text-xl md:text-2xl text-gold-500 group-hover:text-gold-300 transition-colors">{surah.nameArabic}</p>
                <p className="text-[10px] text-slate-600 uppercase tracking-wider mt-1">
                  {surah.revelationType === 'Meccan' ? 'Makki' : 'Madani'}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}

      {filteredSurahs?.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-400">No surahs found matching "{searchQuery}"</p>
        </div>
      )}
    </div>
  );
}