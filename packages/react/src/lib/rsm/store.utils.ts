const requests$: Record<string, Promise<unknown> | undefined> = {};

export type AsyncFunction<T> = () => Promise<T>;

export const waitFor = async <T, U = T>(
  makeRequest: AsyncFunction<U>,
  id?: string,
): Promise<U> => {
  if (!id) return makeRequest();
  if (requests$[id]) return requests$[id] as Promise<U>;

  requests$[id] = makeRequest();
  const results = await requests$[id];

  delete requests$[id];

  return results as U;
};

export const waitForAnother = (id: string) =>
  requests$[id] ?? Promise.resolve();

export function upsert<T extends { id: string }>(item: T, target: T[]) {
  const existing = target.find((it) => it.id === item.id);
  return existing
    ? target.map((it) => (it.id === item.id ? item : it))
    : [...target, item];
}
