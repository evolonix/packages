import { useCallback } from 'react';
// import { useSearchParams } from 'react-router-dom';

import { StoreApi, useStore } from 'zustand';

import { ExtractState, SliceSelector } from '@evolonix/rsm';

const IDENTITY_SELECTOR = <T>(state: ExtractState<T>) => state;

export type Selector<ViewModel, Slice> = SliceSelector<
  StoreApi<ViewModel>,
  Slice
>;

export const useZustandStore = <ViewModel = unknown, Slice = ViewModel>(
  store: StoreApi<ViewModel>,
  selector?: Selector<ViewModel, Slice>,
) => {
  // Enable override from URL to force showing skeleton
  const pickFn = useCallback(
    (state: ViewModel) => {
      const { search } = window.location;
      const searchParams = new URLSearchParams(search);

      const forceSkeleton =
        searchParams.has('forceSkeleton') &&
        searchParams.get('forceSkeleton') === 'true';
      if (forceSkeleton) state = { ...state, forceSkeleton: true };

      const forceLoading =
        searchParams.has('forceLoading') &&
        searchParams.get('forceLoading') === 'true';
      if (forceLoading) state = { ...state, forceLoading: true };

      const forceEmpty =
        searchParams.has('forceEmpty') &&
        searchParams.get('forceEmpty') === 'true';
      if (forceEmpty) state = { ...state, forceEmpty: true };

      const fallback = IDENTITY_SELECTOR as SliceSelector<
        StoreApi<ViewModel>,
        Slice
      >;
      const fn = selector || fallback;

      return fn(state);
    },
    [selector],
  );

  // return entire view model or selected slice
  return useStore(store, pickFn);
};
