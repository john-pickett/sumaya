import { createAudioPlayer, setAudioModeAsync } from 'expo-audio';
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

// Sources kept alongside players so replace() can reset position without async seekTo
const FANFARE_SOURCES: Record<FanfareId, number> = {
  triumph:  require('../../assets/sounds/fanfare.mp3'),
  bells:    require('../../assets/sounds/fanfare_bells.mp3'),
  gentle:   require('../../assets/sounds/fanfare_gentle.mp3'),
  rising:   require('../../assets/sounds/fanfare_rising.mp3'),
  majestic: require('../../assets/sounds/fanfare_majestic.mp3'),
  zen:      require('../../assets/sounds/fanfare_zen.mp3'),
};

// Module-level players — created once, never released, not tied to component lifecycle.
// useAudioPlayer (useReleasingSharedObject) releases the native SharedObject on unmount;
// calling play() after unmount crashes on Fabric/JSI. createAudioPlayer avoids this entirely.
const players: Record<FanfareId, ReturnType<typeof createAudioPlayer>> = {
  triumph:  createAudioPlayer(FANFARE_SOURCES.triumph),
  bells:    createAudioPlayer(FANFARE_SOURCES.bells),
  gentle:   createAudioPlayer(FANFARE_SOURCES.gentle),
  rising:   createAudioPlayer(FANFARE_SOURCES.rising),
  majestic: createAudioPlayer(FANFARE_SOURCES.majestic),
  zen:      createAudioPlayer(FANFARE_SOURCES.zen),
};

export function useFanfarePlayer() {
  const selectedFanfareId = useSettingsStore((s) => s.selectedFanfareId);

  // Synchronous: replace() resets position to start without an async seekTo gap
  function play() {
    try {
      const p = players[selectedFanfareId];
      p.replace(FANFARE_SOURCES[selectedFanfareId]);
      p.volume = 0.8;
      p.play();
    } catch {
      // ignore
    }
  }

  async function preview(id: FanfareId) {
    const p = players[id];
    try {
      await setAudioModeAsync({ playsInSilentMode: true });
      p.replace(FANFARE_SOURCES[id]);
      p.volume = 0.8;
      p.play();
    } catch {
      // ignore
    }
  }

  return { play, preview };
}
