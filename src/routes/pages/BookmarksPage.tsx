import { useBookmarkStore } from '@/store/useBookmarkStore';
import { Bookmark } from 'lucide-react';

export default function BookmarksPage() {
  const bookmarks = useBookmarkStore((s) => s.bookmarks);
  const removeBookmark = useBookmarkStore((s) => s.removeBookmark);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h2 className="text-3xl font-heading font-bold text-gold-400 mb-6">Bookmarks</h2>
      {bookmarks.length === 0 ? (
        <div className="bg-lapis-800/50 rounded-xl p-8 border border-gold-500/20 text-center">
          <Bookmark className="w-12 h-12 text-gold-500/50 mx-auto mb-4" />
          <p className="text-slate-400">No bookmarks yet. Bookmark ayahs and hadiths while reading.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookmarks.map((bm) => (
            <div key={bm.id} className="bg-lapis-800/40 rounded-xl p-4 border border-gold-500/20 flex justify-between items-start">
              <div>
                <h3 className="font-bold text-parchment-100">{bm.title}</h3>
                <p className="font-arabic text-lg text-gold-400 mt-1 dir-rtl">{bm.text}</p>
                {bm.note && <p className="text-sm text-slate-400 mt-2 italic">Note: {bm.note}</p>}
              </div>
              <button onClick={() => removeBookmark(bm.id)} className="text-slate-500 hover:text-error transition-colors">✕</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}