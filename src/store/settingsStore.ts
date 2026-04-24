import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { ChimeId, FanfareId } from '../types/breathing';

export type NotificationTime = {
  hour: number;
  minute: 0 | 15 | 30 | 45;
  isPM: boolean;
};

interface SettingsState {
  selectedChimeId: ChimeId;
  setChimeId: (id: ChimeId) => void;
  selectedFanfareId: FanfareId;
  setFanfareId: (id: FanfareId) => void;
  notificationPromptShown: boolean;
  setNotificationPromptShown: (shown: boolean) => void;
  notificationTime: NotificationTime | null;
  setNotificationTime: (t: NotificationTime | null) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      selectedChimeId: 'crystal',
      setChimeId: (id) => set({ selectedChimeId: id }),
      selectedFanfareId: 'triumph',
      setFanfareId: (id) => set({ selectedFanfareId: id }),
      notificationPromptShown: false,
      setNotificationPromptShown: (shown) => set({ notificationPromptShown: shown }),
      notificationTime: null,
      setNotificationTime: (t) => set({ notificationTime: t }),
    }),
    {
      name: 'settings-store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
