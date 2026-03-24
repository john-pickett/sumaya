import { useEffect, useRef, useState } from 'react';
import { Animated, Easing } from 'react-native';
import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';
import type { Exercise } from '../types/breathing';

export type ExerciseStatus = 'countdown' | 'running' | 'done';

type BreathingAnimation = {
  scale: Animated.Value;
  status: ExerciseStatus;
  countdownLabel: string;
  currentPhaseLabel: string;
  secondsRemaining: number;
  cyclesRemaining: number;
};

function targetScale(label: string): number {
  const lower = label.toLowerCase();
  if (lower.includes('inhale')) return 1.0;
  if (lower.includes('exhale')) return 0.4;
  return -1; // hold — no change
}

export function useBreathingAnimation(exercise: Exercise): BreathingAnimation {
  const scale = useRef(new Animated.Value(0.4)).current;
  const [status, setStatus] = useState<ExerciseStatus>('countdown');
  const [countdownLabel, setCountdownLabel] = useState('2');
  const [currentPhaseLabel, setCurrentPhaseLabel] = useState(exercise.phases[0].label);
  const [secondsRemaining, setSecondsRemaining] = useState(exercise.phases[0].duration);
  const [cyclesRemaining, setCyclesRemaining] = useState(exercise.length);

  const stopRef = useRef(false);
  const soundRef = useRef<Audio.Sound | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    stopRef.current = false;

    async function loadSound() {
      try {
        await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
        const { sound } = await Audio.Sound.createAsync(
          require('../../assets/sounds/chime.mp3'),
          { shouldPlay: false, volume: 0.6 },
        );
        soundRef.current = sound;
      } catch {
        // audio is a nice-to-have; silently continue without it
      }
    }

    async function playChime() {
      try {
        if (soundRef.current) {
          await soundRef.current.setPositionAsync(0);
          await soundRef.current.playAsync();
        }
      } catch {
        // ignore playback errors
      }
    }

    function fireTransitionCues() {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
      playChime();
    }

    function startCountdown(duration: number) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setSecondsRemaining(duration);
      intervalRef.current = setInterval(() => {
        setSecondsRemaining((s) => Math.max(0, s - 1));
      }, 1000);
    }

    function runPhase(phaseIndex: number, remaining: number) {
      if (stopRef.current) return;

      const phase = exercise.phases[phaseIndex];
      fireTransitionCues();
      setCurrentPhaseLabel(phase.label);
      startCountdown(phase.duration);

      const to = targetScale(phase.label);
      const durationMs = phase.duration * 1000;

      const anim =
        to === -1
          ? Animated.delay(durationMs)
          : Animated.timing(scale, {
              toValue: to,
              duration: durationMs,
              easing: Easing.inOut(Easing.sin),
              useNativeDriver: true,
            });

      anim.start(({ finished }) => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        if (!finished || stopRef.current) return;

        const nextIndex = (phaseIndex + 1) % exercise.phases.length;

        if (nextIndex === 0) {
          // completed a full cycle
          const nextRemaining = remaining - 1;
          setCyclesRemaining(nextRemaining);
          if (nextRemaining === 0) {
            setStatus('done');
            return;
          }
          runPhase(0, nextRemaining);
        } else {
          runPhase(nextIndex, remaining);
        }
      });
    }

    function scheduleTimeout(fn: () => void, ms: number) {
      const id = setTimeout(fn, ms);
      timeoutsRef.current.push(id);
    }

    // Countdown sequence: "2" → "1" → "Go" → start
    setStatus('countdown');
    setCountdownLabel('2');
    setCyclesRemaining(exercise.length);

    scheduleTimeout(() => { if (!stopRef.current) setCountdownLabel('1'); }, 1000);
    scheduleTimeout(() => { if (!stopRef.current) setCountdownLabel('Go'); }, 2000);
    scheduleTimeout(() => {
      if (stopRef.current) return;
      setStatus('running');
      loadSound().then(() => {
        if (!stopRef.current) runPhase(0, exercise.length);
      });
    }, 3000);

    return () => {
      stopRef.current = true;
      if (intervalRef.current) clearInterval(intervalRef.current);
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current = [];
      scale.stopAnimation();
      soundRef.current?.unloadAsync().catch(() => {});
    };
  }, [exercise.id]); // eslint-disable-line react-hooks/exhaustive-deps

  return { scale, status, countdownLabel, currentPhaseLabel, secondsRemaining, cyclesRemaining };
}
