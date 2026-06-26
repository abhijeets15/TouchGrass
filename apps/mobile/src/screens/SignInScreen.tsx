import React, { useState, useEffect, useMemo } from 'react';
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
import * as authStorage from '../services/authStorage';
import type { AuthStackParamList } from '../navigation/types';
import { normalizeEmail, validateEmail } from '../utils/authValidation';

type Nav = NativeStackNavigationProp<AuthStackParamList, 'SignIn'>;

export function SignInScreen() {
  const navigation = useNavigation<Nav>();
  const { signIn, isSubmitting, error, clearError } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [loadedEmail, setLoadedEmail] = useState(false);

  useEffect(() => {
    authStorage.getLastEmail().then((saved) => {
      if (saved) setEmail(saved);
      setLoadedEmail(true);
    });
  }, []);

  const emailError = useMemo(() => validateEmail(email), [email]);
  const canSubmit = !emailError && password.length > 0;

  const handleSubmit = async () => {
    clearError();
    setTouched({ email: true, password: true });
    if (!canSubmit) return;
    await signIn(normalizeEmail(email), password);
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

          <Text style={styles.heading}>Welcome back</Text>
          <Text style={styles.sub}>
            {loadedEmail && email
              ? `Signing in as ${email}`
              : 'Sign in to access your saved plans.'}
          </Text>

          <TextField
            label="Email"
            value={email}
            onChangeText={setEmail}
            onBlur={() => setTouched((t) => ({ ...t, email: true }))}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            autoComplete="email"
            textContentType="username"
            returnKeyType="next"
            error={touched.email ? emailError ?? undefined : undefined}
          />
          <TextField
            label="Password"
            value={password}
            onChangeText={setPassword}
            allowPasswordToggle
            autoComplete="password"
            textContentType="password"
            returnKeyType="done"
            onSubmitEditing={handleSubmit}
          />

          {error ? <Text style={styles.formError}>{error}</Text> : null}

          <PrimaryButton
            label={isSubmitting ? 'Signing in…' : 'Sign in'}
            onPress={handleSubmit}
            disabled={isSubmitting}
          />

          <Pressable onPress={() => navigation.navigate('SignUp')} style={styles.linkWrap}>
            <Text style={styles.link}>
              New here? <Text style={styles.linkAccent}>Create an account</Text>
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
