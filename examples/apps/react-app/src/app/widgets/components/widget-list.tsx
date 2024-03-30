import { formatDate } from '@evolonix/rsm';
import { ChevronUpIcon } from '@heroicons/react/24/solid';
import clsx from 'clsx';
import { useEffect, useRef } from 'react';
import { useWidgets } from '../../../lib/widgets';
import { WidgetListEmpty } from './widget-list.empty';
import { WidgetListSkeleton } from './widget-list.skeleton';

export function WidgetList() {
  const [
    {
      allWidgets,
      isLoading,
      selectedWidget,
      showSkeleton,
      sortBy,
      sortDirection,
    },
    {
      handleAdd,
      handleEdit,
      handleRemove,
      handleNavigate,
      handleSelect,
      handleSort,
      isSelected,
    },
  ] = useWidgets(
    false,
    ({
      allWidgets,
      isLoading,
      selectedWidget,
      showSkeleton,
      sortBy,
      sortDirection,
    }) => ({
      allWidgets,
      isLoading,
      selectedWidget,
      showSkeleton,
      sortBy,
      sortDirection,
    }),
  );

  const widgetRefs = useRef<HTMLTableRowElement[]>([]);
  useEffect(() => {
    if (selectedWidget && widgetRefs.current) {
      const index = allWidgets?.findIndex((a) => a.id === selectedWidget?.id);
      if (index) widgetRefs.current[index]?.focus();
    }
  }, [allWidgets, selectedWidget]);

  return (
    <div
      className={clsx(
        'flow-root',
        isLoading && !showSkeleton ? 'animate-pulse' : '',
      )}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-600 dark:border-neutral-500">
              <th
                className="hidden w-0 cursor-pointer p-2 text-left md:table-cell"
                onClick={() => handleSort('id')}
              >
                <div className="flex items-center gap-1">
                  ID
                  <SortIndicator
                    name="id"
                    sortBy={sortBy}
                    sortDirection={sortDirection}
                  />
                </div>
              </th>
              <th
                className="max-w-0 cursor-pointer p-2 text-left lg:w-0 lg:max-w-none"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center gap-1">
                  Name
                  <SortIndicator
                    name="name"
                    sortBy={sortBy}
                    sortDirection={sortDirection}
                  />
                </div>
              </th>
              <th
                className="hidden max-w-0 cursor-pointer p-2 text-left lg:table-cell"
                onClick={() => handleSort('description')}
              >
                <div className="flex items-center gap-1">
                  Description
                  <SortIndicator
                    name="description"
                    sortBy={sortBy}
                    sortDirection={sortDirection}
                  />
                </div>
              </th>
              <th
                className="hidden w-0 cursor-pointer p-2 text-right sm:table-cell"
                onClick={() => handleSort('createdAt')}
              >
                <div className="flex items-center justify-end gap-1">
                  <SortIndicator
                    name="createdAt"
                    sortBy={sortBy}
                    sortDirection={sortDirection}
                  />
                  Created
                </div>
              </th>
              <th className="w-0 p-2">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {showSkeleton ? (
              <WidgetListSkeleton />
            ) : allWidgets?.length === 0 ? (
              <WidgetListEmpty />
            ) : (
              allWidgets?.map((widget, index) => (
                <tr
                  className={clsx(
                    'cursor-pointer focus:outline-none',
                    isSelected(widget)
                      ? 'bg-info-200 dark:bg-info-700'
                      : !isLoading
                        ? 'hover:bg-neutral-200 focus:bg-neutral-200 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700'
                        : '',
                  )}
                  key={widget.id}
                  ref={(el) => {
                    if (el) widgetRefs.current[index] = el;
                  }}
                  tabIndex={0}
                  onClick={(e) => handleNavigate(widget, e)}
                  onKeyUp={(e) => handleNavigate(widget, e)}
                >
                  <td className="hidden w-0 whitespace-nowrap p-2 md:table-cell">
                    {widget.id}
                  </td>
                  <td
                    className="max-w-0 truncate p-2 lg:w-0 lg:max-w-none"
                    title={widget.name}
                  >
                    {widget.name}
                  </td>
                  <td
                    className="hidden max-w-0 truncate p-2 lg:table-cell"
                    title={widget.description}
                  >
                    {widget.description}
                  </td>
                  <td className="hidden w-0 whitespace-nowrap p-2 text-right sm:table-cell">
                    {formatDate(widget.createdAt)}
                  </td>
                  <td className="w-0 p-2">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        className="btn-info btn-link"
                        disabled={isLoading}
                        type="button"
                        onClick={(e) => handleSelect(widget, e)}
                      >
                        View<span className="sr-only">, {widget.name}</span>
                      </button>
                      <button
                        className="btn-neutral btn-link"
                        disabled={isLoading}
                        type="button"
                        onClick={(e) => handleEdit(widget, e)}
                      >
                        Edit<span className="sr-only">, {widget.name}</span>
                      </button>
                      <button
                        className="btn-danger btn-link"
                        disabled={isLoading}
                        type="button"
                        onClick={(e) => handleRemove(widget, e)}
                      >
                        Remove<span className="sr-only">, {widget.name}</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
          <tfoot>
            <tr>
              <td className="p-2" colSpan={5}>
                <div className="flex items-center justify-end gap-2">
                  <button
                    className="btn-primary btn-link"
                    disabled={isLoading}
                    type="button"
                    onClick={() => handleAdd()}
                  >
                    Add a widget
                  </button>
                </div>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

interface SortIndicatorProps {
  name: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

function SortIndicator({ name, sortBy, sortDirection }: SortIndicatorProps) {
  return sortBy === name ? (
    <>
      <span
        className={clsx(
          'inline-block',
          sortDirection === 'asc' ? 'rotate-180' : '',
        )}
      >
        <ChevronUpIcon aria-hidden="true" className="h-4 w-4" />
      </span>
      <span className="sr-only">
        {sortDirection === 'asc' ? 'sorted ascending' : 'sorted descending'}
      </span>
    </>
  ) : null;
}
