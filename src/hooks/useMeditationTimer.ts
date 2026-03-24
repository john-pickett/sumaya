import { useRef, useState } from 'react';
import { Animated } from 'react-native';
import { setAudioModeAsync, useAudioPlayer } from 'expo-audio';
import * as Haptics from 'expo-haptics';
import { useChimePlayer } from './useChimePlayer';

export type MeditationStatus = 'idle' | 'preparing' | 'running' | 'done';

type MeditationTimer = {
  status: MeditationStatus;
  totalSeconds: number;
  secondsRemaining: number;
  progress: Animated.Value;
  prepMessage: string | null;
  start: (durationMinutes: number) => void;
  reset: () => void;
};

function randomChimeDelay() {
  // Random delay between 60 and 90 seconds
  return (60 + Math.floor(Math.random() * 31)) * 1000;
}

export function useMeditationTimer(): MeditationTimer {
  const { player: chimePlayer } = useChimePlayer();
  const fanfarePlayer = useAudioPlayer(require('../../assets/sounds/fanfare.mp3'));

  const [status, setStatus] = useState<MeditationStatus>('idle');
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [secondsRemaining, setSecondsRemaining] = useState(0);
  const [prepMessage, setPrepMessage] = useState<string | null>(null);
  const progress = useRef(new Animated.Value(0)).current;

  const stopRef = useRef(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const chimeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prepTimeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const animRef = useRef<Animated.CompositeAnimation | null>(null);

  async function configureAudio() {
    try {
      await setAudioModeAsync({ playsInSilentMode: true });
    } catch {
      // audio is a nice-to-have
    }
  }

  async function playChime() {
    try {
      chimePlayer.volume = 0.6;
      await chimePlayer.seekTo(0);
      chimePlayer.play();
    } catch {
      // ignore
    }
  }

  async function playFanfare() {
    try {
      fanfarePlayer.volume = 0.8;
      await fanfarePlayer.seekTo(0);
      fanfarePlayer.play();
    } catch {
      // ignore
    }
  }

  function scheduleNextChime() {
    if (stopRef.current) return;
    chimeTimeoutRef.current = setTimeout(() => {
      if (stopRef.current) return;
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
      playChime();
      scheduleNextChime();
    }, randomChimeDelay());
  }

  function stop() {
    stopRef.current = true;
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (chimeTimeoutRef.current) {
      clearTimeout(chimeTimeoutRef.current);
      chimeTimeoutRef.current = null;
    }
    prepTimeoutsRef.current.forEach(clearTimeout);
    prepTimeoutsRef.current = [];
    animRef.current?.stop();
    animRef.current = null;
  }

  function beginMeditation(seconds: number) {
    if (stopRef.current) return;
    setPrepMessage(null);
    setStatus('running');

    // Countdown interval
    intervalRef.current = setInterval(() => {
      setSecondsRemaining((s) => {
        const next = s - 1;
        if (next <= 0) {
          clearInterval(intervalRef.current!);
          intervalRef.current = null;
          stopRef.current = true;
          if (chimeTimeoutRef.current) {
            clearTimeout(chimeTimeoutRef.current);
            chimeTimeoutRef.current = null;
          }
          setStatus('done');
          playFanfare();
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
          return 0;
        }
        return next;
      });
    }, 1000);

    // Arc animation: progress 0 → 1 over the full duration
    const anim = Animated.timing(progress, {
      toValue: 1,
      duration: seconds * 1000,
      useNativeDriver: false,
    });
    animRef.current = anim;
    anim.start();

    // Schedule first chime
    scheduleNextChime();
  }

  function start(durationMinutes: number) {
    const seconds = durationMinutes * 60;
    stopRef.current = false;
    setTotalSeconds(seconds);
    setSecondsRemaining(seconds);
    progress.setValue(0);
    setStatus('preparing');

    const PREP_MESSAGES = ['Get comfortable', 'Focus on your breathing', 'Begin'];

    PREP_MESSAGES.forEach((msg, i) => {
      const id = setTimeout(() => {
        if (!stopRef.current) setPrepMessage(msg);
      }, i * 1000);
      prepTimeoutsRef.current.push(id);
    });

    const startId = setTimeout(() => {
      configureAudio().then(() => beginMeditation(seconds));
    }, PREP_MESSAGES.length * 1000);
    prepTimeoutsRef.current.push(startId);
  }

  function reset() {
    stop();
    stopRef.current = false;
    progress.setValue(0);
    setTotalSeconds(0);
    setSecondsRemaining(0);
    setPrepMessage(null);
    setStatus('idle');
  }

  return { status, totalSeconds, secondsRemaining, progress, prepMessage, start, reset };
}
