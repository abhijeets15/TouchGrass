import type { ExpoConfig } from 'expo/config';

const config: ExpoConfig = {
  name: 'Vibecheck',
  slug: 'vibecheck',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './src/assets/icon.png',
  scheme: 'vibecheck',
  userInterfaceStyle: 'automatic',
  splash: {
    image: './src/assets/splash.png',
    resizeMode: 'contain',
  },
  ios: {
    supportsTablet: false,
    bundleIdentifier: 'com.vibecheck.app',
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './src/assets/adaptive-icon.png',
    },
    package: 'com.vibecheck.app',
  },
  plugins: ['expo-router'],
  extra: {
    apiUrl: process.env.API_URL,
  },
};

export default config;
