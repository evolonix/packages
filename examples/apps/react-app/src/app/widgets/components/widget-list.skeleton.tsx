export const WidgetListSkeleton = () => {
  return Array.from({ length: 10 }).map((_, index) => (
    <tr key={index}>
      <td className="hidden w-0 whitespace-nowrap p-2 md:table-cell">
        <div className="my-[3px] h-3.5 w-60 animate-pulse rounded-full bg-neutral-300" />
      </td>
      <td className="max-w-0 truncate p-2 lg:w-0 lg:max-w-none">
        <div className="my-[3px] h-3.5 w-40 animate-pulse rounded-full bg-neutral-300" />
      </td>
      <td className="hidden max-w-0 truncate p-2 lg:table-cell">
        <div className="my-[3px] h-3.5 w-full animate-pulse rounded-full bg-neutral-300" />
      </td>
      <td className="hidden w-0 whitespace-nowrap p-2 text-right sm:table-cell">
        <div className="my-[3px] h-3.5 w-20 animate-pulse rounded-full bg-neutral-300" />
      </td>
      <td className="w-0 p-2">
        <div className="flex items-center justify-end gap-2">
          <div className="my-[3px] h-3.5 w-10 animate-pulse rounded-full bg-neutral-300" />
          <div className="my-[3px] h-3.5 w-10 animate-pulse rounded-full bg-neutral-300" />
          <div className="my-[3px] h-3.5 w-10 animate-pulse rounded-full bg-neutral-300" />
        </div>
      </td>
    </tr>
  ));
};
