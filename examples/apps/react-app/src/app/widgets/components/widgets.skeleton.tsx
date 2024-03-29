import { WidgetSkeleton } from './widget.skeleton';

export const WidgetsSkeleton = () => {
  return (
    <div>
      <ul>
        {Array.from({ length: 5 }).map((_, index) => (
          <li key={index} className="flex items-center gap-2">
            <WidgetSkeleton />
          </li>
        ))}
      </ul>
    </div>
  );
};
