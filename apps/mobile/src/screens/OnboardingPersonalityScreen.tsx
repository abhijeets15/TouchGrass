// components/OnboardingPersonality.tsx
import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

interface Props {
  onSubmit: (answers: Record<string, string>) => void;
}

export function OnboardingPersonalityScreen() {
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const chooseOption = (questionKey: string, value: string) => {
    setAnswers({ ...answers, [questionKey]: value });
  };

  const isComplete = Object.keys(answers).length === 2;

  return (
    <View style={styles.container}>
      {/* Progress Indicator */}
      <View style={styles.progressBar}><View style={[styles.progress, { width: '100%' }]} /></View>

      <Text style={styles.title}>What's your vibe?</Text>
      <Text style={styles.subtitle}>Help us match your social energy level.</Text>

      {/* Question 1 */}
      <View style={styles.section}>
        <Text style={styles.questionText}>Your ideal Friday night looks like...</Text>
        <View style={styles.row}>
          <TouchableOpacity 
            style={[styles.choiceBtn, answers.weekend === 'out' && styles.choiceBtnSelected]}
            onPress={() => chooseOption('weekend', 'out')}
          >
            <Text style={styles.choiceText}>🎉 Out with a crowd</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.choiceBtn, answers.weekend === 'in' && styles.choiceBtnSelected]}
            onPress={() => chooseOption('weekend', 'in')}
          >
            <Text style={styles.choiceText}>🍕 Chill game night</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Question 2 */}
      <View style={styles.section}>
        <Text style={styles.questionText}>When exploring your city, you prefer...</Text>
        <View style={styles.row}>
          <TouchableOpacity 
            style={[styles.choiceBtn, answers.explore === 'nature' && styles.choiceBtnSelected]}
            onPress={() => chooseOption('explore', 'nature')}
          >
            <Text style={styles.choiceText}>🌲 Hidden trails</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.choiceBtn, answers.explore === 'urban' && styles.choiceBtnSelected]}
            onPress={() => chooseOption('explore', 'urban')}
          >
            <Text style={styles.choiceText}>🏙️ Trendy hot spots</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity 
        style={[styles.submitButton, !isComplete && styles.submitButtonDisabled]}
        disabled={!isComplete}
        //onPress={() => onSubmit(answers)}
      >
        <Text style={styles.submitButtonText}>Find My Activities</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF', padding: 24, paddingTop: 60 },
  progressBar: { width: '100%', height: 6, backgroundColor: '#E5E7EB', borderRadius: 3, marginBottom: 32 },
  progress: { height: '100%', backgroundColor: '#4F46E5', borderRadius: 3 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#111827', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#6B7280', marginBottom: 40 },
  section: { marginBottom: 36 },
  questionText: { fontSize: 18, fontWeight: '600', color: '#374151', marginBottom: 16 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  choiceBtn: { flex: 0.47, backgroundColor: '#F9FAFB', paddingVertical: 20, paddingHorizontal: 12, borderRadius: 16, borderWidth: 2, borderColor: '#E5E7EB', alignItems: 'center' },
  choiceBtnSelected: { backgroundColor: '#EEF2FF', borderColor: '#4F46E5' },
  choiceText: { fontSize: 14, fontWeight: '600', color: '#111827', textAlign: 'center' },
  submitButton: { width: '100%', height: 56, backgroundColor: '#4F46E5', borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginTop: 'auto', marginBottom: 16 },
  submitButtonDisabled: { backgroundColor: '#9CA3AF' },
  submitButtonText: { color: '#FFFFFF', fontSize: 18, fontWeight: '600' },
});
