export const colors = {
  bg: '#0D0D0F',
  bgCard: '#18181C',
  bgCardHover: '#1f1f24',
  border: '#2a2a2f',
  borderHover: '#444',
  primary: '#FF5C35',
  primaryDim: 'rgba(255,92,53,0.08)',
  accent: '#FFD166',
  textPrimary: '#F0EDE6',
  textSecondary: '#aaa',
  textMuted: '#666',
  textDim: '#555',
  white: '#ffffff',
  error: '#FF5C35',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  pill: 100,
} as const;

export const typography = {
  displayLg: { fontSize: 32, fontWeight: '800' as const, lineHeight: 36 },
  displayMd: { fontSize: 26, fontWeight: '800' as const, lineHeight: 30 },
  displaySm: { fontSize: 22, fontWeight: '800' as const, lineHeight: 26 },
  bodyLg: { fontSize: 15, fontWeight: '400' as const, lineHeight: 22 },
  bodyMd: { fontSize: 13, fontWeight: '400' as const, lineHeight: 20 },
  bodySm: { fontSize: 11, fontWeight: '400' as const, lineHeight: 16 },
  label: { fontSize: 11, fontWeight: '500' as const, letterSpacing: 1.4 },
} as const;
