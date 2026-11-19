// production-ready centralized API client with automatic HTTP-only cookie inclusion
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined | null>;
}

export class ApiError extends Error {
  statusCode: number;
  data?: unknown;

  constructor(message: string, statusCode: number, data?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.data = data;
  }
}

export const apiClient = async <T = unknown>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> => {
  const { params, headers, ...restOptions } = options;

  // construct URL with query params
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = new URL(`${API_BASE_URL}${cleanEndpoint}`);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.append(key, String(value));
      }
    });
  }

  // prepare headers
  const isFormData = restOptions.body instanceof FormData;
  const mergedHeaders: HeadersInit = {
    ...(!isFormData ? { 'Content-Type': 'application/json' } : {}),
    ...headers,
  };

  try {
    const res = await fetch(url.toString(), {
      ...restOptions,
      headers: mergedHeaders,
      // ALWAYS include credentials so HTTP-only cookies are securely passed and received
      credentials: 'include',
    });

    const responseData = await res.json().catch(() => null);

    if (!res.ok) {
      const errorMessage =
        responseData?.message || `Request failed with status ${res.status}`;
      throw new ApiError(errorMessage, res.status, responseData);
    }

    return responseData as T;
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      throw error;
    }
    const message = error instanceof Error ? error.message : 'Network error occurred';
    throw new ApiError(message, 500);
  }
};
