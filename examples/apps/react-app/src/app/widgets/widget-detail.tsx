import { formatDate } from '@evolonix/rsm';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import { useEffect } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import missing from '../../assets/missing.svg';
import { useWidgetById } from '../../lib/widgets';

export const WidgetDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [
    widget,
    { isLoading, showSkeleton, select },
    { handleRemoveAndNavigate },
  ] = useWidgetById(id as string, ({ isLoading, showSkeleton, select }) => ({
    isLoading,
    showSkeleton,
    select,
  }));

  useEffect(() => {
    if (widget) select?.(widget);
  }, [widget, select]);

  return (
    <div>
      <Link
        className="text-primary-500 dark:text-primary-400 hover:text-primary-600 dark:hover:text-primary-500 mb-4 inline-flex items-center gap-1"
        to="/widgets"
      >
        <ArrowLeftIcon aria-hidden="true" className="h-4 w-4" />
        Back
      </Link>

      {showSkeleton || widget ? (
        showSkeleton ? (
          <div>
            <p className="mt-1 h-4 w-80 animate-pulse rounded-full bg-neutral-300"></p>
            <h2 className="mt-[23px] mb-[3px] h-[30px] w-60 animate-pulse rounded-full bg-neutral-300">
              &nbsp;
            </h2>
            <p className="mt-5">
              <span className="mb-1 block h-6 w-full animate-pulse rounded-full bg-neutral-300"></span>
              <span className="block h-6 w-80 animate-pulse rounded-full bg-neutral-300"></span>
            </p>
            <div className="mt-[23px] mb-[3px] h-[225px] w-[300px] animate-pulse rounded-lg bg-neutral-300"></div>
            <p className="mt-5 mb-1 h-4 w-40 animate-pulse rounded-full bg-neutral-300"></p>
          </div>
        ) : widget ? (
          <div className="space-y-4">
            <p className="text-base">{widget.id}</p>
            <h2>{widget.name}</h2>
            <p>{widget.description}</p>
            <div className="h-[225px] w-[300px] overflow-hidden rounded-lg text-neutral-500 dark:text-neutral-400">
              <img
                alt={widget.name}
                className="rounded-lg"
                src={widget.imageUrl ?? missing}
                onError={(event) => {
                  const target = event.target as HTMLImageElement;
                  target.src = missing;
                }}
              />
            </div>
            <p className="text-base">{formatDate(widget.createdAt)}</p>
          </div>
        ) : (
          <Navigate to="/widgets" />
        )
      ) : null}

      <div className="mt-4 flex justify-end gap-x-2">
        <button
          className="btn-neutral"
          disabled={isLoading}
          type="button"
          onClick={() =>
            widget ? navigate(`/widgets/${widget.id}/edit`) : undefined
          }
        >
          Edit
        </button>
        <button
          className="btn-danger"
          disabled={isLoading}
          type="button"
          onClick={(e) =>
            widget ? handleRemoveAndNavigate(widget, e) : undefined
          }
        >
          Remove
        </button>
      </div>
    </div>
  );
};
