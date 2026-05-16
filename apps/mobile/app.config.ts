import type { ExpoConfig } from 'expo/config';

const config: ExpoConfig = {
  name: 'Vibecheck',
  slug: 'vibecheck',
  version: '1.0.0',
  orientation: 'portrait',
  scheme: 'vibecheck',
  userInterfaceStyle: 'dark',
  splash: {
    resizeMode: 'contain',
    backgroundColor: '#0D0D0F',
  },
  ios: {
    supportsTablet: false,
    bundleIdentifier: 'com.vibecheck.app',
  },
  android: {
    package: 'com.vibecheck.app',
    adaptiveIcon: {
      backgroundColor: '#0D0D0F',
    },
  },
  extra: {
    // EXPO_PUBLIC_ vars are automatically inlined — no extra config needed
  },
};

export default config;
