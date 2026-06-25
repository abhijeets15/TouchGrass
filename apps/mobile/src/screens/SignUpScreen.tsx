import React, { useState, useMemo } from 'react';
import {
  Text,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Pressable,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, spacing, typography } from '../constants/theme';
import { PrimaryButton } from '../components/PrimaryButton';
import { TextField } from '../components/TextField';
import { useAuthStore } from '../store/authStore';
import type { AuthStackParamList } from '../navigation/types';
import {
  normalizeEmail,
  validateConfirmPassword,
  validateDisplayName,
  validateEmail,
  validatePassword,
  passwordStrengthHint,
} from '../utils/authValidation';

type Nav = NativeStackNavigationProp<AuthStackParamList, 'SignUp'>;

export function SignUpScreen() {
  const navigation = useNavigation<Nav>();
  const { signUp, isSubmitting, error, clearError } = useAuthStore();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const fieldErrors = useMemo(
    () => ({
      displayName: validateDisplayName(displayName),
      email: validateEmail(email),
      password: validatePassword(password),
      confirmPassword: validateConfirmPassword(password, confirmPassword),
    }),
    [displayName, email, password, confirmPassword],
  );

  const valid = Object.values(fieldErrors).every((e) => e === null);

  const markTouched = (field: string) => setTouched((t) => ({ ...t, [field]: true }));

  const handleSubmit = async () => {
    clearError();
    setTouched({ displayName: true, email: true, password: true, confirmPassword: true });
    if (!valid) return;
    await signUp(normalizeEmail(email), password, displayName.trim());
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Pressable onPress={() => navigation.goBack()}>
            <Text style={styles.back}>← Back</Text>
          </Pressable>

          <Text style={styles.heading}>Create account</Text>
          <Text style={styles.sub}>
            Save itineraries and pick up where you left off — takes about 30 seconds.
          </Text>

          <TextField
            label="Display name"
            value={displayName}
            onChangeText={setDisplayName}
            onBlur={() => markTouched('displayName')}
            autoComplete="name"
            textContentType="name"
            returnKeyType="next"
            error={touched.displayName ? fieldErrors.displayName ?? undefined : undefined}
          />
          <TextField
            label="Email"
            value={email}
            onChangeText={setEmail}
            onBlur={() => markTouched('email')}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            autoComplete="email"
            textContentType="emailAddress"
            returnKeyType="next"
            error={touched.email ? fieldErrors.email ?? undefined : undefined}
          />
          <TextField
            label="Password"
            value={password}
            onChangeText={setPassword}
            onBlur={() => markTouched('password')}
            allowPasswordToggle
            autoComplete="new-password"
            textContentType="newPassword"
            returnKeyType="next"
            error={touched.password ? fieldErrors.password ?? undefined : undefined}
            hint={!touched.password || fieldErrors.password ? passwordStrengthHint(password) : undefined}
          />
          <TextField
            label="Confirm password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            onBlur={() => markTouched('confirmPassword')}
            allowPasswordToggle
            autoComplete="new-password"
            textContentType="newPassword"
            returnKeyType="done"
            onSubmitEditing={handleSubmit}
            error={touched.confirmPassword ? fieldErrors.confirmPassword ?? undefined : undefined}
          />

          {error ? <Text style={styles.formError}>{error}</Text> : null}

          <PrimaryButton
            label={isSubmitting ? 'Creating account…' : 'Create account'}
            onPress={handleSubmit}
            disabled={isSubmitting}
          />

          <Pressable onPress={() => navigation.navigate('SignIn')} style={styles.linkWrap}>
            <Text style={styles.link}>
              Already have an account? <Text style={styles.linkAccent}>Sign in</Text>
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  flex: { flex: 1 },
  scroll: {
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
    marginBottom: spacing.sm,
  },
  sub: {
    ...typography.bodyMd,
    color: colors.textMuted,
    marginBottom: spacing.xl,
    lineHeight: 20,
  },
  formError: {
    ...typography.bodySm,
    color: colors.error,
    marginBottom: spacing.md,
  },
  linkWrap: {
    marginTop: spacing.lg,
    alignItems: 'center',
  },
  link: {
    ...typography.bodyMd,
    color: colors.textMuted,
  },
  linkAccent: {
    color: colors.primary,
    fontWeight: '600',
  },
});
