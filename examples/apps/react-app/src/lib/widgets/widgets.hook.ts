// *******************************************************************
// React HOOKS
// *******************************************************************

import { useZustandStore } from '@evolonix/rsm-react';
import { useCallback, useEffect } from 'react';
import { useWidgetHandlers } from './widgets.handlers';
import { WidgetsViewModel } from './widgets.state';
import { store, syncUrlWithStore } from './widgets.store';

/**
 * Hook to build and use Widgets store
 */
export function useWidgets(
  syncUrl = false,
  selector: (vm: WidgetsViewModel) => Partial<WidgetsViewModel> = (vm) => vm,
) {
  const internalSelector = (vm: WidgetsViewModel) => {
    return {
      ...selector(vm),
      // Always include properties that are used in this hook or handlers
      showSkeleton: vm.showSkeleton,
      selectedWidgetId: vm.selectedWidgetId,
      searchQuery: vm.searchQuery,
      loadAll: vm.loadAll,
      add: vm.add,
      edit: vm.edit,
      remove: vm.remove,
      select: vm.select,
    } as Partial<WidgetsViewModel>;
  };

  const vm = useZustandStore(store(), internalSelector);
  const handlers = useWidgetHandlers(vm);

  useEffect(() => {
    // Whenever the state changes, update the URL
    if (syncUrl) syncUrlWithStore();
  }, [vm, syncUrl]);

  useEffect(() => {
    if (vm.showSkeleton) vm.loadAll?.();
  }, [vm]);

  return [vm, handlers] as const;
}

/**
 * Hook to load specific widget by ID
 */
export function useWidgetById(
  id: string,
  selector?: (vm: WidgetsViewModel) => Partial<WidgetsViewModel>,
) {
  const internalSelector = useCallback(
    (vm: WidgetsViewModel) => {
      return [
        vm.allWidgets.find((it) => it.id === id),
        {
          ...selector?.(vm),
          // Always include properties that are used in this hook or handlers
          searchQuery: vm.searchQuery,
          selectedWidgetId: vm.selectedWidgetId,
          add: vm.add,
          edit: vm.edit,
          loadAll: vm.loadAll,
          remove: vm.remove,
          select: vm.select,
        } as Partial<WidgetsViewModel>,
      ] as const;
    },
    [id, selector],
  );

  const state = store().getState();
  if (state.allWidgets.length === 0 && !state.isLoading) state.loadAll();

  const [widget, vm] = useZustandStore(store(), internalSelector);
  const handlers = useWidgetHandlers(vm);

  return [widget, vm, handlers] as const;
}
