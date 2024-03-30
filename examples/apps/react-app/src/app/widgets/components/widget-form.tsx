import clsx from 'clsx';
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Widget } from '../../../lib/widgets';

export interface WidgetFormValues {
  description: { value: string };
  imageUrl: { value: string };
  name: { value: string };
}

export interface WidgetFormProps {
  isLoading?: boolean;
  widget?: Widget;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export function WidgetForm({ isLoading, widget, onSubmit }: WidgetFormProps) {
  const navigate = useNavigate();

  // Focus the search input when the page loads.
  // This replaces the autofocus attribute on the input element when the disabled attribute is used.
  const nameRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (nameRef.current && !isLoading) {
      setTimeout(() => {
        nameRef.current?.focus();
        // Set the cursor to the end of the input value.
        nameRef.current?.setSelectionRange(
          nameRef.current.value.length,
          nameRef.current.value.length,
        );
      }, 0);
    }
  }, [isLoading]);

  return (
    <form
      className={clsx('space-y-4', isLoading ? 'animate-pulse' : '')}
      onSubmit={onSubmit}
    >
      <div>
        <label className="block text-sm font-medium leading-6" htmlFor="name">
          Name
        </label>
        <div className="mt-2">
          <input
            autoComplete="off"
            className="focus:ring-info-600 block w-full rounded-md border-0 py-1.5 text-neutral-900 shadow-sm ring-1 ring-inset ring-neutral-300 placeholder:text-neutral-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
            defaultValue={widget?.name}
            disabled={isLoading}
            id="name"
            name="name"
            placeholder="Widget"
            ref={nameRef}
            required
            type="text"
          />
        </div>
      </div>

      <div>
        <label
          className="block text-sm font-medium leading-6"
          htmlFor="description"
        >
          Description
        </label>
        <div className="mt-2">
          <textarea
            autoComplete="off"
            className="focus:ring-info-600 block w-full rounded-md border-0 py-1.5 text-neutral-900 shadow-sm ring-1 ring-inset ring-neutral-300 placeholder:text-neutral-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
            defaultValue={widget?.description}
            disabled={isLoading}
            id="description"
            name="description"
            placeholder="This is a widget that does amazing things."
            required
          />
        </div>
      </div>

      <div>
        <label
          className="block text-sm font-medium leading-6"
          htmlFor="imageUrl"
        >
          Image URL
        </label>
        <div className="mt-2">
          <input
            autoComplete="off"
            className="focus:ring-info-600 block w-full rounded-md border-0 py-1.5 text-neutral-900 shadow-sm ring-1 ring-inset ring-neutral-300 placeholder:text-neutral-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
            defaultValue={widget?.imageUrl}
            disabled={isLoading}
            id="imageUrl"
            name="imageUrl"
            placeholder="https://via.placeholder.com/300x225?text=Widget+Image"
            type="text"
          />
        </div>
      </div>

      <div className="flex justify-end gap-x-2">
        <button
          className="btn-neutral"
          disabled={isLoading}
          type="button"
          onClick={() =>
            navigate(widget ? `/widgets/${widget.id}` : '/widgets')
          }
        >
          Cancel
        </button>
        <button className="btn-primary" disabled={isLoading} type="submit">
          Save
        </button>
      </div>
    </form>
  );
}
