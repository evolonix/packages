import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import { Link } from 'react-router-dom';
import { useWidgetHandlers } from '../../lib/widgets';
import { WidgetForm } from './components';

export function WidgetNew() {
  const { handleNewSubmit } = useWidgetHandlers();

  return (
    <div>
      <Link
        className="text-primary-500 dark:text-primary-400 hover:text-primary-600 dark:hover:text-primary-500 mb-4 inline-flex items-center gap-1"
        to={'/widgets'}
      >
        <ArrowLeftIcon aria-hidden="true" className="h-4 w-4" />
        Back
      </Link>

      <WidgetForm onSubmit={handleNewSubmit} />
    </div>
  );
}
