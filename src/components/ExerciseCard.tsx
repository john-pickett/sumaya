import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { Exercise } from '../types/breathing';

type Props = {
  exercise: Exercise;
  onPress?: () => void;
};

export default function ExerciseCard({ exercise, onPress }: Props) {
  const { name, emotion, emoji, color, description } = exercise;

  return (
    <Pressable
      style={({ pressed }) => [styles.card, { opacity: pressed ? 0.85 : 1 }]}
      onPress={onPress}
    >
      <View style={[styles.colorBar, { backgroundColor: color }]} />
      <View style={[styles.body, { backgroundColor: color + '1F' }]}>
        <View style={styles.header}>
          <Text style={styles.emoji}>{emoji}</Text>
          <Text style={styles.emotion}>{emotion}</Text>
        </View>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderRadius: 14,
    overflow: 'hidden',
    marginHorizontal: 20,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  colorBar: {
    width: 5,
  },
  body: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 8,
  },
  emoji: {
    fontSize: 22,
  },
  emotion: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1A1A2E',
    flexShrink: 1,
  },
  name: {
    fontSize: 14,
    fontWeight: '500',
    color: '#444',
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
});
