import React, { useState } from 'react';
import {
  Text,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Pressable,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, spacing, typography } from '../constants/theme';
import { PrimaryButton } from '../components/PrimaryButton';
import { TextField } from '../components/TextField';
import { authApi } from '../services/authApi';
import type { AuthStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<AuthStackParamList, 'ResetPassword'>;
type Route = RouteProp<AuthStackParamList, 'ResetPassword'>;

export function ResetPasswordScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { email } = route.params;
  
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const passwordError = password.length < 8 ? 'Password must be at least 8 characters' : null;
  const confirmPasswordError = password !== confirmPassword ? 'Passwords do not match' : null;
  const canSubmit = token.length > 0 && !passwordError && !confirmPasswordError;

  const handleSubmit = async () => {
    setError(null);
    setTouched({ token: true, password: true, confirmPassword: true });
    if (!canSubmit) return;

    setIsSubmitting(true);
    try {
      await authApi.resetPassword(token, password);
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
            <Text style={styles.heading}>Password reset successful</Text>
            <Text style={styles.sub}>
              Your password has been reset. You can now sign in with your new password.
            </Text>

            <PrimaryButton
              label="Sign In"
              onPress={() => navigation.navigate('SignIn')}
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

          <Text style={styles.heading}>Reset password</Text>
          <Text style={styles.sub}>
            Enter the reset token from your server logs and your new password for {email}.
          </Text>

          <TextField
            label="Reset Token"
            value={token}
            onChangeText={setToken}
            onBlur={() => setTouched((t) => ({ ...t, token: true }))}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="next"
            error={touched.token && token.length === 0 ? 'Token is required' : undefined}
          />
          <TextField
            label="New Password"
            value={password}
            onChangeText={setPassword}
            onBlur={() => setTouched((t) => ({ ...t, password: true }))}
            allowPasswordToggle
            autoComplete="new-password"
            textContentType="newPassword"
            returnKeyType="next"
            error={touched.password ? passwordError ?? undefined : undefined}
          />
          <TextField
            label="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            onBlur={() => setTouched((t) => ({ ...t, confirmPassword: true }))}
            allowPasswordToggle
            autoComplete="new-password"
            textContentType="newPassword"
            returnKeyType="done"
            onSubmitEditing={handleSubmit}
            error={touched.confirmPassword ? confirmPasswordError ?? undefined : undefined}
          />

          {error ? <Text style={styles.formError}>{error}</Text> : null}

          <PrimaryButton
            label={isSubmitting ? 'Resetting...' : 'Reset Password'}
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
