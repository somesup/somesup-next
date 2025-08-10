import { useSyncExternalStore } from 'react';
import { StoreApi, UseBoundStore } from 'zustand';

type ZustandStore<T> = UseBoundStore<StoreApi<T>> & {
  persist: { onFinishHydration: (listener: () => void) => void };
};

/**
 * Zustand 스토어와 selector를 인자로 받아 useSyncExternalStore를 활용해
 * 초기 렌더링 시에도 hydration 없이 저장된 값을 반환하는 커스텀 훅.
 *
 * @param store - persist 미들웨어가 적용된 Zustand 스토어.
 * @param selector - 스토어의 상태에서 원하는 값을 추출하는 함수.
 * @returns selector가 반환하는 값.
 */
export const useSESStore = <TState, TResult>(store: ZustandStore<TState>, selector: (state: TState) => TResult) => {
  const getSnapshot = () => {
    const snapshot = store.getState();
    return selector(snapshot);
  };

  const subscribe = (listener: () => void) => {
    return store.subscribe(listener);
  };

  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
};
