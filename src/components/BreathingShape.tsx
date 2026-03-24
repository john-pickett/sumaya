import { Animated, View } from 'react-native';
import type { Exercise } from '../types/breathing';

type Props = {
  scale: Animated.Value;
  exercise: Exercise;
  size?: number;
};

export default function BreathingShape({ scale, exercise, size = 160 }: Props) {
  const { color, shape } = exercise;
  const transform = [{ scale }];

  if (shape === 'circle') {
    return (
      <Animated.View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
          transform,
        }}
      />
    );
  }

  if (shape === 'square') {
    return (
      <Animated.View
        style={{
          width: size,
          height: size,
          borderRadius: 12,
          backgroundColor: color,
          transform,
        }}
      />
    );
  }

  if (shape === 'triangle') {
    const half = size / 2;
    return (
      <Animated.View style={{ transform, alignItems: 'center' }}>
        <View
          style={{
            width: 0,
            height: 0,
            borderLeftWidth: half,
            borderRightWidth: half,
            borderBottomWidth: size,
            borderLeftColor: 'transparent',
            borderRightColor: 'transparent',
            borderBottomColor: color,
          }}
        />
      </Animated.View>
    );
  }

  // star
  return (
    <Animated.Text
      style={{
        fontSize: size,
        color,
        lineHeight: size,
        transform,
      }}
    >
      ★
    </Animated.Text>
  );
}
