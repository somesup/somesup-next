import clsx, { ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 함수 호출을 지연시켜 빈번한 호출을 방지하는 debounce 함수
 * 마지막 호출 후 지정된 시간이 지나야 실제 함수가 실행됩니다.
 *
 * @param {T} func - debounce를 적용할 함수
 * @param {number} [delayMs=300] - 지연 시간 (밀리초). 기본값: 300ms
 * @returns {T & { cancel: () => void }} debounce가 적용된 함수와 cancel 메서드를 포함한 객체
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delayMs: number = 300,
): T & { cancel: () => void } => {
  let timeoutId: NodeJS.Timeout | null = null;

  const debouncedFunction = ((...args: Parameters<T>) => {
    if (timeoutId) clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      func.apply(null, args);
    }, delayMs);
  }) as T & { cancel: () => void };

  debouncedFunction.cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };

  return debouncedFunction;
};
