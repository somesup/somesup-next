import { APIResult } from '@/types/dto';
import { useUserStore } from '../stores/user';
import { camelize } from '../utils/camelize';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const isTokenExpired = (token: string): boolean => {
  if (!token) return true;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp < currentTime + 300;
  } catch (error) {
    return true;
  }
};

const refreshAccessToken = async (): Promise<string> => {
  const { refreshToken, setTokens } = useUserStore.getState();
  if (!refreshToken) return '';

  try {
    const response = await fetch(API_URL + '/auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
      credentials: 'include',
      cache: 'no-store',
    });

    if (!response.ok) return '';

    const result = await response.json();

    setTokens(result.data);
    return result.data.accessToken;
  } catch (error) {
    console.error(error);
    return '';
  }
};

const prepareHeaders = async (headers: HeadersInit = {}): Promise<HeadersInit> => {
  const { accessToken } = useUserStore.getState();

  let currentAccessToken = accessToken;
  if (currentAccessToken && isTokenExpired(currentAccessToken)) currentAccessToken = await refreshAccessToken();

  return {
    'Content-Type': 'application/json',
    ...(currentAccessToken && { Authorization: `Bearer ${currentAccessToken}` }),
    ...headers,
  };
};

export const myFetch = async <T = any>(endpoint: string, options: RequestInit = {}): Promise<APIResult<T>> => {
  try {
    const { headers = {}, ...restOptions } = options;

    const preparedHeaders = await prepareHeaders(headers);

    const defaultOptions: RequestInit = {
      headers: preparedHeaders,
      cache: 'no-store',
      credentials: 'include',
      ...restOptions,
    };

    const response = await fetch(API_URL + endpoint, defaultOptions);

    if (response.status === 401) {
      const newAccessToken = await refreshAccessToken();

      if (!newAccessToken)
        return {
          error: { status: 401, message: 'Authentication failed' },
          data: null,
        };

      const retryHeaders = await prepareHeaders(headers);
      const retryOptions: RequestInit = {
        ...defaultOptions,
        headers: retryHeaders,
      };

      const retryResponse = await fetch(API_URL + endpoint, retryOptions);
      const retryResult = await retryResponse.json();

      if (!retryResponse.ok) {
        return {
          error: { status: retryResponse.status, message: retryResult.message },
          data: null,
        };
      }

      return { error: null, data: camelize(retryResult.data), pagination: retryResult.pagination };
    }

    const result = await response.json();

    if (!response.ok) {
      return {
        error: { status: response.status, message: result.message },
        data: null,
      };
    }

    return { error: null, data: camelize(result.data), pagination: result.pagination };
  } catch (error) {
    console.error(error);
    return {
      error: {
        status: 0,
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      data: null,
    };
  }
};

const api = {
  get: <T = any>(endpoint: string, params?: Record<string, any>, options?: RequestInit) => {
    let url = endpoint;

    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => !!value && searchParams.append(key, String(value)));

      const queryString = searchParams.toString();
      if (queryString) url += (url.includes('?') ? '&' : '?') + queryString;
    }

    return myFetch<T>(url, { method: 'GET', ...options });
  },

  post: <T = any>(endpoint: string, data?: any, options?: RequestInit) =>
    myFetch<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    }),

  patch: <T = any>(endpoint: string, data?: any, options?: RequestInit) =>
    myFetch<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    }),

  delete: <T = any>(endpoint: string, data?: any, options?: RequestInit) =>
    myFetch<T>(endpoint, {
      method: 'DELETE',
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    }),
};
export default api;
