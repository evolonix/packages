import { StoreState } from '@evolonix/react';

import { Starship } from './graphql/__generated__/graphql';

export interface StarWarsState extends StoreState {
  starships: Starship[];
  selectedStarship?: Starship;
}

export interface StarWarsActions {
  loadStarships: () => Promise<void>;
  selectStarship: (id?: string) => Promise<void>;
}

export type StarWarsViewModel = StarWarsState & StarWarsActions;
