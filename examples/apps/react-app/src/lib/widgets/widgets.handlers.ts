import { formatDate } from '@evolonix/rsm';
import { DebouncedFunc } from 'lodash';
import debounce from 'lodash.debounce';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { WidgetFormValues } from '../../app/widgets/components';
import { Widget } from './widgets.model';
import { WidgetsViewModel } from './widgets.state';
import { store } from './widgets.store';

export interface WidgetsEventHandlers {
  isAdding: boolean;
  isEditing: boolean;
  isRemoving: boolean;
  isSearching: boolean;
  isSorting: boolean;
  handleAdd: () => Promise<boolean>;
  handleEdit: (
    widget: Widget,
    e: React.MouseEvent<unknown>,
  ) => Promise<boolean>;
  handleNavigate: (
    widget: Widget,
    e: React.MouseEvent<unknown> | React.KeyboardEvent<unknown>,
  ) => void;
  handleRemove: (
    widget: Widget,
    e: React.MouseEvent<unknown>,
  ) => Promise<boolean>;
  handleRemoveAndNavigate: (
    widget: Widget,
    e: React.MouseEvent<unknown>,
  ) => Promise<void>;
  handleSearch: DebouncedFunc<(e: React.ChangeEvent<unknown>) => Promise<void>>;
  handleSelect: (widget: Widget, e: React.MouseEvent<unknown>) => void;
  handleSort: (key: string) => void;
  handleEditSubmit: (
    widget: Widget,
    e: React.FormEvent<HTMLFormElement>,
  ) => Promise<void>;
  handleNewSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  isSelected: (widget: Widget) => boolean;
}

export function useWidgetHandlers(vm?: Partial<WidgetsViewModel>) {
  if (!vm) vm = store().getState();
  if (vm.allWidgets?.length === 0 && !vm.isLoading) vm.loadAll?.();

  const navigate = useNavigate();

  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isSorting, setIsSorting] = useState(false);

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
      await vm?.add?.({ name, description, imageUrl });
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
      await vm?.edit?.({ ...widget, name, description, imageUrl });
      setIsEditing(false);

      return true;
    }

    return false;
  };

  const handleNavigate = (
    widget: Widget,
    e: React.MouseEvent<unknown> | React.KeyboardEvent<unknown>,
  ) => {
    if (
      e.nativeEvent instanceof KeyboardEvent &&
      e.nativeEvent.key !== 'Enter' &&
      e.nativeEvent.key !== ' ' // Spacebar
    ) {
      return;
    }

    e.stopPropagation();

    if (vm?.isLoading) return;

    navigate(`/widgets/${widget.id}`);
  };

  const handleRemove = async (widget: Widget, e: React.MouseEvent<unknown>) => {
    e.stopPropagation();

    // eslint-disable-next-line no-restricted-globals
    const confirmed = confirm('Are you sure you want to remove this widget?');
    if (confirmed) {
      setIsRemoving(true);
      await vm?.remove?.(widget);
      setIsRemoving(false);

      return true;
    }

    return false;
  };

  const handleRemoveAndNavigate = async (
    widget: Widget,
    e: React.MouseEvent<unknown>,
  ) => {
    e.preventDefault();

    // eslint-disable-next-line no-restricted-globals
    const confirmed = confirm(
      `Are you sure you want to remove ${widget.name}?`,
    );
    if (confirmed) {
      const success = await vm?.remove?.(widget);
      if (success) navigate('/widgets');
    }
  };

  const handleSearch = debounce(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      setIsSearching(true);
      await vm?.loadAll?.(e.target.value);
      setIsSearching(false);
    },
    300,
  );

  const handleSelect = (widget: Widget, e: React.MouseEvent<unknown>) => {
    e.stopPropagation();

    vm?.select?.(widget);

    alert(`You selected the following widget:
${'' /* Intential blank line */}
ID: ${widget.id}
Name: ${widget.name}
Description: ${widget.description}
Image URL: ${widget.imageUrl}
Created: ${formatDate(widget.createdAt)}
    `);
  };

  const handleSort = async (key: string) => {
    if (vm?.isLoading) return;

    setIsSorting(true);
    await vm?.loadAll?.(vm?.searchQuery, key);
    setIsSorting(false);
  };

  const handleEditSubmit = async (
    widget: Widget,
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();

    const target = e.target as typeof e.target & WidgetFormValues;

    const editedWidget = await vm?.edit?.({
      ...widget,
      name: target.name.value,
      description: target.description.value,
      imageUrl: target.imageUrl.value,
    });
    if (editedWidget) navigate(`/widgets/${editedWidget.id}`);
  };

  const handleNewSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const target = e.target as typeof e.target & WidgetFormValues;

    const addedWidget = await vm?.add?.({
      description: target.description.value,
      imageUrl: target.imageUrl.value,
      name: target.name.value,
    });
    if (addedWidget) navigate('/widgets');
  };

  const isSelected = (widget: Widget) => widget.id === vm?.selectedWidgetId;

  useEffect(() => {
    return () => {
      handleSearch.cancel();
    };
  }, [handleSearch]);

  const handlers: WidgetsEventHandlers = {
    isAdding,
    isEditing,
    isRemoving,
    isSearching,
    isSorting,
    handleAdd,
    handleEdit,
    handleNavigate,
    handleRemove,
    handleRemoveAndNavigate,
    handleSearch,
    handleSelect,
    handleSort,
    handleEditSubmit,
    handleNewSubmit,
    isSelected,
  };

  return handlers;
}
