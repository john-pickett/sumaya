import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

type Props = {
  visible: boolean;
  onClose: () => void;
};

const SECTIONS = [
  {
    heading: 'Getting Comfortable',
    body: `You don't need to sit cross-legged on the floor unless that feels natural. The most important thing is that your spine is upright and you're alert but not rigid. Sit in a chair with your feet flat on the floor, or on a cushion with your legs crossed — whatever keeps you comfortable without slouching. Rest your hands gently on your thighs or in your lap. Close your eyes, or if that feels strange, let your gaze fall softly toward the floor a few feet in front of you.`,
  },
  {
    heading: 'What to Focus On',
    body: `Breath is the most natural anchor for beginners. You're not trying to breathe in any special way — just notice the breath as it already is. Feel the air coming in through your nose, the slight pause at the top, the slow release on the exhale. Pick one spot to pay attention to: the tip of your nose, the rise and fall of your chest, or the expansion of your belly. Stick with that one spot rather than following the breath around your whole body.`,
  },
  {
    heading: 'When Your Mind Wanders',
    body: `This is the part people get wrong. Your mind will wander — that's not a failure, it's the whole game. The moment you notice you've drifted off into thinking about your grocery list or replaying a conversation, that noticing is the meditation. Gently, without frustration, bring your attention back to the breath. Then do it again. And again. A session where you returned your attention fifty times isn't a bad session — it's fifty reps of mental training.`,
  },
  {
    heading: 'Dealing With Interruptions',
    body: `A noise outside, a phone buzz, an itch — these will happen. The goal isn't to achieve perfect silence or stillness. When something interrupts you, treat it the same way you treat a wandering thought: notice it, let it be there without fighting it, and return to your breath. If you need to scratch an itch, scratch it — then come back. Fighting discomfort usually creates more distraction than just addressing it.`,
  },
  {
    heading: 'How Long to Sit',
    body: `Start with short sessions. Many beginners set an unrealistic goal of thirty minutes and then feel like they failed when they can't do it. A few minutes of genuine attention is far more valuable than twenty minutes of frustrated fidgeting. Once a few minutes feels manageable, try ten.`,
  },
  {
    heading: 'A Few Other Things Worth Knowing',
    body: `There's no "blank mind." The goal of meditation is often misunderstood. You're not trying to stop thinking — you're learning to observe thoughts without getting swept away by them. Thoughts will come. That's fine.\n\nThe quality of your return matters more than the wandering. When you bring your attention back, try to do it with kindness toward yourself rather than irritation. Self-criticism during meditation is just another distraction.\n\nConsistency beats duration. Five minutes every day will change you more than forty-five minutes once a week. Think of it like brushing your teeth — brief, daily, and non-negotiable.\n\nThe effects are subtle at first. You probably won't feel profoundly calm after your first session. The benefits accumulate over weeks and tend to show up not during meditation, but in the rest of your life — a little more patience, a little less reactivity.`,
  },
];

const CLOSING_NOTE =
  `A good way to end a session: before you open your eyes, take one slow, deliberate breath, and take a moment to notice how you feel compared to when you started. That small act of reflection helps the habit take root.`;

export default function HowToMeditateModal({ visible, onClose }: Props) {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.card} onPress={() => {}}>
          <View style={styles.handle} />
          <View style={styles.header}>
            <Text style={styles.title}>📖 How to Meditate</Text>
            <Pressable onPress={onClose} hitSlop={16}>
              <Text style={styles.closeBtn}>✕</Text>
            </Pressable>
          </View>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scroll}
          >
            {SECTIONS.map(({ heading, body }) => (
              <View key={heading} style={styles.section}>
                <Text style={styles.sectionHeading}>{heading}</Text>
                <Text style={styles.sectionBody}>{body}</Text>
              </View>
            ))}
            <Text style={[styles.sectionBody, styles.closingNote]}>{CLOSING_NOTE}</Text>
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  card: {
    backgroundColor: '#FFFDF9',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    paddingBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 10,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#C8C2BA',
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E7E1D8',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A2E',
  },
  closeBtn: {
    fontSize: 18,
    color: '#6F6B66',
    fontWeight: '500',
  },
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 8,
  },
  sectionBody: {
    fontSize: 15,
    color: '#6F6B66',
    lineHeight: 23,
  },
  closingNote: {
    marginTop: 4,
    marginBottom: 8,
    fontStyle: 'italic',
  },
});
