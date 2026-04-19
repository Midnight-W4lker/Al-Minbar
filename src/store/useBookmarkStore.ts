import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Bookmark } from '@/types';

// Robust ID generator: uses crypto.randomUUID when available, falls back to timestamp + counter
let _idCounter = 0;
function generateId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  // Fallback: timestamp + monotonically increasing counter to avoid collisions
  return `${Date.now()}-${++_idCounter}-${Math.random().toString(36).slice(2, 8)}`;
}

interface BookmarkState {
  bookmarks: Bookmark[];
  addBookmark: (bookmark: Omit<Bookmark, 'id' | 'createdAt'>) => void;
  removeBookmark: (id: string) => void;
  updateBookmarkNote: (id: string, note: string) => void;
  isBookmarked: (type: Bookmark['type'], contentId: string) => boolean;
}

export const useBookmarkStore = create<BookmarkState>()(
  persist(
    (set, get) => ({
      bookmarks: [],
      addBookmark: (bookmark) => set((state) => ({
        bookmarks: [...state.bookmarks, { ...bookmark, id: generateId(), createdAt: new Date() }]
      })),
      removeBookmark: (id) => set((state) => ({
        bookmarks: state.bookmarks.filter((b) => b.id !== id)
      })),
      updateBookmarkNote: (id, note) => set((state) => ({
        bookmarks: state.bookmarks.map((b) => b.id === id ? { ...b, note } : b)
      })),
      isBookmarked: (type, contentId) => {
        return get().bookmarks.some((b) => b.type === type && b.contentId === contentId);
      },
    }),
    { name: 'al-minbar-bookmarks' }
  )
);
