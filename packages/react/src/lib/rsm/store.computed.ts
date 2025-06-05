import { StoreApi } from 'zustand';

import { StoreState } from './store.state';

// *****************************************************
// Computed State Helpers
// *****************************************************

export type SetState<T> = {
  _(
    partial:
      | T
      | Partial<T>
      | {
          _(state: T): T | Partial<T> | void;
        }['_'],
    replace?: false,
  ): void;
  _(
    state:
      | T
      | {
          _(state: T): T;
        }['_'],
    replace: true,
  ): void;
}['_'];
export type ComputedState<T extends StoreState, U = unknown> = (state: T) => U;

/**
 * This is not middleware, but a utility function to create a store
 * with computed properties.
 */
export function computeWith<T extends StoreState, U = unknown>(
  buildComputed: ComputedState<T, U>,
  store: StoreApi<T>,
): SetState<T> {
  const originalSet = store.setState;

  // Set state updates & updated computed fields
  const setWithComputed = (update: (state: T) => T, replace: boolean) => {
    originalSet((state: T) => {
      const updated = typeof update === 'object' ? update : update(state);
      const computedState = buildComputed({ ...state, ...updated });
      return { ...updated, ...computedState };
    }, replace);
  };

  /**
   * create the store with the `set()` method tail-hooked to compute properties
   */
  store.setState = setWithComputed; // for external-to-store use

  return store.setState;
}
