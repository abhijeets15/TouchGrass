import runMigrations from './migrate-runner';
import { closeDb } from './db';

runMigrations();
console.log('Migrations applied.');
closeDb();
