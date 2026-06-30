import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Pressable,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, spacing, radius, typography } from '../constants/theme';
import { PrimaryButton } from '../components/PrimaryButton';
import { useVibeStore } from '../store/vibeStore';
import { useItinerary } from '../hooks/useItinerary';
import type { MainStackParamList } from '../navigation/types';
import type { Itinerary } from '../constants/types';

type Nav = NativeStackNavigationProp<MainStackParamList, 'ItinerarySelection'>;

export function ItinerarySelectionScreen() {
  const navigation = useNavigation<Nav>();
  const { itineraries, isLoading, error, vibe, budget, time, group, distance, reset } = useVibeStore();
  const { buildItinerary } = useItinerary();

  React.useEffect(() => {
    if (itineraries.length === 0 && !isLoading && !error) {
      buildItinerary();
    }
  }, []);

  const handleRefresh = async () => {
    await buildItinerary();
  };

  const handleSelectItinerary = (itinerary: Itinerary) => {
    useVibeStore.getState().setSelectedItinerary(itinerary);
    navigation.navigate('Itinerary');
  };

  const handleBack = () => {
    reset();
    navigation.goBack();
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <Text style={styles.loadingText}>Generating your itineraries...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <Text style={styles.errorTitle}>Something went wrong</Text>
          <Text style={styles.errorText}>{error}</Text>
          <PrimaryButton label="Try again" onPress={handleRefresh} />
          <PrimaryButton label="Go back" onPress={handleBack} variant="outline" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </Pressable>
        <Text style={styles.title}>Choose your itinerary</Text>
        <Pressable onPress={handleRefresh} style={styles.refreshButton}>
          <Text style={styles.refreshText}>↻ Refresh</Text>
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {itineraries.map((itinerary, index) => (
          <ItineraryCard
            key={index}
            itinerary={itinerary}
            index={index}
            onSelect={() => handleSelectItinerary(itinerary)}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

function ItineraryCard({
  itinerary,
  index,
  onSelect,
}: {
  itinerary: Itinerary;
  index: number;
  onSelect: () => void;
}) {
  return (
    <Pressable onPress={onSelect} style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.cardNumber}>
          <Text style={styles.cardNumberText}>{index + 1}</Text>
        </View>
        <Text style={styles.cardTitle}>{itinerary.title}</Text>
      </View>
      
      <View style={styles.cardMeta}>
        <Text style={styles.metaItem}>{itinerary.duration}</Text>
        <Text style={styles.metaItem}>{itinerary.estimatedCost}</Text>
      </View>

      <View style={styles.stopsPreview}>
        <Text style={styles.stopsLabel}>Stops:</Text>
        {itinerary.stops.slice(0, 3).map((stop, i) => (
          <Text key={i} style={styles.stopPreview}>
            • {stop.name}
          </Text>
        ))}
        {itinerary.stops.length > 3 && (
          <Text style={styles.stopPreview}>+{itinerary.stops.length - 3} more</Text>
        )}
      </View>

      <View style={styles.cardFooter}>
        <Text style={styles.selectText}>Tap to view details →</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
    paddingTop: spacing.xxl,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a1f',
  },
  backButton: {
    padding: spacing.sm,
  },
  backText: {
    ...typography.bodyMd,
    color: colors.primary,
    fontWeight: '600',
  },
  title: {
    ...typography.displaySm,
    color: colors.textPrimary,
  },
  refreshButton: {
    padding: spacing.sm,
  },
  refreshText: {
    ...typography.bodyMd,
    color: colors.primary,
    fontWeight: '600',
  },
  scrollContent: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  card: {
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.xl,
    padding: spacing.lg,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  cardNumber: {
    width: 32,
    height: 32,
    borderRadius: radius.pill,
    backgroundColor: colors.primaryDim,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  cardNumberText: {
    ...typography.label,
    color: colors.primary,
    fontWeight: '700',
  },
  cardTitle: {
    ...typography.bodyLg,
    fontWeight: '600',
    color: colors.textPrimary,
    flex: 1,
  },
  cardMeta: {
    flexDirection: 'column',
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  metaItem: {
    ...typography.bodySm,
    color: colors.textMuted,
  },
  stopsPreview: {
    marginBottom: spacing.md,
  },
  stopsLabel: {
    ...typography.bodySm,
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },
  stopPreview: {
    ...typography.bodySm,
    color: colors.textSecondary,
    marginLeft: spacing.md,
    marginBottom: 2,
  },
  cardFooter: {
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  selectText: {
    ...typography.bodySm,
    color: colors.primary,
    fontWeight: '600',
    textAlign: 'center',
  },
  center: {
    flex: 1,
    padding: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  loadingText: {
    ...typography.bodyLg,
    color: colors.textPrimary,
  },
  errorTitle: {
    ...typography.displaySm,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  errorText: {
    ...typography.bodyMd,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
});
