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
  // const [params] = useSearchParams();

  // Enable override from URL to force showing skeletons
  const pickFn = useCallback(
    (state: ViewModel) => {
      // const forceSkeletons =
      //   params.has('showSkeleton') && params.get('showSkeleton') === 'true';
      // if (forceSkeletons) state = { ...state, showSkeleton: true };

      const fallback = IDENTITY_SELECTOR as SliceSelector<
        StoreApi<ViewModel>,
        Slice
      >;
      const fn = selector || fallback;

      return fn(state);
    },
    // [params, selector],
    [selector],
  );

  // return entire view model or selected slice
  return useStore(store, pickFn);
};
