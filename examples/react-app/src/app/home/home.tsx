import { Fragment } from 'react';
import { useStarWars } from '../../lib/data-access';

export const Home = () => {
  const vm = useStarWars();

  return (
    // <>
    //   <div>
    //     This is the generated root route.{' '}
    //     <Link to="/about">Click here for page 2.</Link>
    //   </div>

    //   <Button>Test</Button>
    // </>
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-bold">Starships</h2>
      <div className="flex flex-col gap-2">
        {vm.showSkeleton ? (
          <StarshipSkeletons />
        ) : (
          <>
            {vm.starships.map((starship) => (
              <Fragment key={starship.id}>
                <div className="flex flex-col items-center justify-center rounded border border-zinc-200 p-4 text-center dark:border-zinc-600">
                  <h3 className="font-bold">{starship.name}</h3>
                </div>
              </Fragment>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export const StarshipSkeletons = () => {
  return (
    <>
      {Array.from({ length: 10 }).map((_, index) => (
        <Fragment key={index}>
          <div className="flex flex-col items-center justify-center rounded border border-zinc-200 p-4 text-center dark:border-zinc-600">
            <h3 className="font-bold h-7 w-64 animate-pulse bg-neutral-900 rounded-lg dark:bg-neutral-100">
              &nbsp;
            </h3>
          </div>
        </Fragment>
      ))}
    </>
  );
};
