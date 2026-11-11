import { storageKeys } from '@/services/storage';

export interface ApiFieldError {
  field: string;
  message: string;
}

interface ApiErrorBody {
  status?: number;
  code?: string;
  message?: string;
  fieldErrors?: ApiFieldError[];
}

export class ApiError extends Error {
  readonly status: number;
  readonly code: string | null;
  readonly fieldErrors: ApiFieldError[];

  constructor(status: number, message: string, code: string | null = null, fieldErrors: ApiFieldError[] = []) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.fieldErrors = fieldErrors;
  }
}

function readToken(): string | null {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(storageKeys.authToken);
}

function writeToken(token: string | null): void {
  if (typeof window === 'undefined') return;
  if (token) {
    window.localStorage.setItem(storageKeys.authToken, token);
  } else {
    window.localStorage.removeItem(storageKeys.authToken);
  }
}

function defaultMessage(status: number): string {
  if (status === 401) return 'Your session has expired. Please log in again.';
  if (status === 403) return 'You do not have access to this resource.';
  if (status === 404) return 'The requested resource was not found.';
  if (status === 429) return 'Too many requests. Please try again later.';
  if (status >= 500) return 'The server ran into a problem. Please try again.';
  return 'The request could not be completed.';
}

async function parseErrorResponse(response: Response): Promise<ApiError> {
  let body: ApiErrorBody | null = null;
  try {
    body = (await response.json()) as ApiErrorBody;
  } catch {
    body = null;
  }
  const message = body?.message?.trim() ? body.message : defaultMessage(response.status);
  return new ApiError(response.status, message, body?.code ?? null, body?.fieldErrors ?? []);
}

export class ApiClient {
  private readonly baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.trim().replace(/\/+$/, '');
  }

  getToken(): string | null {
    return readToken();
  }

  setToken(token: string | null): void {
    writeToken(token);
  }

  clearToken(): void {
    writeToken(null);
  }

  get<T>(path: string): Promise<T> {
    return this.request<T>(path, { method: 'GET' });
  }

  post<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  }

  postForm<T>(path: string, formData: FormData): Promise<T> {
    return this.request<T>(path, { method: 'POST', body: formData });
  }

  private async request<T>(path: string, init: RequestInit): Promise<T> {
    const headers = new Headers(init.headers);
    headers.set('Accept', 'application/json');
    const token = readToken();
    if (token) headers.set('Authorization', `Bearer ${token}`);

    let response: Response;
    try {
      response = await fetch(`${this.baseUrl}${path}`, { ...init, headers });
    } catch {
      throw new ApiError(0, 'Unable to reach the Switchmate server. Check that the backend is running.');
    }

    if (!response.ok) {
      if (response.status === 401) writeToken(null);
      throw await parseErrorResponse(response);
    }

    if (response.status === 204) return undefined as T;
    const text = await response.text();
    if (!text) return undefined as T;

    try {
      return JSON.parse(text) as T;
    } catch {
      throw new ApiError(response.status, 'The server returned an unexpected response.');
    }
  }
}
