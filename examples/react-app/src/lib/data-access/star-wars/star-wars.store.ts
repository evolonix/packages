import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import {
  initStoreState,
  InjectionToken,
  SetState,
  trackStatusWith,
} from '@evolonix/react';
import { createStore } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

import {
  GetAllStarshipsDocument,
  GetStarshipByIdDocument,
  Starship,
} from './graphql/__generated__/graphql';
import { StarWarsState, StarWarsViewModel } from './star-wars.state';

export const StarWarsStoreToken = new InjectionToken('StarWars Store');

export function buildStarWarsStore(
  client: ApolloClient<NormalizedCacheObject>,
) {
  const configureStore = (
    set: SetState<StarWarsViewModel>,
    get: () => StarWarsViewModel,
  ) => {
    const state = initStoreState();

    return {
      ...state,

      // Initial state
      starships: [] as Starship[],

      // Actions
      loadStarships: async () => {
        set({ showSkeleton: true });

        await trackStatusWith<StarWarsState>(set, get)(
          async () => {
            const results = await client.query({
              query: GetAllStarshipsDocument,
              variables: {},
            });
            const starships =
              (results.data.allStarships?.starships as Starship[]) || [];

            return { starships };
          },
          { waitForId: 'loadStarships', minimumWaitTime: 1000 },
        );
      },

      selectStarship: async (id?: string) => {
        if (!id) {
          set({ selectedStarship: undefined });
          return;
        }

        const starship = get().starships.find((s) => s.id === id);
        if (starship) {
          set({ selectedStarship: starship });
          return;
        }

        await trackStatusWith<StarWarsState>(set, get)(
          async () => {
            const results = await client.query({
              query: GetStarshipByIdDocument,
              variables: { id },
            });
            const starship = results.data.starship as Starship;

            return { selectedStarship: starship };
          },
          { waitForId: 'selectStarship', minimumWaitTime: 1000 },
        );
      },
    };
  };

  const store = createStore<StarWarsViewModel>()(
    devtools(immer(configureStore)),
  );

  return store;
}
