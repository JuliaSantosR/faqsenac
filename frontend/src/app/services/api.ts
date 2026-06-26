const API_BASE_URL = (import.meta.env.VITE_API_URL ?? 'http://localhost:3000').replace(/\/+$/, '');

export interface ApiError extends Error {
  status?: number;
}

export interface RequestOptions extends RequestInit {
  token?: string;
}

async function parseJsonResponse(response: Response) {
  const text = await response.text();
  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { token, headers, body, ...rest } = options;

  const finalHeaders = new Headers(headers ?? {});
  if (!finalHeaders.has('Content-Type') && body != null) {
    finalHeaders.set('Content-Type', 'application/json');
  }
  if (token) {
    finalHeaders.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: finalHeaders,
    body,
  });

  const payload = await parseJsonResponse(response);
  if (!response.ok) {
    const fallback = `Erro ${response.status} ao acessar ${path}.`;
    const message =
      typeof payload === 'object' &&
      payload != null &&
      'message' in payload &&
      typeof (payload as { message?: unknown }).message === 'string'
        ? (payload as { message: string }).message
        : fallback;

    const error = new Error(message) as ApiError;
    error.status = response.status;
    throw error;
  }

  return payload as T;
}

export function buildApiUrl(path: string): string {
  return `${API_BASE_URL}${path}`;
}
