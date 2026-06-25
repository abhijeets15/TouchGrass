import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Pressable, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, spacing, radius, typography } from '../constants/theme';
import { PrimaryButton } from '../components/PrimaryButton';
import { useAuthStore } from '../store/authStore';
import type { MainStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<MainStackParamList, 'Profile'>;

export function ProfileScreen() {
  const navigation = useNavigation<Nav>();
  const { user, isGuest, signOut, exitGuestMode } = useAuthStore();

  const handleSignOut = () => {
    Alert.alert('Sign out?', 'You can sign back in anytime with your email.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign out', style: 'destructive', onPress: () => signOut() },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.content}>
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={styles.back}>← Back</Text>
        </Pressable>

        <Text style={styles.heading}>Account</Text>

        {isGuest ? (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Guest mode</Text>
            <Text style={styles.cardBody}>
              You're browsing without an account. Create one to save itineraries later.
            </Text>
          </View>
        ) : user ? (
          <View style={styles.card}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user.displayName.charAt(0).toUpperCase()}
              </Text>
            </View>
            <Text style={styles.cardTitle}>{user.displayName}</Text>
            <Text style={styles.cardBody}>{user.email}</Text>
            <Text style={styles.meta}>
              Member since {new Date(user.createdAt).toLocaleDateString()}
            </Text>
          </View>
        ) : null}

        {isGuest ? (
          <PrimaryButton label="Sign in or create account" onPress={exitGuestMode} />
        ) : null}

        {!isGuest && user ? (
          <PrimaryButton label="Sign out" variant="outline" onPress={handleSignOut} />
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  content: {
    flex: 1,
    padding: spacing.lg,
    paddingTop: spacing.md,
  },
  back: {
    ...typography.bodyMd,
    color: colors.textMuted,
    marginBottom: spacing.lg,
  },
  heading: {
    ...typography.displayMd,
    color: colors.textPrimary,
    marginBottom: spacing.xl,
  },
  card: {
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.xl,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    alignItems: 'center',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primaryDim,
    borderWidth: 1,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  avatarText: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.primary,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  cardBody: {
    ...typography.bodyMd,
    color: colors.textSecondary,
  },
  meta: {
    ...typography.bodySm,
    color: colors.textDim,
    marginTop: spacing.md,
  },
});
