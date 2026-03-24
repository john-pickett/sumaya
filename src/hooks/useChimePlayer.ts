import { setAudioModeAsync, useAudioPlayer } from 'expo-audio';
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

export function useChimePlayer() {
  const selectedChimeId = useSettingsStore((s) => s.selectedChimeId);

  // All players loaded upfront — expo-audio requires static require() paths
  const crystal = useAudioPlayer(require('../../assets/sounds/chime.mp3'));
  const temple  = useAudioPlayer(require('../../assets/sounds/chime_temple.mp3'));
  const wind    = useAudioPlayer(require('../../assets/sounds/chime_wind.mp3'));
  const bowl    = useAudioPlayer(require('../../assets/sounds/chime_bowl.mp3'));
  const tone    = useAudioPlayer(require('../../assets/sounds/chime_tone.mp3'));
  const bamboo  = useAudioPlayer(require('../../assets/sounds/chime_bamboo.mp3'));

  const players: Record<ChimeId, ReturnType<typeof useAudioPlayer>> = {
    crystal, temple, wind, bowl, tone, bamboo,
  };

  // Stable reference — only changes when selectedChimeId changes
  const player = players[selectedChimeId];

  async function preview(id: ChimeId) {
    const p = players[id];
    try {
      await setAudioModeAsync({ playsInSilentMode: true });
      p.volume = 0.6;
      await p.seekTo(0);
      p.play();
    } catch {
      // ignore
    }
  }

  return { player, preview };
}
