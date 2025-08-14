import { CamelCaseObject } from '@/types/types';

/**
 * snake_case를 camelCase로 변환하는 함수
 * @param {string} str - 변환할 snake_case 문자열
 * @returns {string} - 변환된 camelCase 문자열
 */
const snakeToCamelString = (str: string): string => str.replace(/_([a-z])/g, (_, char: string) => char.toUpperCase());

/**
 * 객체의 모든 키를 snake_case에서 camelCase로 재귀적으로 변환
 * @param {any} obj - 변환할 객체
 * @returns {any} - 키가 camelCase로 변환된 객체
 */
export const camelize = <T>(obj: T): CamelCaseObject<T> => {
  if (obj === null || obj === undefined) {
    return obj as unknown as CamelCaseObject<T>;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => camelize(item)) as unknown as CamelCaseObject<T>;
  }

  if (typeof obj !== 'object') {
    return obj as CamelCaseObject<T>;
  }

  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    const newKey = snakeToCamelString(key);
    if (typeof value === 'object') result[newKey] = camelize(value);
    else result[newKey] = value;
  }

  return result as CamelCaseObject<T>;
};
