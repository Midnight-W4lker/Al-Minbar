import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface TasbihState {
  count: number;
  target: number;
  totalSessions: number;
  totalCount: number;
  setCount: (count: number) => void;
  setTarget: (target: number) => void;
  increment: () => void;
  reset: () => void;
  completeSession: () => void;
}

export const useTasbihStore = create<TasbihState>()(
  persist(
    (set) => ({
      count: 0,
      target: 33,
      totalSessions: 0,
      totalCount: 0,
      setCount: (count) => set({ count }),
      setTarget: (target) => set({ target, count: 0 }),
      increment: () => set((state) => ({
        count: state.count + 1,
        totalCount: state.totalCount + 1,
      })),
      reset: () => set({ count: 0 }),
      completeSession: () => set((state) => ({
        totalSessions: state.totalSessions + 1,
        count: 0,
      })),
    }),
    { name: 'al-minbar-tasbih' }
  )
);
