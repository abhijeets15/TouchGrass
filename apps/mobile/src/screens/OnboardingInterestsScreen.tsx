// components/OnboardingInterests.tsx
import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

// Curated list of activities with functional emojis as visual anchors
const AVAILABLE_INTERESTS = [
  { id: '1', label: 'Hiking', icon: '🥾' },
  { id: '2', label: 'Cafes & Coffee', icon: '☕' },
  { id: '3', label: 'Live Music', icon: '🎸' },
  { id: '4', label: 'Board Games', icon: '🎲' },
  { id: '5', label: 'Museums', icon: '🏛️' },
  { id: '6', label: 'Rock Climbing', icon: '🧗' },
  { id: '7', label: 'Breweries', icon: '🍺' },
  { id: '8', label: 'Photography', icon: '📷' },
  { id: '9', label: 'Cooking Classes', icon: '🍳' },
];

interface Props {
  onNext: (selected: string[]) => void;
}

export function OnboardingInterestsScreen() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleInterest = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(item => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  return (
    <View style={styles.container}>
      {/* Progress Indicator */}
      <View style={styles.progressBar}><View style={[styles.progress, { width: '50%' }]} /></View>

      <Text style={styles.title}>What do you love to do?</Text>
      <Text style={styles.subtitle}>Select at least 3 to help us find local activities for you.</Text>

      <ScrollView contentContainerStyle={styles.grid} showsVerticalScrollIndicator={false}>
        {AVAILABLE_INTERESTS.map((item) => {
          const isSelected = selectedIds.includes(item.id);
          return (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.8}
              style={[styles.tag, isSelected && styles.tagSelected]}
              onPress={() => toggleInterest(item.id)}
            >
              <Text style={styles.tagText}>{item.icon} {item.label}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <TouchableOpacity 
        style={[styles.nextButton, selectedIds.length < 3 && styles.nextButtonDisabled]}
        disabled={selectedIds.length < 3}
        //onPress={() => onNext(selectedIds)}
      >
        <Text style={styles.nextButtonText}>Continue ({selectedIds.length}/3)</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF', padding: 24, paddingTop: 60 },
  progressBar: { width: '100%', height: 6, backgroundColor: '#E5E7EB', borderRadius: 3, marginBottom: 32 },
  progress: { height: '100%', backgroundColor: '#4F46E5', borderRadius: 3 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#111827', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#6B7280', marginBottom: 32 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  tag: { width: (width - 64) / 2, backgroundColor: '#F3F4F6', paddingVertical: 16, paddingHorizontal: 12, borderRadius: 16, marginBottom: 16, alignItems: 'center', borderWidth: 2, borderColor: 'transparent' },
  tagSelected: { backgroundColor: '#EEF2FF', borderColor: '#4F46E5' },
  tagText: { fontSize: 16, fontWeight: '600', color: '#374151' },
  nextButton: { width: '100%', height: 56, backgroundColor: '#4F46E5', borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginTop: 16 },
  nextButtonDisabled: { backgroundColor: '#9CA3AF' },
  nextButtonText: { color: '#FFFFFF', fontSize: 18, fontWeight: '600' },
});
