import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { StoreApi, createStore } from 'zustand/vanilla';

import {
  SetState,
  computeWith,
  getErrorMessages,
  initStoreState,
  trackStatusWith,
  upsert,
  waitFor,
} from '@evolonix/rsm';
import { Widget } from './widgets.model';
import { createWidgetsService } from './widgets.service';
import {
  WidgetsApi,
  WidgetsComputedState,
  WidgetsState,
  WidgetsViewModel,
} from './widgets.state';

// *******************************************************************
// Initializers
// *******************************************************************

/**
 * These ACTIONS enable waitFor() to look up existing, async request (if any)
 */
const ACTIONS = {
  add: () => `widgets:add`,
  edit: (id: string) => `widgets:edit:${id}`,
  findById: (id: string) => `widgets:findById:${id}`,
  loadAll: () => 'widgets:loadAll',
  remove: (id: string) => `widgets:remove:${id}`,
};

const initState = (): WidgetsState => ({
  ...initStoreState(),
  allWidgets: [],
  searchQuery: '',
  sortBy: 'name',
  sortDirection: 'asc',
});

/**
 * Create an instance of the Zustand store engine for Widgets
 */
export function buildWidgetsStore(): StoreApi<WidgetsViewModel> {
  const service = createWidgetsService();

  // Calculate our computed properties
  const buildComputedFn = (state: WidgetsState): WidgetsComputedState => {
    const errors = getErrorMessages(state);
    const selectedWidget = state.allWidgets.find(
      (it) => it.id === state.selectedWidgetId,
    );

    return {
      errors,
      selectedWidget,
    };
  };

  /**
   * Factory to create a Zustand Reactive WidgetsStore; which emits a WidgetsViewModel
   */
  const configureStore = (
    _: SetState<WidgetsViewModel>,
    get: () => WidgetsViewModel,
    store: StoreApi<WidgetsViewModel>,
  ): WidgetsViewModel => {
    const set = computeWith(buildComputedFn, store);

    const trackStatus = trackStatusWith(set, get);

    const state: WidgetsState = initState();
    const computed: WidgetsComputedState = buildComputedFn(state);
    const api: WidgetsApi = {
      add: async (
        partial: Omit<Widget, 'id' | 'createdAt'>,
      ): Promise<Widget | undefined> => {
        const { allWidgets, selectedWidgetId } = await trackStatus(async () => {
          const created = await service.createWidget(partial);
          const { allWidgets } = await get();

          return {
            allWidgets: upsert(created, allWidgets),
            searchQuery: '',
            selectedWidgetId: created.id,
          };
        }, ACTIONS.add());

        return allWidgets.find((it) => it.id === selectedWidgetId);
      },

      edit: async (widget: Widget, optimistic = false): Promise<Widget> => {
        let updated = widget;

        await trackStatus(async () => {
          if (optimistic) {
            set((state: WidgetsState) => ({
              allWidgets: upsert(widget, state.allWidgets),
            }));
          }

          updated = await service.updateWidget(widget);
          const { allWidgets } = await get();

          return {
            allWidgets: upsert(updated, allWidgets),
            searchQuery: '',
            selectedWidgetId: updated.id,
          };
        }, ACTIONS.edit(widget.id));

        return updated;
      },

      findById: async (id: string): Promise<Widget | null> => {
        const widget = await waitFor<Widget | null>(
          () => service.getWidget(id),
          ACTIONS.findById(id),
        );

        return widget;
      },

      loadAll: async (
        searchQuery?: string,
        sortBy?: string,
        sortDirection?: 'asc' | 'desc',
      ): Promise<Widget[]> => {
        const { allWidgets } = await trackStatus(async () => {
          const sortKey = sortBy ?? get().sortBy;
          sortDirection =
            sortDirection ??
            (sortBy
              ? sortBy === get().sortBy && get().sortDirection === 'asc'
                ? 'desc'
                : 'asc'
              : get().sortDirection);
          const allWidgets = await service.getWidgets(
            searchQuery,
            sortKey,
            sortDirection,
          );

          return {
            allWidgets,
            searchQuery,
            sortBy: sortKey,
            sortDirection,
          };
        }, ACTIONS.loadAll());

        return allWidgets;
      },

      remove: async (widget: Widget): Promise<boolean> => {
        let deleted = false;

        await trackStatus(async () => {
          deleted = await service.deleteWidget(widget.id);
          const { allWidgets } = await get();

          return {
            allWidgets: deleted
              ? allWidgets.filter((it) => it.id !== widget.id)
              : allWidgets,
            selectedWidgetId: '',
          };
        }, ACTIONS.remove(widget.id));

        return deleted;
      },

      select: (widget: Widget) => {
        set({ selectedWidgetId: widget.id });
      },
    };

    // Initial Store view model
    return {
      ...state,
      ...computed,
      ...api,
    };
  };

  /**
   * Enable the ReactiveStore for Redux DevTools, and persistence to localStorage,
   * and ensure the ViewModel is immutable using Immer
   */
  const store = createStore<WidgetsViewModel>()(
    // prettier-ignore
    devtools(
      immer(
        configureStore
      ), 
      { name: 'store:widgets' }
    ),
  );

  return store;
}

// *******************************************************************
// Singleton instance of the Zustand store engine for Widgets
// *******************************************************************

let _store: StoreApi<WidgetsViewModel>;

export const store = () => {
  if (!_store) {
    _store = buildWidgetsStore();
    // On app startup, determine if we have search params in the URL
    syncStoreWithUrl(_store);
  }

  return _store;
};

// *******************************************************************
// Bookmark URL Synchronizer
// *******************************************************************

export interface WidgetsUrlParams {
  direction?: 'asc' | 'desc';
  forceEmpty?: boolean;
  forceLoading?: boolean;
  forceSkeleton?: boolean;
  id?: string;
  q?: string;
  sort?: string;
}

export const syncUrlWithStore = (state?: WidgetsState) => {
  const defaultState = initState();

  state = state ?? store().getState();
  const {
    forceEmpty,
    forceLoading,
    forceSkeleton,
    searchQuery,
    selectedWidgetId,
    sortBy,
    sortDirection,
  } = state;

  const { pathname } = window.location;
  const searchParams = new URLSearchParams({
    ...(forceSkeleton ? { forceSkeleton: 'true' } : {}),
    ...(forceLoading ? { forceLoading: 'true' } : {}),
    ...(forceEmpty ? { forceEmpty: 'true' } : {}),
    ...(searchQuery ? { q: searchQuery } : {}),
    // Only include the selectedWidgetId if it is not already in the URL as a path param
    // ...(selectedWidgetId && !pathname.includes(`/widgets/${selectedWidgetId}`)
    ...(selectedWidgetId ? { id: selectedWidgetId } : {}),
    ...(sortBy && sortBy !== defaultState.sortBy ? { sort: sortBy } : {}),
    ...(sortDirection && sortDirection !== defaultState.sortDirection
      ? { direction: sortDirection }
      : {}),
  });

  const url = `${pathname}${searchParams.toString() ? `?${searchParams}` : ''}`;

  if (window.location.href !== url) {
    window.history.replaceState({}, '', url);
  }
};

const syncStoreWithUrl = async (store: StoreApi<WidgetsViewModel>) => {
  const { search } = window.location;
  const searchParams = new URLSearchParams(search);
  const forceSkeleton = searchParams.get('forceSkeleton') ?? undefined;
  const forceLoading = searchParams.get('forceLoading') ?? undefined;
  const forceEmpty = searchParams.get('forceEmpty') ?? undefined;
  const searchQuery = searchParams.get('q') ?? undefined;
  const selectedWidgetId = searchParams.get('id') ?? undefined;
  const sortBy = searchParams.get('sort') ?? undefined;
  const sortDirection = searchParams.get('direction') ?? undefined;

  const { getState: get, setState: set } = store;
  set({
    forceSkeleton: forceSkeleton === 'true',
    forceLoading: forceLoading === 'true',
    forceEmpty: forceEmpty === 'true',
    selectedWidgetId,
  });

  if (searchQuery || sortBy || sortDirection) {
    get().loadAll(
      searchQuery,
      sortBy,
      sortDirection as 'asc' | 'desc' | undefined,
    );
  }
};
