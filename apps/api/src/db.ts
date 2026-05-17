import fs from 'fs';
import path from 'path';
import Database from 'better-sqlite3';
import { config } from './config';

fs.mkdirSync(path.dirname(config.databasePath), { recursive: true });

export const db = new Database(config.databasePath);

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

/** Convert pg-style $1, $2 placeholders to SQLite ? placeholders. */
function toSqlite(sql: string): string {
  return sql.replace(/\$(\d+)/g, '?');
}

export function query<T extends Record<string, unknown> = Record<string, unknown>>(
  sql: string,
  params: unknown[] = [],
): { rows: T[] } {
  const statement = toSqlite(sql);
  const upper = statement.trim().toUpperCase();

  if (upper.startsWith('SELECT')) {
    const rows = db.prepare(statement).all(...params) as T[];
    return { rows };
  }

  if (upper.includes('RETURNING')) {
    const row = db.prepare(statement).get(...params) as T | undefined;
    return { rows: row ? [row] : [] };
  }

  db.prepare(statement).run(...params);
  return { rows: [] };
}

export function closeDb(): void {
  db.close();
}
