import { inject } from '@evolonix/react';
import { StoreApi, useStore } from 'zustand';

import { useEffect } from 'react';
import { StarWarsViewModel } from './star-wars.state';
import { StarWarsStoreToken } from './star-wars.store';

export function useStarWars(id?: string) {
  const store = inject<StoreApi<StarWarsViewModel>>(StarWarsStoreToken);
  const vm = useStore(store);

  useEffect(() => {
    (async () => {
      if (!vm.isLoading && vm.starships.length === 0) {
        try {
          await vm.loadStarships();
        } catch (error) {
          console.error('Failed to load starships:', error);
        }
      }

      if (id) {
        try {
          await vm.selectStarship(id);
        } catch (error) {
          console.error(`Failed to select starship with id ${id}:`, error);
        }
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return vm;
}
