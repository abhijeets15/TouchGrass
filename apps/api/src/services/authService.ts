import crypto from 'crypto';
import type { AuthResponse, AuthUser, LoginInput, RegisterInput } from '@vibecheck/shared-types';
import { query } from '../db';
import { hashPassword, verifyPassword } from '../utils/password';
import {
  accessTokenExpiresInSeconds,
  createRefreshToken,
  hashRefreshToken,
  refreshTokenExpiresAt,
  signAccessToken,
} from '../utils/tokens';

interface UserRow {
  id: string;
  email: string;
  display_name: string;
  password_hash: string;
  created_at: string;
}

function toAuthUser(row: UserRow): AuthUser {
  return {
    id: row.id,
    email: row.email,
    displayName: row.display_name,
    createdAt: row.created_at,
  };
}

async function issueTokens(user: UserRow): Promise<AuthResponse> {
  const accessToken = signAccessToken({ sub: user.id, email: user.email });
  const refreshToken = createRefreshToken();
  const tokenHash = hashRefreshToken(refreshToken);
  const expiresAt = refreshTokenExpiresAt().toISOString();
  const tokenId = crypto.randomUUID();

  query(
    `INSERT INTO refresh_tokens (id, user_id, token_hash, expires_at) VALUES ($1, $2, $3, $4)`,
    [tokenId, user.id, tokenHash, expiresAt],
  );

  return {
    user: toAuthUser(user),
    tokens: {
      accessToken,
      refreshToken,
      expiresIn: accessTokenExpiresInSeconds(),
    },
  };
}

export async function register(input: RegisterInput): Promise<AuthResponse> {
  const email = input.email.trim().toLowerCase();
  const displayName = input.displayName.trim();
  const passwordHash = await hashPassword(input.password);
  const id = crypto.randomUUID();

  try {
    const result = query<UserRow>(
      `INSERT INTO users (id, email, password_hash, display_name)
       VALUES ($1, $2, $3, $4)
       RETURNING id, email, display_name, password_hash, created_at`,
      [id, email, passwordHash, displayName],
    );
    const user = result.rows[0];
    if (!user) throw new Error('Failed to create user');
    return issueTokens(user);
  } catch (err: unknown) {
    const sqliteErr = err as { code?: string };
    if (sqliteErr.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      const error = new Error('An account with this email already exists') as Error & {
        status: number;
      };
      error.status = 409;
      throw error;
    }
    throw err;
  }
}

export async function login(input: LoginInput): Promise<AuthResponse> {
  const email = input.email.trim().toLowerCase();
  const result = query<UserRow>(
    `SELECT id, email, display_name, password_hash, created_at FROM users WHERE email = $1`,
    [email],
  );
  const user = result.rows[0];
  if (!user) {
    const error = new Error('Invalid email or password') as Error & { status: number };
    error.status = 401;
    throw error;
  }

  const valid = await verifyPassword(input.password, user.password_hash);
  if (!valid) {
    const error = new Error('Invalid email or password') as Error & { status: number };
    error.status = 401;
    throw error;
  }

  return issueTokens(user);
}

export async function refreshSession(refreshToken: string) {
  const tokenHash = hashRefreshToken(refreshToken);
  const result = query<UserRow & { token_id: string }>(
    `SELECT u.id, u.email, u.display_name, u.password_hash, u.created_at, rt.id AS token_id
     FROM refresh_tokens rt
     JOIN users u ON u.id = rt.user_id
     WHERE rt.token_hash = $1 AND rt.expires_at > datetime('now')`,
    [tokenHash],
  );
  const row = result.rows[0];
  if (!row) {
    const error = new Error('Invalid or expired refresh token') as Error & { status: number };
    error.status = 401;
    throw error;
  }

  query(`DELETE FROM refresh_tokens WHERE id = $1`, [row.token_id]);

  const user: UserRow = {
    id: row.id,
    email: row.email,
    display_name: row.display_name,
    password_hash: row.password_hash,
    created_at: row.created_at,
  };

  const accessToken = signAccessToken({ sub: user.id, email: user.email });
  const newRefresh = createRefreshToken();
  const newHash = hashRefreshToken(newRefresh);
  const expiresAt = refreshTokenExpiresAt().toISOString();
  const newTokenId = crypto.randomUUID();

  query(
    `INSERT INTO refresh_tokens (id, user_id, token_hash, expires_at) VALUES ($1, $2, $3, $4)`,
    [newTokenId, user.id, newHash, expiresAt],
  );

  return {
    accessToken,
    refreshToken: newRefresh,
    expiresIn: accessTokenExpiresInSeconds(),
  };
}

export async function getUserById(id: string): Promise<AuthUser | null> {
  const result = query<UserRow>(
    `SELECT id, email, display_name, password_hash, created_at FROM users WHERE id = $1`,
    [id],
  );
  const user = result.rows[0];
  return user ? toAuthUser(user) : null;
}

export async function logout(refreshToken: string): Promise<void> {
  const tokenHash = hashRefreshToken(refreshToken);
  query(`DELETE FROM refresh_tokens WHERE token_hash = $1`, [tokenHash]);
}
