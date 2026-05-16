import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { VibePickerScreen } from '../screens/VibePickerScreen';
import { FiltersScreen } from '../screens/FiltersScreen';
import { LoadingScreen } from '../screens/LoadingScreen';
import { ItineraryScreen } from '../screens/ItineraryScreen';

export type RootStackParamList = {
  VibePicker: undefined;
  Filters: undefined;
  Loading: undefined;
  Itinerary: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
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
    </Stack.Navigator>
  );
}
