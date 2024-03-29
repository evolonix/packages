import clsx from 'clsx';
import { Widget } from '../../../lib/widgets';
import { WidgetSkeleton } from './widget.skeleton';

export interface WidgetsListProps {
  widgets: Widget[];
  isAdding?: boolean;
  isEditing?: boolean;
  isRemoving?: boolean;
  isSelected: (widget: Widget) => boolean;
  handleSelect: (widget: Widget, e: React.MouseEvent<unknown>) => void;
  handleEdit: (widget: Widget, e: React.MouseEvent<unknown>) => void;
  handleRemove: (widget: Widget, e: React.MouseEvent<unknown>) => void;
}

export const WidgetsList = ({
  widgets,
  isAdding,
  isEditing,
  isRemoving,
  isSelected,
  handleSelect,
  handleEdit,
  handleRemove,
}: WidgetsListProps) => {
  return (
    <div>
      <ul className={isEditing || isRemoving ? 'animate-pulse' : ''}>
        {widgets?.map((widget) => (
          <li key={widget.id} className="flex items-center gap-2">
            <button
              type="button"
              className={clsx(
                'btn-link',
                isSelected(widget) ? 'text-green-600 hover:text-green-700' : '',
              )}
              onClick={(e) => handleSelect(widget, e)}
            >
              {widget.name}
            </button>
            <span className="flex-1 truncate">{widget.description}</span>
            <button
              type="button"
              className="btn-link"
              onClick={(e) => handleEdit(widget, e)}
              disabled={isEditing || isRemoving}
            >
              Edit
            </button>{' '}
            <button
              type="button"
              className="btn-link text-red-600 hover:text-red-700"
              onClick={(e) => handleRemove(widget, e)}
              disabled={isEditing || isRemoving}
            >
              Remove
            </button>
          </li>
        ))}
        {isAdding ? (
          <li className="flex items-center gap-2">
            <WidgetSkeleton />
          </li>
        ) : null}
      </ul>
    </div>
  );
};
