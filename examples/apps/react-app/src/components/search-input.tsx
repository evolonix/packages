import { ArrowPathIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import clsx from 'clsx';
import { useEffect, useRef } from 'react';

export interface SearchInputProps {
  autoFocus?: boolean;
  className?: string;
  isLoading?: boolean;
  isSearching?: boolean;
  searchQuery?: string;
  onSearch?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const SearchInput = ({
  autoFocus,
  className,
  isLoading,
  isSearching,
  searchQuery,
  onSearch,
}: SearchInputProps) => {
  // Synchronize the input value with the URL query string.
  // This is a simpler way of setting the value rather than using a controlled input.
  const qRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (qRef.current) {
      qRef.current.value = searchQuery ?? '';
    }
  }, [searchQuery]);

  // Focus the search input when the page loads.
  // This replaces the autofocus attribute on the input element when the disabled attribute is used.
  useEffect(() => {
    if (autoFocus && qRef.current && !isLoading) {
      setTimeout(() => {
        qRef.current?.focus();
        // Set the cursor to the end of the input value.
        qRef.current?.setSelectionRange(
          qRef.current.value.length,
          qRef.current.value.length,
        );
      }, 0);
    }
  }, [autoFocus, isLoading]);

  return (
    <div className={clsx('relative', className)}>
      <input
        aria-label="Search widgets"
        className="focus:border-info-600 focus:ring-info-600 dark:focus:border-info-500 dark:focus:ring-info-500 w-full rounded-md border-neutral-300 pl-10 text-neutral-900 placeholder:text-neutral-500"
        defaultValue={searchQuery}
        disabled={isLoading}
        name="q"
        placeholder="Search widgets"
        ref={qRef}
        type="search"
        onChange={onSearch}
      />
      <MagnifyingGlassIcon
        aria-hidden="true"
        className={clsx(
          'absolute left-2 top-2 h-6 w-6 text-neutral-500',
          isSearching ? 'hidden' : '',
        )}
      />
      <ArrowPathIcon
        aria-hidden="true"
        className={clsx(
          'absolute left-2 top-2 h-6 w-6 animate-spin text-neutral-500',
          isSearching ? '' : 'hidden',
        )}
      />
    </div>
  );
};
