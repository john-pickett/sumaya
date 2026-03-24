import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { ChimeId, FanfareId } from '../types/breathing';

interface SettingsState {
  selectedChimeId: ChimeId;
  setChimeId: (id: ChimeId) => void;
  selectedFanfareId: FanfareId;
  setFanfareId: (id: FanfareId) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      selectedChimeId: 'crystal',
      setChimeId: (id) => set({ selectedChimeId: id }),
      selectedFanfareId: 'triumph',
      setFanfareId: (id) => set({ selectedFanfareId: id }),
    }),
    {
      name: 'settings-store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
