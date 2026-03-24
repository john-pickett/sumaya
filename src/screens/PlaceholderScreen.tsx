import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = {
  emoji: string;
  title: string;
  description: string;
};

export default function PlaceholderScreen({ emoji, title, description }: Props) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.emoji}>{emoji}</Text>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F5F2',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#FFFDF9',
    borderRadius: 28,
    paddingVertical: 40,
    paddingHorizontal: 28,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E7E1D8',
  },
  emoji: {
    fontSize: 52,
    marginBottom: 18,
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    color: '#6F6B66',
  },
});
