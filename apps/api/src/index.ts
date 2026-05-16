import { createApp } from './app';
import { config } from './config';
import { pool } from './db';
import runMigrations from './migrate-runner';

async function ensureMigrations() {
  await runMigrations();
}

async function main() {
  await ensureMigrations();

  const app = createApp();
  app.listen(config.port, () => {
    console.log(`Vibecheck API listening on http://localhost:${config.port}`);
  });
}

main().catch((err) => {
  console.error('Failed to start API:', err);
  process.exit(1);
});

process.on('SIGTERM', () => pool.end());
process.on('SIGINT', () => pool.end());
