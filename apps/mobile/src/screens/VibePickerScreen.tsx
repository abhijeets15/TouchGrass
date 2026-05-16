import React from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { VIBES, type VibeId } from '../constants/vibes';
import { colors, spacing, radius, typography } from '../constants/theme';
import { PrimaryButton } from '../components/PrimaryButton';
import { useVibeStore } from '../store/vibeStore';
import type { RootStackParamList } from '../navigation';

type Nav = NativeStackNavigationProp<RootStackParamList, 'VibePicker'>;

export function VibePickerScreen() {
  const navigation = useNavigation<Nav>();
  const { vibe, setVibe } = useVibeStore();

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.eyebrow}>VIBECHECK</Text>
        <Text style={styles.heading}>What's the{'\n'}vibe tonight?</Text>
        <Text style={styles.sub}>Pick your mood and we'll handle the rest.</Text>

        <View style={styles.grid}>
          {VIBES.map((v) => (
            <Pressable
              key={v.id}
              onPress={() => setVibe(v.id as VibeId)}
              style={({ pressed }) => [
                styles.vibeCard,
                vibe === v.id && styles.vibeCardSelected,
                pressed && styles.vibeCardPressed,
              ]}
            >
              <Text style={styles.vibeEmoji}>{v.emoji}</Text>
              <Text style={[styles.vibeName, vibe === v.id && styles.vibeNameSelected]}>
                {v.label}
              </Text>
              <Text style={styles.vibeDesc}>{v.desc}</Text>
            </Pressable>
          ))}
        </View>

        <PrimaryButton
          label="Continue →"
          onPress={() => navigation.navigate('Filters')}
          disabled={!vibe}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  scroll: {
    padding: spacing.lg,
    paddingTop: spacing.xxl,
  },
  eyebrow: {
    ...typography.label,
    color: colors.primary,
    marginBottom: spacing.md,
  },
  heading: {
    ...typography.displayLg,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  sub: {
    ...typography.bodyMd,
    color: colors.textMuted,
    marginBottom: spacing.xl,
    lineHeight: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  vibeCard: {
    width: '48%',
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.xl,
    padding: spacing.md,
  },
  vibeCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryDim,
  },
  vibeCardPressed: {
    opacity: 0.75,
  },
  vibeEmoji: {
    fontSize: 22,
    marginBottom: spacing.xs,
  },
  vibeName: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  vibeNameSelected: {
    color: colors.primary,
  },
  vibeDesc: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
});
