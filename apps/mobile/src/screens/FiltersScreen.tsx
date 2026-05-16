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
import {
  BUDGET_OPTIONS, TIME_OPTIONS, GROUP_OPTIONS, DISTANCE_OPTIONS,
  type BudgetId, type TimeId, type GroupId, type DistanceId,
} from '../constants/vibes';
import { colors, spacing, radius, typography } from '../constants/theme';
import { Chip } from '../components/Chip';
import { PrimaryButton } from '../components/PrimaryButton';
import { useVibeStore } from '../store/vibeStore';
import { useItinerary } from '../hooks/useItinerary';
import type { MainStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<MainStackParamList, 'Filters'>;

export function FiltersScreen() {
  const navigation = useNavigation<Nav>();
  const { budget, time, group, distance, setBudget, setTime, setGroup, setDistance, isQueryComplete } =
    useVibeStore();
  const { buildItinerary } = useItinerary();

  const handleBuild = async () => {
    navigation.navigate('Loading');
    await buildItinerary();
    navigation.navigate('Itinerary');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backLabel}>← Back</Text>
        </Pressable>

        <Text style={styles.heading}>Set your filters</Text>
        <Text style={styles.sub}>So we know what works for you.</Text>

        <FilterSection label="Budget">
          <View style={styles.chipRow}>
            {BUDGET_OPTIONS.map((o) => (
              <Chip
                key={o.id}
                label={o.label}
                selected={budget === o.id}
                onPress={() => setBudget(o.id as BudgetId)}
              />
            ))}
          </View>
        </FilterSection>

        <FilterSection label="Time available">
          <View style={styles.chipRow}>
            {TIME_OPTIONS.map((o) => (
              <Chip
                key={o.id}
                label={o.label}
                selected={time === o.id}
                onPress={() => setTime(o.id as TimeId)}
              />
            ))}
          </View>
        </FilterSection>

        <FilterSection label="Who's coming?">
          <View style={styles.chipRow}>
            {GROUP_OPTIONS.map((o) => (
              <Chip
                key={o.id}
                label={`${o.emoji} ${o.label}`}
                selected={group === o.id}
                onPress={() => setGroup(o.id as GroupId)}
              />
            ))}
          </View>
        </FilterSection>

        <FilterSection label="Distance">
          <View style={styles.chipRow}>
            {DISTANCE_OPTIONS.map((o) => (
              <Chip
                key={o.id}
                label={o.label}
                selected={distance === o.id}
                onPress={() => setDistance(o.id as DistanceId)}
              />
            ))}
          </View>
        </FilterSection>

        <PrimaryButton
          label="Build my itinerary →"
          onPress={handleBuild}
          disabled={!isQueryComplete()}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

function FilterSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={sectionStyles.container}>
      <Text style={sectionStyles.label}>{label.toUpperCase()}</Text>
      {children}
    </View>
  );
}

const sectionStyles = StyleSheet.create({
  container: { marginBottom: spacing.xl },
  label: { ...typography.label, color: colors.textDim, marginBottom: spacing.md },
});

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { padding: spacing.lg, paddingTop: spacing.xxl },
  backBtn: { marginBottom: spacing.xl },
  backLabel: { fontSize: 13, color: colors.textMuted },
  heading: { ...typography.displayMd, color: colors.textPrimary, marginBottom: spacing.xs },
  sub: { ...typography.bodyMd, color: colors.textMuted, marginBottom: spacing.xl },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap' },
});
