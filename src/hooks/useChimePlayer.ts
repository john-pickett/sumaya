import { createAudioPlayer, setAudioModeAsync } from 'expo-audio';
import { useSettingsStore } from '../store/settingsStore';
import type { ChimeId } from '../types/breathing';

export const CHIME_OPTIONS: { id: ChimeId; name: string; description: string }[] = [
  { id: 'crystal', name: 'Crystal',      description: 'Light and airy' },
  { id: 'temple',  name: 'Temple Bell',  description: 'Warm and resonant' },
  { id: 'wind',    name: 'Wind Chime',   description: 'Soft and flowing' },
  { id: 'bowl',    name: 'Singing Bowl', description: 'Deep and sustained' },
  { id: 'tone',    name: 'Pure Tone',    description: 'Clean and minimal' },
  { id: 'bamboo',  name: 'Bamboo',       description: 'Earthy and grounding' },
];

const CHIME_SOURCES: Record<ChimeId, number> = {
  crystal: require('../../assets/sounds/chime.mp3'),
  temple:  require('../../assets/sounds/chime_temple.mp3'),
  wind:    require('../../assets/sounds/chime_wind.mp3'),
  bowl:    require('../../assets/sounds/chime_bowl.mp3'),
  tone:    require('../../assets/sounds/chime_tone.mp3'),
  bamboo:  require('../../assets/sounds/chime_bamboo.mp3'),
};

// Module-level players — created once, never released, not tied to component lifecycle.
const players: Record<ChimeId, ReturnType<typeof createAudioPlayer>> = {
  crystal: createAudioPlayer(CHIME_SOURCES.crystal),
  temple:  createAudioPlayer(CHIME_SOURCES.temple),
  wind:    createAudioPlayer(CHIME_SOURCES.wind),
  bowl:    createAudioPlayer(CHIME_SOURCES.bowl),
  tone:    createAudioPlayer(CHIME_SOURCES.tone),
  bamboo:  createAudioPlayer(CHIME_SOURCES.bamboo),
};

export function useChimePlayer() {
  const selectedChimeId = useSettingsStore((s) => s.selectedChimeId);

  // Synchronous: replace() resets position to start without an async seekTo gap
  function play() {
    try {
      const p = players[selectedChimeId];
      p.replace(CHIME_SOURCES[selectedChimeId]);
      p.volume = 0.6;
      p.play();
    } catch {
      // ignore
    }
  }

  async function preview(id: ChimeId) {
    const p = players[id];
    try {
      await setAudioModeAsync({ playsInSilentMode: true });
      p.replace(CHIME_SOURCES[id]);
      p.volume = 0.6;
      p.play();
    } catch {
      // ignore
    }
  }

  return { play, preview };
}
