/** Shared Expo config (plain JS — loadable from monorepo root). */
module.exports = {
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
    usesCleartextTraffic: true,
    adaptiveIcon: {
      backgroundColor: '#0D0D0F',
    },
  },
  extra: {},
};
