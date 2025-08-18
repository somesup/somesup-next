import { APIResult } from '@/types/dto';
import { camelize } from '../utils/camelize';
import { SITEMAP } from '@/data/sitemap';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null;

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
};

const getTokenExpiry = (token: string): number | null => {
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp;
  } catch (error) {
    return null;
  }
};

export const setCookie = (name: string, value: string, options: { maxAge?: number; secure?: boolean } = {}) => {
  const { secure = process.env.NODE_ENV === 'production' } = options;

  let maxAge = options.maxAge;
  if (!maxAge && (name === 'accessToken' || name === 'refreshToken')) {
    const expiry = getTokenExpiry(value);
    if (expiry) {
      const currentTime = Math.floor(Date.now() / 1000);
      maxAge = expiry - currentTime;
    }
  }

  let cookieString = `${name}=${value}; Path=/; SameSite=Strict`;
  if (maxAge && maxAge > 0) cookieString += `; Max-Age=${maxAge}`;
  if (secure) cookieString += '; Secure';

  document.cookie = cookieString;
};

const deleteCookie = (name: string) => {
  document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Strict`;
};

const refreshAccessToken = async (): Promise<string> => {
  const refreshToken = getCookie('refreshToken');

  if (!refreshToken) return '';

  try {
    const response = await fetch(API_URL + '/auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
      credentials: 'include',
      cache: 'no-store',
    });

    if (!response.ok) {
      deleteCookie('accessToken');
      deleteCookie('refreshToken');
      return '';
    }

    const result = await response.json();

    setCookie('accessToken', result.data.accessToken);
    setCookie('refreshToken', result.data.refreshToken);

    return result.data.accessToken;
  } catch (error) {
    console.error(error);
    return '';
  }
};

const prepareHeaders = (headers: HeadersInit = {}): HeadersInit => {
  const accessToken = getCookie('accessToken');

  return {
    'Content-Type': 'application/json',
    ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
    ...headers,
  };
};

export const myFetch = async <T = any>(endpoint: string, options: RequestInit = {}): Promise<APIResult<T>> => {
  try {
    const { headers = {}, ...restOptions } = options;

    const preparedHeaders = prepareHeaders(headers);

    const defaultOptions: RequestInit = {
      headers: preparedHeaders,
      cache: 'no-store',
      credentials: 'include',
      ...restOptions,
    };

    const response = await fetch(API_URL + endpoint, defaultOptions);

    if (response.status === 401) {
      const newAccessToken = await refreshAccessToken();

      if (!newAccessToken) {
        if (typeof window !== 'undefined') window.location.href = SITEMAP.ONBOARDING;
        return {
          error: { status: 401, message: 'Authentication failed' },
          data: null,
        };
      }

      const retryHeaders = prepareHeaders(headers);
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
