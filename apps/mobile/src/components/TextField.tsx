import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, type TextInputProps } from 'react-native';
import { colors, radius, spacing, typography } from '../constants/theme';

interface TextFieldProps extends TextInputProps {
  label: string;
  error?: string;
  hint?: string;
  /** Shows a show/hide toggle when secureTextEntry is true */
  allowPasswordToggle?: boolean;
}

export function TextField({
  label,
  error,
  hint,
  allowPasswordToggle,
  secureTextEntry,
  style,
  ...props
}: TextFieldProps) {
  const [visible, setVisible] = useState(false);

  const isSecure = allowPasswordToggle ? !visible : secureTextEntry;

  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputRow}>
        <TextInput
          placeholderTextColor={colors.textDim}
          style={[
            styles.input,
            allowPasswordToggle && styles.inputWithToggle,
            error && styles.inputError,
            style,
          ]}
          secureTextEntry={isSecure}
          {...props}
        />
        {allowPasswordToggle ? (
          <Pressable
            onPress={() => setVisible((v) => !v)}
            style={styles.toggle}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel={visible ? 'Hide password' : 'Show password'}
          >
            <Text style={styles.toggleText}>{visible ? 'Hide' : 'Show'}</Text>
          </Pressable>
        ) : null}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : hint ? <Text style={styles.hint}>{hint}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: spacing.md,
  },
  label: {
    ...typography.label,
    color: colors.textMuted,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
  },
  inputRow: {
    position: 'relative',
  },
  input: {
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: 15,
    color: colors.textPrimary,
  },
  inputWithToggle: {
    paddingRight: spacing.xxl + spacing.sm,
  },
  inputError: {
    borderColor: colors.error,
  },
  toggle: {
    position: 'absolute',
    right: spacing.md,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  toggleText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
  },
  error: {
    ...typography.bodySm,
    color: colors.error,
    marginTop: spacing.xs,
  },
  hint: {
    ...typography.bodySm,
    color: colors.textDim,
    marginTop: spacing.xs,
  },
});
