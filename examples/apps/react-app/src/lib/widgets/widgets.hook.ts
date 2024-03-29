// *******************************************************************
// React HOOKS
// *******************************************************************

import { formatDate } from '@evolonix/rsm';
import { useZustandStore } from '@evolonix/rsm-react';
import { useEffect, useState } from 'react';
import { Widget } from './widgets.model';
import { WidgetsViewModel } from './widgets.state';
import { store, syncUrlWithStore } from './widgets.store';

/**
 * Hook to build and use Widgets store
 */
export function useWidgets(
  syncUrl = false,
  selector: (state: WidgetsViewModel) => Partial<WidgetsViewModel> = (state) =>
    state,
) {
  // const store = inject<StoreApi<WidgetsViewModel>>(WidgetsStore);
  const vm = useZustandStore(store(), selector);
  const {
    showSkeleton,
    searchQuery,
    selectedWidgetId,
    loadAll,
    add,
    edit,
    remove,
    select,
  } = vm;

  const [isSorting, setIsSorting] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const isSelected = (widget: Widget) => widget.id === selectedWidgetId;

  // Event handlers
  const handleSort = async (key: string) => {
    setIsSorting(true);
    await loadAll?.(searchQuery, key);
    setIsSorting(false);
  };

  const handleAdd = async () => {
    const name = prompt('Enter a name for the widget (required)');
    const description = name
      ? prompt('Enter a description for the widget (required)')
      : undefined;
    const imageUrl = description
      ? prompt(
          'Enter an image URL for the widget (optional)',
          'https://via.placeholder.com/300x225?text=Widget+Image',
        ) ?? undefined
      : undefined;
    if (name && description) {
      setIsAdding(true);
      await add?.({ name, description, imageUrl });
      setIsAdding(false);

      return true;
    }

    return false;
  };

  const handleEdit = async (widget: Widget, e: React.MouseEvent<unknown>) => {
    e.stopPropagation();

    const name = prompt(
      'Enter a new name for the widget (required)',
      widget.name,
    );
    const description = name
      ? prompt(
          'Enter a new description for the widget (required)',
          widget.description,
        )
      : undefined;
    const imageUrl = description
      ? prompt(
          'Enter a new image URL for the widget (optional)',
          widget.imageUrl,
        ) ?? undefined
      : undefined;
    if (name && description) {
      setIsEditing(true);
      await edit?.({ ...widget, name, description, imageUrl });
      setIsEditing(false);

      return true;
    }

    return false;
  };

  const handleRemove = async (widget: Widget, e: React.MouseEvent<unknown>) => {
    e.stopPropagation();

    // eslint-disable-next-line no-restricted-globals
    const confirmed = confirm('Are you sure you want to remove this widget?');
    if (confirmed) {
      setIsRemoving(true);
      await remove?.(widget);
      setIsRemoving(false);

      return true;
    }

    return false;
  };

  const handleSelect = (widget: Widget, e: React.MouseEvent<unknown>) => {
    e.stopPropagation();

    select?.(widget);

    alert(`You selected the following widget:
${'' /* Intential blank line */}
ID: ${widget.id}
Name: ${widget.name}
Description: ${widget.description}
Created: ${formatDate(widget.createdAt)}
    `);
  };

  const handlers = {
    isSorting,
    isAdding,
    isEditing,
    isRemoving,
    isSelected,
    handleSort,
    handleAdd,
    handleEdit,
    handleRemove,
    handleSelect,
  };

  useEffect(() => {
    // Whenever the state changes, update the URL
    if (syncUrl) syncUrlWithStore();
  }, [vm, syncUrl]);

  useEffect(() => {
    if (showSkeleton) loadAll?.();
  }, [showSkeleton, loadAll]);

  return [vm, handlers] as const;
}

/**
 * Hook to load specific widget by ID
 */
export function useWidgetById(id: string) {
  const [vm] = useWidgets();
  const widget = vm.allWidgets?.find((it) => it.id === id);

  return [widget, vm] as const;
}
