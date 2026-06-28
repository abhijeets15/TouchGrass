import type {
  ApiErrorBody,
  AuthResponse,
  AuthUser,
  AuthTokens,
  LoginInput,
  RegisterInput,
} from '@vibecheck/shared-types';

export class ApiClientError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
  ) {
    super(message);
    this.name = 'ApiClientError';
  }
}

async function parseJson<T>(res: Response): Promise<T> {
  const text = await res.text();
  if (!text) return {} as T;
  try {
    return JSON.parse(text) as T;
  } catch {
    return {} as T;
  }
}

async function request<T>(
  baseUrl: string,
  path: string,
  options: RequestInit & { accessToken?: string } = {},
): Promise<T> {
  const { accessToken, headers: extraHeaders, ...init } = options;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(extraHeaders as Record<string, string>),
  };
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  const url = `${baseUrl.replace(/\/$/, '')}${path}`;

  let res: Response;
  try {
    res = await fetch(url, { ...init, headers });
  } catch {
    throw new ApiClientError(
      `Cannot reach the server at ${baseUrl}. Start the API with "npm run api" and ensure Docker/Postgres is running.`,
      0,
      'NETWORK_ERROR',
    );
  }

  const body = await parseJson<T | ApiErrorBody>(res);
  if (!res.ok) {
    const err = body as ApiErrorBody;
    throw new ApiClientError(err.error ?? res.statusText, res.status, err.code);
  }
  return body as T;
}

export function createAuthClient(baseUrl: string) {
  return {
    register(input: RegisterInput) {
      return request<AuthResponse>(baseUrl, '/auth/register', {
        method: 'POST',
        body: JSON.stringify(input),
      });
    },

    login(input: LoginInput) {
      return request<AuthResponse>(baseUrl, '/auth/login', {
        method: 'POST',
        body: JSON.stringify(input),
      });
    },

    refresh(refreshToken: string) {
      return request<AuthTokens>(baseUrl, '/auth/refresh', {
        method: 'POST',
        body: JSON.stringify({ refreshToken }),
      });
    },

    me(accessToken: string) {
      return request<{ user: AuthUser }>(baseUrl, '/auth/me', {
        method: 'GET',
        accessToken,
      });
    },

    logout(refreshToken: string, accessToken: string) {
      return request<{ ok: boolean }>(baseUrl, '/auth/logout', {
        method: 'POST',
        body: JSON.stringify({ refreshToken }),
        accessToken,
      });
    },

    forgotPassword(email: string) {
      return request<{ ok: boolean; message: string }>(baseUrl, '/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
    },

    resetPassword(token: string, password: string) {
      return request<{ ok: boolean; message: string }>(baseUrl, '/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ token, password }),
      });
    },

    health() {
      return request<{ ok: boolean }>(baseUrl, '/health', { method: 'GET' });
    },
  };
}

export type AuthClient = ReturnType<typeof createAuthClient>;
