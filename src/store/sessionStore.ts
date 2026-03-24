import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { SessionLog } from '../types/breathing';

interface SessionState {
  sessions: SessionLog[];
  logSession: (entry: Omit<SessionLog, 'id'>) => void;
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      sessions: [],
      logSession: (entry) =>
        set((s) => ({
          sessions: [{ ...entry, id: Date.now().toString() }, ...s.sessions],
        })),
    }),
    {
      name: 'session-store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
