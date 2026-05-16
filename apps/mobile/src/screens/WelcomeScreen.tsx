import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, spacing, typography } from '../constants/theme';
import { PrimaryButton } from '../components/PrimaryButton';
import { useAuthStore } from '../store/authStore';
import type { AuthStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<AuthStackParamList, 'Welcome'>;

export function WelcomeScreen() {
  const navigation = useNavigation<Nav>();
  const continueAsGuest = useAuthStore((s) => s.continueAsGuest);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.content}>
        <Text style={styles.eyebrow}>VIBECHECK</Text>
        <Text style={styles.heading}>Figure out{'\n'}what to do.</Text>
        <Text style={styles.sub}>
          Discover plans based on your vibe, budget, and who you're with — no planning headache.
        </Text>

        <View style={styles.actions}>
          <PrimaryButton label="Create account" onPress={() => navigation.navigate('SignUp')} />
          <PrimaryButton
            label="Sign in"
            variant="outline"
            onPress={() => navigation.navigate('SignIn')}
          />
          <PrimaryButton
            label="Continue without account"
            variant="outline"
            onPress={continueAsGuest}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
    paddingTop: spacing.xxl,
    justifyContent: 'space-between',
    paddingBottom: spacing.xl,
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
    ...typography.bodyLg,
    color: colors.textMuted,
    lineHeight: 24,
  },
  actions: {
    gap: 0,
  },
});
