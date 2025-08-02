import { APIResult } from '@/types/dto';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const myFetch = async <T = any>(endpoint: string, options: RequestInit = {}): Promise<APIResult<T>> => {
  try {
    const { headers = {}, ...restOptions } = options;

    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      cache: 'no-store',
      credentials: 'include',
      ...restOptions,
    };

    const response = await fetch(API_URL + endpoint, defaultOptions);

    const result = await response.json();

    if (!response.ok) {
      return {
        error: { status: response.status, message: result.message },
        data: null,
      };
    }

    return { error: null, data: result };
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
  get: <T = any>(endpoint: string, options?: RequestInit) => myFetch<T>(endpoint, { method: 'GET', ...options }),

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
};
export default api;
