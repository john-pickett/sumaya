import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import type { MoodValue } from '../types/breathing';
import { colors } from '../theme';

type MoodOption = {
  value: MoodValue;
  emoji: string;
  label: string;
};

const MOOD_OPTIONS: MoodOption[] = [
  { value: 'awful', emoji: '😩', label: 'Awful' },
  { value: 'bad', emoji: '😔', label: 'Bad' },
  { value: 'meh', emoji: '😐', label: 'Meh' },
  { value: 'good', emoji: '🙂', label: 'Good' },
  { value: 'great', emoji: '😊', label: 'Great' },
  { value: 'amazing', emoji: '🤩', label: 'Amazing' },
];

type Props = {
  visible: boolean;
  accentColor: string;
  onSelect: (mood: MoodValue) => void;
  onSkip: () => void;
};

export default function PostExerciseMoodDialog({ visible, accentColor, onSelect, onSkip }: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.title}>How are you feeling now?</Text>
          <View style={styles.grid}>
            {MOOD_OPTIONS.map((option) => (
              <Pressable
                key={option.value}
                style={({ pressed }) => [styles.moodButton, pressed && { backgroundColor: accentColor + '22' }]}
                onPress={() => onSelect(option.value)}
              >
                <Text style={styles.moodEmoji}>{option.emoji}</Text>
                <Text style={styles.moodLabel}>{option.label}</Text>
              </Pressable>
            ))}
          </View>
          <Pressable onPress={onSkip} hitSlop={12}>
            <Text style={styles.skipText}>Skip</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: colors.modalBackdrop,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 20,
    paddingVertical: 28,
    paddingHorizontal: 24,
    width: '100%',
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 24,
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 24,
  },
  moodButton: {
    width: '28%',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 14,
    backgroundColor: colors.background,
  },
  moodEmoji: {
    fontSize: 32,
    marginBottom: 4,
  },
  moodLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textDark,
  },
  skipText: {
    fontSize: 15,
    color: colors.textFaint,
    fontWeight: '500',
  },
});
