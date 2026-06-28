import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { VibePickerScreen } from '../screens/VibePickerScreen';
import { FiltersScreen } from '../screens/FiltersScreen';
import { LoadingScreen } from '../screens/LoadingScreen';
import { ItineraryScreen } from '../screens/ItineraryScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { OnboardingInterestsScreen } from '../screens/OnboardingInterestsScreen';
import { OnboardingPersonalityScreen } from '../screens/OnboardingPersonalityScreen';
import type { MainStackParamList } from './types';

const Stack = createNativeStackNavigator<MainStackParamList>();

export function MainNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#0D0D0F' },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="VibePicker" component={VibePickerScreen} />
      <Stack.Screen name="Filters" component={FiltersScreen} />
      <Stack.Screen
        name="Loading"
        component={LoadingScreen}
        options={{ animation: 'fade', gestureEnabled: false }}
      />
      <Stack.Screen name="Itinerary" component={ItineraryScreen} />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ animation: 'slide_from_bottom' }}
      />
    </Stack.Navigator>
  );
}
