import { Link } from 'react-router-dom';
import { useWidgets } from '../../lib/widgets';
import { WidgetsList, WidgetsSkeleton } from './components';

export const Widgets = () => {
  const [
    { showSkeleton, allWidgets },
    {
      isSorting,
      isAdding,
      isEditing,
      isRemoving,
      isSelected,
      handleSelect,
      handleAdd,
      handleEdit,
      handleRemove,
    },
  ] = useWidgets();

  return (
    <div>
      <div className="flex items-center gap-4">
        <h1 className="flex-1">Widgets</h1>
        <button type="button" className="btn" onClick={handleAdd}>
          Add Widget
        </button>
      </div>
      <div className="my-4 space-y-4">
        {showSkeleton || isSorting ? (
          <WidgetsSkeleton />
        ) : (
          <WidgetsList
            widgets={allWidgets || []}
            isAdding={isAdding}
            isEditing={isEditing}
            isRemoving={isRemoving}
            isSelected={isSelected}
            handleSelect={handleSelect}
            handleEdit={handleEdit}
            handleRemove={handleRemove}
          />
        )}
      </div>
      <Link to="/">Click here to go back to home page.</Link>
    </div>
  );
};
