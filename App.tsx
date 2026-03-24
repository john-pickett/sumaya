import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import BreathingListScreen from './src/screens/BreathingListScreen';
import BreathingExerciseScreen from './src/screens/BreathingExerciseScreen';
import PlaceholderScreen from './src/screens/PlaceholderScreen';
import type { Exercise } from './src/types/breathing';

type TabKey = 'meditate' | 'breathe' | 'journey' | 'settings';

const tabs: { key: TabKey; label: string; icon: string }[] = [
  { key: 'meditate', label: 'Meditate', icon: '🧘' },
  { key: 'breathe', label: 'Breathe', icon: '🌬️' },
  { key: 'journey', label: 'Journey', icon: '🗺️' },
  { key: 'settings', label: 'Settings', icon: '⚙️' },
];

export default function App() {
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>('breathe');

  function renderCurrentTab() {
    switch (activeTab) {
      case 'meditate':
        return (
          <PlaceholderScreen
            emoji="🧘"
            title="Meditate"
            description="Meditation sessions will live here soon."
          />
        );
      case 'journey':
        return (
          <PlaceholderScreen
            emoji="🗺️"
            title="Journey"
            description="Your progress and milestones will show up here soon."
          />
        );
      case 'settings':
        return (
          <PlaceholderScreen
            emoji="⚙️"
            title="Settings"
            description="Preferences and app settings will be available here soon."
          />
        );
      case 'breathe':
      default:
        if (selectedExercise) {
          return (
            <BreathingExerciseScreen
              exercise={selectedExercise}
              onBack={() => setSelectedExercise(null)}
            />
          );
        }

        return <BreathingListScreen onSelectExercise={setSelectedExercise} />;
    }
  }

  return (
    <SafeAreaProvider>
      <View style={styles.app}>
        <View style={styles.content}>{renderCurrentTab()}</View>
        <SafeAreaView style={styles.tabBar} edges={['bottom']}>
          {tabs.map((tab) => {
            const isActive = tab.key === activeTab;

            return (
              <Pressable
                key={tab.key}
                style={styles.tabItem}
                onPress={() => setActiveTab(tab.key)}
              >
                <Text style={[styles.tabIcon, isActive && styles.tabIconActive]}>{tab.icon}</Text>
                <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                  {tab.label}
                </Text>
              </Pressable>
            );
          })}
        </SafeAreaView>
      </View>
      <StatusBar style="dark" />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  app: {
    flex: 1,
    backgroundColor: '#F7F5F2',
  },
  content: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFDF9',
    borderTopWidth: 1,
    borderTopColor: '#E7E1D8',
    paddingTop: 10,
    paddingBottom: 14,
    paddingHorizontal: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 4,
  },
  tabIcon: {
    fontSize: 20,
    opacity: 0.55,
  },
  tabIconActive: {
    opacity: 1,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8E8A83',
  },
  tabLabelActive: {
    color: '#1A1A2E',
  },
});
