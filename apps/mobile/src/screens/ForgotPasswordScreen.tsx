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
import { authApi } from '../services/authApi';
import { normalizeEmail, validateEmail } from '../utils/authValidation';
import type { AuthStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<AuthStackParamList, 'ForgotPassword'>;

export function ForgotPasswordScreen() {
  const navigation = useNavigation<Nav>();
  const [email, setEmail] = useState('');
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const emailError = useMemo(() => validateEmail(email), [email]);
  const canSubmit = !emailError && email.length > 0;

  const handleSubmit = async () => {
    setError(null);
    setTouched({ email: true });
    if (!canSubmit) return;

    setIsSubmitting(true);
    try {
      await authApi.forgotPassword(normalizeEmail(email));
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
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

            <Text style={styles.heading}>Check your server logs</Text>
            <Text style={styles.sub}>
              A password reset token has been generated for {email}. Check your API server console to get the reset token.
            </Text>

            <PrimaryButton
              label="Enter Reset Token"
              onPress={() => navigation.navigate('ResetPassword', { email })}
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

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

          <Text style={styles.heading}>Forgot password?</Text>
          <Text style={styles.sub}>
            Enter your email address and we'll generate a reset token for you.
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
            returnKeyType="done"
            onSubmitEditing={handleSubmit}
            error={touched.email ? emailError ?? undefined : undefined}
          />

          {error ? <Text style={styles.formError}>{error}</Text> : null}

          <PrimaryButton
            label={isSubmitting ? 'Sending...' : 'Send Reset Token'}
            onPress={handleSubmit}
            disabled={isSubmitting}
          />
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
});
