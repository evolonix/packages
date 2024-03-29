import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { StoreApi, createStore } from 'zustand/vanilla';

import {
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
  loadAll: () => 'widgets:loadAll',
  findById: (id: string) => `widgets:findById:${id}`,
  add: () => `widgets:add`,
  edit: (id: string) => `widgets:edit:${id}`,
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
    const selectedWidget = state.allWidgets.find(
      (it) => it.id === state.selectedWidgetId,
    );
    const errors = getErrorMessages(state);

    return {
      selectedWidget,
      errors,
    };
  };

  /**
   * Factory to create a Zustand Reactive WidgetsStore; which emits a WidgetsViewModel
   */
  const configureStore = (
    set: (
      state:
        | Partial<WidgetsState>
        | ((state: WidgetsState) => Partial<WidgetsState>),
    ) => void,
    get: () => WidgetsState,
    store: StoreApi<WidgetsViewModel>,
  ): WidgetsViewModel => {
    set = computeWith(buildComputedFn, store);

    const trackStatus = trackStatusWith(set, get);

    const state: WidgetsState = initState();
    const computed: WidgetsComputedState = buildComputedFn(state);
    const api: WidgetsApi = {
      loadAll: async (
        query?: string,
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
            query,
            sortKey,
            sortDirection,
          );

          return {
            allWidgets,
            searchQuery: query || '',
            sortBy: sortKey,
            sortDirection,
          };
        }, ACTIONS.loadAll());

        return allWidgets;
      },
      findById: async (id: string): Promise<Widget | null> => {
        const widget = await waitFor<Widget | null>(
          () => service.getWidget(id),
          ACTIONS.findById(id),
        );

        return widget;
      },
      add: async (
        partial: Omit<Widget, 'id' | 'createdAt'>,
      ): Promise<Widget> => {
        let created = partial as Widget;

        await trackStatus(async () => {
          created = await service.createWidget(partial);
          const { allWidgets } = await get();

          return {
            allWidgets: upsert(created, allWidgets),
            searchQuery: '',
            selectedWidgetId: created.id,
          };
        }, ACTIONS.add());

        return created;
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
  q?: string;
  sort?: string;
  direction?: 'asc' | 'desc';
  id?: string;
  forceSkeleton?: boolean;
}
export const syncUrlWithStore = (state?: WidgetsViewModel) => {
  const defaultState: WidgetsState = initState();

  state = state ?? store().getState();
  const { searchQuery, sortBy, sortDirection, selectedWidgetId } = state;
  const { pathname } = window.location;
  const searchParams = new URLSearchParams({
    ...(searchQuery ? { q: searchQuery } : {}),
    ...(sortBy && sortBy !== defaultState.sortBy ? { sort: sortBy } : {}),
    ...(sortDirection && sortDirection !== defaultState.sortDirection
      ? { direction: sortDirection }
      : {}),
    // Only include the selectedWidgetId if it is not already in the URL as a path param
    ...(selectedWidgetId && !pathname.includes(`/${selectedWidgetId}`)
      ? { id: selectedWidgetId }
      : {}),
  });

  const url = `${pathname}${searchParams.toString() ? `?${searchParams}` : ''}`;

  if (window.location.href !== url) {
    window.history.replaceState({}, '', url);
  }
};

const syncStoreWithUrl = async (_store: StoreApi<WidgetsViewModel>) => {
  const { search } = window.location;
  const searchParams = new URLSearchParams(search);
  const searchQuery = searchParams.get('q') ?? undefined;
  const sortBy = searchParams.get('sort') ?? undefined;
  const sortDirection = searchParams.get('direction') ?? undefined;
  const selectedWidgetId = searchParams.get('id') ?? undefined;
  const forceSkeleton = searchParams.get('forceSkeleton') ?? false;

  const { getState: get, setState: set } = _store;
  set({ selectedWidgetId, forceSkeleton: Boolean(forceSkeleton) });

  if (searchQuery || sortBy || sortDirection) {
    get().loadAll(
      searchQuery,
      sortBy,
      sortDirection as 'asc' | 'desc' | undefined,
    );
  }
};
