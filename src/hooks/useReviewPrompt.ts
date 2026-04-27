import { useState } from 'react';
import * as StoreReview from 'expo-store-review';
import { useSettingsStore } from '../store/settingsStore';
import type { MoodValue } from '../types/breathing';

export function useReviewPrompt() {
  const incrementQualifyingMeditation = useSettingsStore((s) => s.incrementQualifyingMeditation);
  const reviewPromptAccepted = useSettingsStore((s) => s.reviewPromptAccepted);
  const setReviewPromptAccepted = useSettingsStore((s) => s.setReviewPromptAccepted);
  const setReviewPromptLastShownAt = useSettingsStore((s) => s.setReviewPromptLastShownAt);

  const [visible, setVisible] = useState(false);
  const [shownAt, setShownAt] = useState<number | null>(null);

  function maybeTrigger(mood: MoodValue | null): boolean {
    const isQualifying = mood === 'good' || mood === 'great' || mood === 'amazing';
    if (!isQualifying || reviewPromptAccepted) return false;
    const newCount = incrementQualifyingMeditation();
    const shouldShow = newCount === 2 || (newCount > 2 && (newCount - 2) % 5 === 0);
    if (!shouldShow) return false;
    setShownAt(newCount);
    setTimeout(() => setVisible(true), 300);
    return true;
  }

  async function onYes() {
    if (shownAt !== null) setReviewPromptLastShownAt(shownAt);
    setReviewPromptAccepted(true);
    setVisible(false);
    try {
      if (await StoreReview.hasAction()) {
        await StoreReview.requestReview();
      }
    } catch {
      // no-op
    }
  }

  function onNo() {
    if (shownAt !== null) setReviewPromptLastShownAt(shownAt);
    setVisible(false);
  }

  return { visible, onYes, onNo, maybeTrigger };
}
