import { useSettingsStore } from '@/store/useSettingsStore';

export default function SettingsPage() {
  const { theme, language, quran, hadith, setTheme, setLanguage, setQuranSetting, setHadithSetting } = useSettingsStore();

  return (
    <div className="p-8 max-w-2xl mx-auto space-y-8">
      <h2 className="text-3xl font-heading font-bold text-gold-400">Settings</h2>

      {/* Theme */}
      <div className="bg-lapis-800/50 rounded-xl p-6 border border-gold-500/20">
        <h3 className="text-lg font-heading text-gold-400 mb-4">Appearance</h3>
        <div className="flex gap-2">
          {(['dark', 'light', 'auto'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTheme(t)}
              className={`px-4 py-2 rounded-lg capitalize transition-colors ${theme === t ? 'bg-gold-500 text-lapis-900' : 'bg-lapis-900 text-slate-400 hover:text-gold-400'}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Language */}
      <div className="bg-lapis-800/50 rounded-xl p-6 border border-gold-500/20">
        <h3 className="text-lg font-heading text-gold-400 mb-4">Language</h3>
        <div className="flex gap-2">
          {([['en', 'English'], ['ur', 'اردو'], ['ar', 'العربية']] as const).map(([code, label]) => (
            <button
              key={code}
              onClick={() => setLanguage(code)}
              className={`px-4 py-2 rounded-lg transition-colors ${language === code ? 'bg-gold-500 text-lapis-900' : 'bg-lapis-900 text-slate-400 hover:text-gold-400'}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Quran Settings */}
      <div className="bg-lapis-800/50 rounded-xl p-6 border border-gold-500/20">
        <h3 className="text-lg font-heading text-gold-400 mb-4">Quran Reader</h3>
        <div className="space-y-4">
          <label className="flex items-center justify-between">
            <span className="text-slate-300">Show Transliteration</span>
            <input
              type="checkbox"
              checked={quran.showTransliteration}
              onChange={(e) => setQuranSetting('showTransliteration', e.target.checked)}
              className="w-5 h-5 accent-gold-500"
            />
          </label>
          <div className="flex items-center justify-between">
            <span className="text-slate-300">Font Size</span>
            <div className="flex items-center gap-2">
              <button onClick={() => setQuranSetting('fontSize', Math.max(16, quran.fontSize - 2))} className="px-3 py-1 bg-lapis-900 rounded text-slate-400 hover:text-gold-400">-</button>
              <span className="text-parchment-100 w-8 text-center">{quran.fontSize}</span>
              <button onClick={() => setQuranSetting('fontSize', Math.min(48, quran.fontSize + 2))} className="px-3 py-1 bg-lapis-900 rounded text-slate-400 hover:text-gold-400">+</button>
            </div>
          </div>
        </div>
      </div>

      {/* Hadith Settings */}
      <div className="bg-lapis-800/50 rounded-xl p-6 border border-gold-500/20">
        <h3 className="text-lg font-heading text-gold-400 mb-4">Hadith Trust Controls</h3>
        <div className="space-y-4">
          <label className="flex items-center justify-between">
            <span className="text-slate-300">Verified records only</span>
            <input
              type="checkbox"
              checked={hadith.verifiedOnly}
              onChange={(e) => setHadithSetting('verifiedOnly', e.target.checked)}
              className="w-5 h-5 accent-gold-500"
            />
          </label>
          <label className="flex items-center justify-between">
            <span className="text-slate-300">Show provenance badges</span>
            <input
              type="checkbox"
              checked={hadith.showProvenance}
              onChange={(e) => setHadithSetting('showProvenance', e.target.checked)}
              className="w-5 h-5 accent-gold-500"
            />
          </label>
        </div>
      </div>
    </div>
  );
}