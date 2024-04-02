import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import { useEffect } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { useWidgetById } from '../../lib/widgets';
import { WidgetForm } from './components';

export function WidgetEdit() {
  const { id } = useParams();
  const [widget, { isLoading, select }, { handleEditSubmit }] = useWidgetById(
    id as string,
    ({ isLoading, select }) => ({
      isLoading,
      select,
    }),
  );

  useEffect(() => {
    if (widget) select?.(widget);
  }, [widget, select]);

  return (
    <div>
      <Link
        className="text-primary-500 dark:text-primary-400 hover:text-primary-600 dark:hover:text-primary-500 mb-4 inline-flex items-center gap-1"
        to={widget?.id ? `/widgets/${widget?.id}` : '/widgets'}
      >
        <ArrowLeftIcon aria-hidden="true" className="h-4 w-4" />
        Back
      </Link>

      {isLoading || widget ? (
        <WidgetForm
          isLoading={isLoading}
          widget={widget}
          onSubmit={(e) => (widget ? handleEditSubmit(widget, e) : undefined)}
        />
      ) : (
        <Navigate to="/widgets" />
      )}
    </div>
  );
}
