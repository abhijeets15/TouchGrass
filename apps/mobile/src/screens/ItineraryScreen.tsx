import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, spacing, radius, typography } from '../constants/theme';
import { PrimaryButton } from '../components/PrimaryButton';
import { useVibeStore } from '../store/vibeStore';
import { useItinerary } from '../hooks/useItinerary';
import type { RootStackParamList } from '../navigation';
import type { ItineraryStop } from '../constants/types';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Itinerary'>;

const GROUP_EMOJI: Record<string, string> = {
  solo: '🧍',
  date: '💑',
  friends: '👥',
  family: '👨‍👩‍👧',
};

const BUDGET_LABEL: Record<string, string> = {
  free: 'Free',
  cheap: 'Under $20',
  moderate: '$20–$60',
  splurge: 'Splurge',
};

export function ItineraryScreen() {
  const navigation = useNavigation<Nav>();
  const { itinerary, error, vibe, group, budget, reset } = useVibeStore();
  const { buildItinerary } = useItinerary();

  const handleRegenerate = async () => {
    navigation.navigate('Loading');
    await buildItinerary();
    navigation.navigate('Itinerary');
  };

  const handleRestart = () => {
    reset();
    navigation.navigate('VibePicker');
  };

  if (error) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Something went wrong</Text>
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
          <PrimaryButton label="Try again" onPress={handleRegenerate} />
          <PrimaryButton label="Start over" onPress={handleRestart} variant="outline" />
        </View>
      </SafeAreaView>
    );
  }

  if (!itinerary) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>No itinerary found</Text>
          <PrimaryButton label="Start over" onPress={handleRestart} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.vibeTag}>
            <Text style={styles.vibeTagText}>
              {vibe ? vibe.charAt(0).toUpperCase() + vibe.slice(1) : ''} night
            </Text>
          </View>
          <Text style={styles.title}>{itinerary.title}</Text>
          <View style={styles.meta}>
            <Text style={styles.metaItem}>⏱ {itinerary.duration}</Text>
            <Text style={styles.metaItem}>
              {group ? GROUP_EMOJI[group] : '👥'} {group ? group.charAt(0).toUpperCase() + group.slice(1) : ''}
            </Text>
            <Text style={styles.metaItem}>
              💸 {budget ? BUDGET_LABEL[budget] : ''}
            </Text>
          </View>
        </View>

        {/* Stops */}
        <View style={styles.body}>
          {itinerary.stops.map((stop: ItineraryStop, i: number) => (
            <React.Fragment key={`${stop.name}-${i}`}>
              {i > 0 && (
                <View style={styles.connector}>
                  <Text style={styles.connectorText}>↓  ~10 min walk</Text>
                </View>
              )}
              <StopCard stop={stop} index={i} total={itinerary.stops.length} />
            </React.Fragment>
          ))}

          {itinerary.closingNote && (
            <Text style={styles.closingNote}>{itinerary.closingNote}</Text>
          )}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.costRow}>
            <Text style={styles.costLabel}>Estimated total</Text>
            <Text style={styles.costValue}>{itinerary.estimatedCost}</Text>
          </View>
          <PrimaryButton label="Regenerate plan" onPress={handleRegenerate} />
          <PrimaryButton label="Start over" onPress={handleRestart} variant="outline" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function StopCard({ stop, index, total }: { stop: ItineraryStop; index: number; total: number }) {
  return (
    <View style={stopStyles.card}>
      <View style={stopStyles.accent} />
      <Text style={stopStyles.number}>Stop {index + 1} of {total}</Text>
      <Text style={stopStyles.name}>{stop.name}</Text>
      <Text style={stopStyles.type}>{stop.type}</Text>
      <View style={stopStyles.divider} />
      <Text style={stopStyles.note}>{stop.note}</Text>
      <View style={stopStyles.badges}>
        <View style={stopStyles.badge}>
          <Text style={stopStyles.badgeText}>⏱ {stop.duration}</Text>
        </View>
        <View style={stopStyles.badge}>
          <Text style={stopStyles.badgeText}>{stop.priceTier}</Text>
        </View>
      </View>
    </View>
  );
}

const stopStyles = StyleSheet.create({
  card: {
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.xl,
    padding: spacing.md,
    marginBottom: spacing.sm,
    overflow: 'hidden',
  },
  accent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    backgroundColor: colors.primary,
    borderTopLeftRadius: radius.xl,
    borderBottomLeftRadius: radius.xl,
  },
  number: {
    ...typography.label,
    color: colors.primary,
    marginBottom: 4,
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  type: {
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: spacing.sm,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginBottom: spacing.sm,
  },
  note: {
    ...typography.bodyMd,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: spacing.sm,
  },
  badges: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.sm,
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  badgeText: {
    fontSize: 11,
    color: colors.textMuted,
  },
});

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: {
    padding: spacing.lg,
    paddingTop: spacing.xxl,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a1f',
  },
  vibeTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
    borderRadius: radius.pill,
    backgroundColor: colors.primaryDim,
    marginBottom: spacing.md,
  },
  vibeTagText: {
    ...typography.label,
    color: colors.primary,
  },
  title: {
    ...typography.displaySm,
    color: colors.textPrimary,
    marginBottom: spacing.md,
    lineHeight: 28,
  },
  meta: {
    flexDirection: 'row',
    gap: spacing.md,
    flexWrap: 'wrap',
  },
  metaItem: {
    fontSize: 12,
    color: colors.textMuted,
  },
  body: {
    padding: spacing.lg,
  },
  connector: {
    paddingLeft: spacing.md,
    paddingVertical: 4,
    marginBottom: 4,
  },
  connectorText: {
    fontSize: 11,
    color: '#333',
  },
  closingNote: {
    fontSize: 13,
    color: colors.textDim,
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 20,
    paddingVertical: spacing.md,
  },
  footer: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
    borderTopWidth: 1,
    borderTopColor: '#1a1a1f',
  },
  costRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  costLabel: { fontSize: 13, color: colors.textMuted },
  costValue: { fontSize: 18, fontWeight: '600', color: colors.textPrimary },
  errorContainer: {
    flex: 1,
    padding: spacing.lg,
    paddingTop: spacing.xxl,
    gap: spacing.md,
  },
  errorTitle: {
    ...typography.displaySm,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  errorBox: {
    backgroundColor: colors.primaryDim,
    borderWidth: 1,
    borderColor: 'rgba(255,92,53,0.2)',
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  errorText: {
    fontSize: 13,
    color: colors.primary,
    lineHeight: 20,
  },
});
