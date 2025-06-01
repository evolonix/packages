import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import { DependencyInjector, EventBus, makeInjector } from '@evolonix/react';

import { buildApolloClient } from './apollo-client';
import { buildCountStore, buildStarWarsStore, CountStoreToken, StarWarsStoreToken } from './data-access';

export const buildInjector = (): DependencyInjector => {
  return makeInjector([
    { provide: EventBus, useFactory: () => new EventBus({ delayNotify: 10 }) },
    { provide: ApolloClient<NormalizedCacheObject>, useFactory: buildApolloClient, deps: [] },
    { provide: CountStoreToken, useFactory: buildCountStore, deps: [EventBus] },
    { provide: StarWarsStoreToken, useFactory: buildStarWarsStore, deps: [ApolloClient<NormalizedCacheObject>] },
  ]);
};
