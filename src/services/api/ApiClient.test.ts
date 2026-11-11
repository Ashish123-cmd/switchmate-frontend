import { afterEach, describe, expect, it, vi } from 'vitest';
import { ApiClient, ApiError } from '@/services/api/ApiClient';

function installWindow(): Map<string, string> {
  const store = new Map<string, string>();
  vi.stubGlobal('window', {
    localStorage: {
      getItem: (key: string) => store.get(key) ?? null,
      setItem: (key: string, value: string) => {
        store.set(key, value);
      },
      removeItem: (key: string) => {
        store.delete(key);
      },
    },
  });
  return store;
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('ApiClient', () => {
  it('joins the base URL, sends the bearer token, and parses JSON', async () => {
    installWindow();
    const client = new ApiClient('http://localhost:8081/');
    client.setToken('token-123');
    const fetchMock = vi.fn(async () => jsonResponse({ id: 'user-1' }));
    vi.stubGlobal('fetch', fetchMock);

    const result = await client.get<{ id: string }>('/api/auth/me');

    expect(result.id).toBe('user-1');
    const calls = fetchMock.mock.calls as unknown as [string, RequestInit][];
    expect(calls[0][0]).toBe('http://localhost:8081/api/auth/me');
    expect(new Headers(calls[0][1].headers).get('Authorization')).toBe('Bearer token-123');
  });

  it('maps backend error envelopes to ApiError', async () => {
    installWindow();
    const client = new ApiClient('http://localhost:8081');
    vi.stubGlobal(
      'fetch',
      vi.fn(async () =>
        jsonResponse(
          {
            status: 401,
            code: 'UNAUTHORIZED',
            message: 'Invalid email or password',
            fieldErrors: [{ field: 'email', message: 'must be a well-formed email address' }],
          },
          401,
        ),
      ),
    );

    const error = await client
      .post('/api/auth/login', { email: 'not-an-email', password: 'nope' })
      .catch((caught: unknown) => caught);

    expect(error).toBeInstanceOf(ApiError);
    const apiError = error as ApiError;
    expect(apiError.status).toBe(401);
    expect(apiError.code).toBe('UNAUTHORIZED');
    expect(apiError.message).toBe('Invalid email or password');
    expect(apiError.fieldErrors).toHaveLength(1);
  });

  it('clears the stored token when the backend answers 401', async () => {
    installWindow();
    const client = new ApiClient('http://localhost:8081');
    client.setToken('stale-token');
    vi.stubGlobal('fetch', vi.fn(async () => jsonResponse({ status: 401, code: 'UNAUTHORIZED' }, 401)));

    await expect(client.get('/api/auth/me')).rejects.toBeInstanceOf(ApiError);

    expect(client.getToken()).toBeNull();
  });

  it('reports an unreachable backend as a status 0 ApiError', async () => {
    installWindow();
    const client = new ApiClient('http://localhost:8081');
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        throw new TypeError('Failed to fetch');
      }),
    );

    const error = await client.get('/api/jobs').catch((caught: unknown) => caught);

    expect(error).toBeInstanceOf(ApiError);
    expect((error as ApiError).status).toBe(0);
  });
});
