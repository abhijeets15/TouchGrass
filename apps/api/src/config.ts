import 'dotenv/config';
import path from 'path';

export const config = {
  port: Number(process.env.PORT ?? 3001),
  databasePath:
    process.env.DATABASE_PATH ??
    path.resolve(__dirname, '../data/vibecheck.db'),
  jwtAccessSecret:
    process.env.JWT_ACCESS_SECRET ?? 'vibecheck-dev-access-secret-change-in-production',
  jwtRefreshSecret:
    process.env.JWT_REFRESH_SECRET ?? 'vibecheck-dev-refresh-secret-change-in-production',
  accessTokenTtl: process.env.ACCESS_TOKEN_TTL ?? '15m',
  refreshTokenTtlDays: Number(process.env.REFRESH_TOKEN_TTL_DAYS ?? 30),
  corsOrigin: process.env.CORS_ORIGIN ?? '*',
  geminiApiKey: process.env.GEMINI_API_KEY ?? '',
};
