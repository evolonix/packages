import clsx from 'clsx';
import { Fragment } from 'react';
import { NavLink, useParams } from 'react-router-dom';

import { useStarWars } from '../../lib/data-access';

export const About = () => {
  const { id } = useParams();
  const vm = useStarWars(id);

  return (
    // <div>
    //   <Link to="/">Click here to go back to root page.</Link>
    // </div>

    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-12 gap-4">
        <ul className="col-span-full lg:col-span-4 flex flex-col items-center justify-center rounded border border-zinc-200 dark:border-zinc-600">
          {vm.showSkeleton
            ? Array.from({ length: 36 }).map((_, index) => (
                <Fragment key={index}>
                  <li className="w-full border-b border-zinc-200 p-4 font-bold last:border-b-0 dark:border-zinc-600">
                    <div className="h-6 w-full animate-pulse rounded-lg bg-neutral-900 dark:bg-neutral-100" />
                  </li>
                </Fragment>
              ))
            : vm.starships.map((starship) => (
                <Fragment key={starship.id}>
                  <li className="w-full border-b border-zinc-200 p-4 font-bold last:border-b-0 dark:border-zinc-600">
                    <NavLink
                      to={`/about/${starship.id}`}
                      className={({ isActive }) =>
                        clsx(
                          'block w-full',
                          'hover:text-cyan-700 dark:hover:text-cyan-500',
                          isActive ? 'text-cyan-600 dark:text-cyan-400' : '',
                        )
                      }
                    >
                      {starship.name}
                    </NavLink>
                  </li>
                </Fragment>
              ))}
        </ul>
        <div className="col-span-full lg:col-span-8">
          {vm.isLoading ? (
            <h2 className="h-7 w-52 animate-pulse rounded-lg bg-neutral-900 font-bold sm:w-64 dark:bg-neutral-100">
              &nbsp;
            </h2>
          ) : vm.selectedStarship ? (
            <h2 className="font-bold">{vm.selectedStarship.name}</h2>
          ) : (
            <>
              <h2 className="font-bold">Starships</h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Explore the various starships from the Star Wars universe. Click
                on a starship to learn more about it.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
