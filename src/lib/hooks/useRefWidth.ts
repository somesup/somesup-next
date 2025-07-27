import { RefObject, useEffect, useState } from 'react';
import { debounce } from '../utils';

/**
 * DOM 요소의 width 변화를 감지하고 debounce를 적용하여 상태로 관리하는 커스텀 훅
 * ResizeObserver를 사용하여 요소 크기 변화를 실시간으로 감지합니다.
 *
 * @param {RefObject<HTMLDivElement>} ref - width를 측정할 HTMLDivElement의 ref 객체
 * @param {number} [delayMs=300] - debounce 지연 시간 (밀리초). 기본값: 300ms
 * @returns {number} 현재 요소의 width 값 (픽셀 단위)
 */
const useRefWidth = (ref: RefObject<HTMLDivElement>, delayMs: number = 300): number => {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const debouncedSetWidth = debounce((newWidth: number) => {
      setWidth(newWidth);
    }, delayMs);

    const updateWidth = () => {
      const newWidth = ref.current?.getBoundingClientRect().width;
      if (newWidth) debouncedSetWidth(newWidth);
    };

    const initialWidth = ref.current?.getBoundingClientRect().width;
    if (initialWidth) setWidth(initialWidth);

    const resizeObserver = new ResizeObserver(updateWidth);
    if (ref.current) resizeObserver.observe(ref.current);

    return () => {
      resizeObserver.disconnect();
      debouncedSetWidth.cancel();
    };
  }, [delayMs]);

  return width;
};

export default useRefWidth;
