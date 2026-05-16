import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Animated,
  Easing,
} from 'react-native';
import { colors, spacing, typography } from '../constants/theme';

const STEPS = [
  'Reading your vibe',
  'Searching local spots',
  'Building the itinerary',
  'Adding insider tips',
];

export function LoadingScreen() {
  const [activeStep, setActiveStep] = useState(0);
  const spinAnim = useRef(new Animated.Value(0)).current;
  const fadeAnims = STEPS.map(() => useRef(new Animated.Value(0)).current);

  useEffect(() => {
    // Spin animation
    Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 1200,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Step reveal
    STEPS.forEach((_, i) => {
      setTimeout(() => {
        setActiveStep(i);
        Animated.timing(fadeAnims[i], {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }, i * 900);
    });
  }, []);

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Animated.View style={[styles.orb, { transform: [{ rotate: spin }] }]} />

        <Text style={styles.title}>Crafting your plan</Text>
        <Text style={styles.sub}>
          Matching your vibe to real places{'\n'}and building a curated itinerary.
        </Text>

        <View style={styles.steps}>
          {STEPS.map((step, i) => (
            <Animated.View
              key={step}
              style={[
                styles.step,
                { opacity: fadeAnims[i] },
                i < STEPS.length - 1 && styles.stepBorder,
              ]}
            >
              <View
                style={[
                  styles.dot,
                  i < activeStep && styles.dotDone,
                  i === activeStep && styles.dotActive,
                ]}
              />
              <Text
                style={[
                  styles.stepLabel,
                  i < activeStep && styles.stepDone,
                  i === activeStep && styles.stepActive,
                ]}
              >
                {step}
              </Text>
            </Animated.View>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  orb: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 3,
    borderColor: 'transparent',
    borderTopColor: colors.primary,
    borderRightColor: colors.accent,
    marginBottom: spacing.xl,
  },
  title: {
    ...typography.displaySm,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  sub: {
    ...typography.bodyMd,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: spacing.xl,
  },
  steps: {
    width: '100%',
    maxWidth: 320,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm + 2,
  },
  stepBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a1f',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2a2a2f',
  },
  dotDone: { backgroundColor: colors.primary },
  dotActive: { backgroundColor: colors.accent },
  stepLabel: {
    fontSize: 13,
    color: colors.textDim,
  },
  stepDone: { color: colors.textPrimary },
  stepActive: { color: colors.accent },
});
