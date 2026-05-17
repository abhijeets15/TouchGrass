import { createApp } from './app';
import { config } from './config';
import { closeDb } from './db';
import runMigrations from './migrate-runner';

function main() {
  runMigrations();

  const app = createApp();
  app.listen(config.port, '0.0.0.0', () => {
    console.log(`Vibecheck API listening on http://localhost:${config.port}`);
    console.log(`  Database: ${config.databasePath}`);
    console.log(`  (Android emulator → http://10.0.2.2:${config.port})`);
  });
}

try {
  main();
} catch (err) {
  console.error('Failed to start API:', err);
  process.exit(1);
}

process.on('SIGTERM', () => closeDb());
process.on('SIGINT', () => closeDb());
