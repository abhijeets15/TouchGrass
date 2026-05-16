import { pool } from './db';
import runMigrations from './migrate-runner';

async function migrate() {
  await runMigrations();
  console.log('Migrations applied.');
  await pool.end();
}

migrate().catch((err) => {
  console.error(err);
  process.exit(1);
});
