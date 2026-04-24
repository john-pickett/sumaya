import { useMemo } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import type { Colors } from '../theme';

type Props = {
  visible: boolean;
  onYes: () => void;
  onNo: () => void;
};

export default function NotificationReminderModal({ visible, onYes, onNo }: Props) {
  const colors = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.emoji}>🔔</Text>
          <Text style={styles.title}>Want a reminder for tomorrow?</Text>
          <Text style={styles.subtitle}>We'll nudge you to keep your streak going.</Text>
          <Pressable
            style={({ pressed }) => [styles.yesButton, pressed && styles.yesButtonPressed]}
            onPress={onYes}
          >
            <Text style={styles.yesButtonText}>Yes, remind me</Text>
          </Pressable>
          <Pressable onPress={onNo} hitSlop={12}>
            <Text style={styles.noText}>No thanks</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const makeStyles = (colors: Colors) => StyleSheet.create({
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
    paddingVertical: 32,
    paddingHorizontal: 24,
    width: '100%',
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  emoji: {
    fontSize: 44,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 28,
  },
  yesButton: {
    backgroundColor: colors.accent,
    paddingHorizontal: 48,
    paddingVertical: 14,
    borderRadius: 32,
    marginBottom: 16,
    width: '100%',
    alignItems: 'center',
  },
  yesButtonPressed: {
    opacity: 0.85,
  },
  yesButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.white,
    letterSpacing: 0.3,
  },
  noText: {
    fontSize: 15,
    color: colors.textFaint,
    fontWeight: '500',
  },
});
