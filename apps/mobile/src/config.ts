/** API base URL — use your machine's LAN IP when testing on a physical device. */
export const API_URL =
  process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, '') ?? 'http://localhost:3001';
