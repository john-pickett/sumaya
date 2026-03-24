import { setAudioModeAsync, useAudioPlayer } from 'expo-audio';
import { useSettingsStore } from '../store/settingsStore';
import type { FanfareId } from '../types/breathing';

export const FANFARE_OPTIONS: { id: FanfareId; name: string; description: string }[] = [
  { id: 'triumph',  name: 'Triumph',  description: 'Bold and celebratory' },
  { id: 'bells',    name: 'Bells',    description: 'Bright and joyful' },
  { id: 'gentle',   name: 'Gentle',   description: 'Soft and subtle' },
  { id: 'rising',   name: 'Rising',   description: 'Ascending and uplifting' },
  { id: 'majestic', name: 'Majestic', description: 'Full and warm' },
  { id: 'zen',      name: 'Zen',      description: 'Peaceful and calm' },
];

export function useFanfarePlayer() {
  const selectedFanfareId = useSettingsStore((s) => s.selectedFanfareId);

  // All players loaded upfront — expo-audio requires static require() paths
  const triumph  = useAudioPlayer(require('../../assets/sounds/fanfare.mp3'));
  const bells    = useAudioPlayer(require('../../assets/sounds/fanfare_bells.mp3'));
  const gentle   = useAudioPlayer(require('../../assets/sounds/fanfare_gentle.mp3'));
  const rising   = useAudioPlayer(require('../../assets/sounds/fanfare_rising.mp3'));
  const majestic = useAudioPlayer(require('../../assets/sounds/fanfare_majestic.mp3'));
  const zen      = useAudioPlayer(require('../../assets/sounds/fanfare_zen.mp3'));

  const players: Record<FanfareId, ReturnType<typeof useAudioPlayer>> = {
    triumph, bells, gentle, rising, majestic, zen,
  };

  // Stable reference — only changes when selectedFanfareId changes
  const player = players[selectedFanfareId];

  async function preview(id: FanfareId) {
    const p = players[id];
    try {
      await setAudioModeAsync({ playsInSilentMode: true });
      p.volume = 0.8;
      await p.seekTo(0);
      p.play();
    } catch {
      // ignore
    }
  }

  return { player, preview };
}
