import { useTasbihStore } from '@/store/useTasbihStore';

const tasbihPresets = [
  { target: 33, name: 'SubhanAllah' },
  { target: 33, name: 'Alhamdulillah' },
  { target: 34, name: 'Allahu Akbar' },
  { target: 100, name: 'Astaghfirullah' },
];

export default function TasbihPage() {
  const { count, target, totalSessions, totalCount, increment, reset, setTarget } = useTasbihStore();
  const progress = Math.min((count / target) * 100, 100);
  const isComplete = count >= target;

  return (
    <div className="flex flex-col items-center justify-center h-full p-8">
      <h2 className="text-3xl font-heading font-bold text-gold-400 mb-2">Tasbih Counter</h2>
      <p className="text-slate-400 text-sm mb-8">
        Total: {totalCount} • Sessions: {totalSessions}
      </p>

      {/* Progress Circle */}
      <div className="relative w-48 h-48 mb-8">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="currentColor"
            className="text-lapis-700"
            strokeWidth="4"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="currentColor"
            className={isComplete ? 'text-success' : 'text-gold-500'}
            strokeWidth="4"
            strokeDasharray={`${2 * Math.PI * 45}`}
            strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-5xl font-mono ${isComplete ? 'text-success' : 'text-parchment-100'}`}>
            {count}
          </span>
          <span className="text-sm text-slate-400">/ {target}</span>
        </div>
      </div>

      {/* Completion Message */}
      {isComplete && (
        <div className="mb-4 p-3 rounded-lg bg-success/10 border border-success/30 text-success text-sm">
          ✓ Target reached! MashaAllah.
        </div>
      )}

      {/* Controls */}
      <div className="flex gap-4">
        <button
          onClick={increment}
          className="px-8 py-4 bg-gold-500 text-lapis-900 rounded-xl font-bold text-lg hover:bg-gold-400 transition-colors active:scale-95"
        >
          Count
        </button>
        <button
          onClick={reset}
          className="px-6 py-4 bg-lapis-800 border border-gold-500/30 text-gold-400 rounded-xl hover:bg-lapis-700 transition-colors"
        >
          Reset
        </button>
      </div>

      {/* Target Presets */}
      <div className="flex flex-wrap gap-2 mt-6 justify-center">
        {tasbihPresets.map((preset) => (
          <button
            key={preset.name}
            onClick={() => setTarget(preset.target)}
            className={`px-3 py-2 rounded-lg text-sm transition-colors ${
              target === preset.target
                ? 'bg-gold-500 text-lapis-900 font-bold'
                : 'bg-lapis-800 text-slate-400 hover:text-gold-400'
            }`}
          >
            {preset.name} ({preset.target})
          </button>
        ))}
      </div>
    </div>
  );
}
