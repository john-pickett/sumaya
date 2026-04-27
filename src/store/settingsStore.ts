import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { ChimeId, FanfareId } from '../types/breathing';
import type { ThemeId } from '../theme';

export type NotificationTime = {
  hour: number;
  minute: 0 | 15 | 30 | 45;
  isPM: boolean;
};

interface SettingsState {
  themeId: ThemeId;
  setThemeId: (id: ThemeId) => void;
  selectedChimeId: ChimeId;
  setChimeId: (id: ChimeId) => void;
  selectedFanfareId: FanfareId;
  setFanfareId: (id: FanfareId) => void;
  notificationPromptShown: boolean;
  setNotificationPromptShown: (shown: boolean) => void;
  notificationTime: NotificationTime | null;
  setNotificationTime: (t: NotificationTime | null) => void;
  qualifyingMeditationCount: number;
  incrementQualifyingMeditation: () => number;
  reviewPromptLastShownAt: number | null;
  setReviewPromptLastShownAt: (n: number) => void;
  reviewPromptAccepted: boolean;
  setReviewPromptAccepted: (accepted: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      themeId: 'system',
      setThemeId: (id) => set({ themeId: id }),
      selectedChimeId: 'crystal',
      setChimeId: (id) => set({ selectedChimeId: id }),
      selectedFanfareId: 'triumph',
      setFanfareId: (id) => set({ selectedFanfareId: id }),
      notificationPromptShown: false,
      setNotificationPromptShown: (shown) => set({ notificationPromptShown: shown }),
      notificationTime: null,
      setNotificationTime: (t) => set({ notificationTime: t }),
      qualifyingMeditationCount: 0,
      incrementQualifyingMeditation: () => {
        const next = get().qualifyingMeditationCount + 1;
        set({ qualifyingMeditationCount: next });
        return next;
      },
      reviewPromptLastShownAt: null,
      setReviewPromptLastShownAt: (n) => set({ reviewPromptLastShownAt: n }),
      reviewPromptAccepted: false,
      setReviewPromptAccepted: (accepted) => set({ reviewPromptAccepted: accepted }),
    }),
    {
      name: 'settings-store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
