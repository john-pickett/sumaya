import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSettingsStore } from '../store/settingsStore';
import { useChimePlayer, CHIME_OPTIONS } from '../hooks/useChimePlayer';
import type { ChimeId } from '../types/breathing';

const ACCENT = '#7B68B5';
const BG = '#F7F5F2';
const CARD_BG = '#FFFDF9';
const BORDER = '#E7E1D8';
const TEXT_PRIMARY = '#1A1A2E';
const TEXT_SECONDARY = '#6F6B66';

export default function SettingsScreen() {
  const selectedChimeId = useSettingsStore((s) => s.selectedChimeId);
  const setChimeId = useSettingsStore((s) => s.setChimeId);
  const { preview } = useChimePlayer();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.screenTitle}>Settings</Text>
        </View>

        <Text style={styles.sectionLabel}>CHIME SOUND</Text>

        <View style={styles.card}>
          {CHIME_OPTIONS.map((option, index) => {
            const isSelected = option.id === selectedChimeId;
            const isLast = index === CHIME_OPTIONS.length - 1;

            return (
              <View key={option.id}>
                <Pressable
                  style={[styles.row, isSelected && styles.rowSelected]}
                  onPress={() => setChimeId(option.id as ChimeId)}
                >
                  {/* Radio indicator */}
                  <View style={[styles.radio, isSelected && styles.radioSelected]}>
                    {isSelected && <View style={styles.radioDot} />}
                  </View>

                  {/* Name + description */}
                  <View style={styles.rowText}>
                    <Text style={[styles.chimeName, isSelected && styles.chimeNameSelected]}>
                      {option.name}
                    </Text>
                    <Text style={styles.chimeDesc}>{option.description}</Text>
                  </View>

                  {/* Preview button */}
                  <Pressable
                    style={styles.playButton}
                    onPress={() => preview(option.id as ChimeId)}
                    hitSlop={8}
                  >
                    <Text style={[styles.playIcon, isSelected && styles.playIconSelected]}>▶</Text>
                  </Pressable>
                </Pressable>

                {!isLast && <View style={styles.divider} />}
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
  },
  scroll: {
    paddingBottom: 48,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: TEXT_PRIMARY,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: TEXT_SECONDARY,
    letterSpacing: 0.8,
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 8,
  },
  card: {
    marginHorizontal: 16,
    backgroundColor: CARD_BG,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: BORDER,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  rowSelected: {
    backgroundColor: ACCENT + '12',
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#C8C2BA',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  radioSelected: {
    borderColor: ACCENT,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: ACCENT,
  },
  rowText: {
    flex: 1,
  },
  chimeName: {
    fontSize: 16,
    fontWeight: '500',
    color: TEXT_PRIMARY,
    marginBottom: 2,
  },
  chimeNameSelected: {
    fontWeight: '600',
    color: ACCENT,
  },
  chimeDesc: {
    fontSize: 13,
    color: TEXT_SECONDARY,
  },
  playButton: {
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  playIcon: {
    fontSize: 14,
    color: '#C8C2BA',
  },
  playIconSelected: {
    color: ACCENT,
  },
  divider: {
    height: 1,
    backgroundColor: BORDER,
    marginLeft: 52,
  },
});
