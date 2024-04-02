import { faker } from '@faker-js/faker';
import localforage from 'localforage';
import { matchSorter } from 'match-sorter';
import sortBy from 'sort-by';
import widgets from '../../data/widgets';
import { Widget } from './widgets.model';

/**
 * Publish async API methods for CRUD (Create, Read, Update, Delete) operations
 * Note: use localforage offline storage for all stored widgets
 */

const allWidgets = async (): Promise<Widget[]> => {
  let storedWidgets = await localforage.getItem<Widget[]>('widgets');
  if (!storedWidgets) {
    storedWidgets = await set(widgets);
  }

  return storedWidgets;
};

// Create
export async function createWidget(
  partial: Omit<Widget, 'id' | 'createdAt'>,
): Promise<Widget> {
  await fakeNetwork();

  const widgets = await allWidgets();
  const newWidget: Widget = {
    ...partial,
    createdAt: Date.now(),
    id: faker.string.uuid(),
  };
  // Add new widget to the end of the list
  await set([...widgets, newWidget]);

  return newWidget;
}

// Delete
export async function deleteWidget(id: string): Promise<boolean> {
  await fakeNetwork();

  const widgets = await allWidgets();
  const index = widgets.findIndex((widget) => widget.id === id);
  if (index > -1) {
    widgets.splice(index, 1);
    await set(widgets);

    return true;
  }

  return false;
}

// Read
export async function getWidget(id: string): Promise<Widget | null> {
  await fakeNetwork(`widget:${id}`);

  const widgets = await allWidgets();
  const widget = widgets.find((widget) => widget.id === id);

  return widget ?? null;
}

// Read
export async function getWidgets(
  query = '',
  sortKey = 'name',
  sortDirection = 'asc',
): Promise<Widget[]> {
  await fakeNetwork(`widgets:${query}`);

  let widgets = await allWidgets();
  if (query) {
    widgets = matchSorter(widgets, query, {
      keys: ['name', 'description'],
      threshold: matchSorter.rankings.CONTAINS,
    });
  }

  return widgets.sort(
    sortBy(sortDirection === 'asc' ? `${sortKey}` : `-${sortKey}`),
  );
}

// Update
export async function updateWidget(updated: Widget): Promise<Widget> {
  await fakeNetwork();

  const widgets = await allWidgets();
  const existing = widgets.find((widget) => widget.id === updated.id);
  if (!existing) throw new Error(`No widget found for ${updated.id}`);

  updated = { ...existing, ...updated };
  await set(widgets.map((it) => (it.id === updated.id ? updated : it)));

  return updated;
}

function set(widgets: Widget[]) {
  return localforage.setItem('widgets', widgets);
}

// Fake a cache so we don't slow down stuff we've already seen
let fakeCache: Record<string, Promise<boolean>> = {};

async function fakeNetwork(key = '') {
  if (!key) fakeCache = {};

  if (!fakeCache[key]) {
    fakeCache[key] = new Promise((resolve) => {
      const timeout = Math.random() * 2000; // 800

      console.debug('fakeNetwork', { key, timeout });

      setTimeout(resolve, timeout);
    });
  }

  return fakeCache[key];
}

export function createWidgetsService() {
  return {
    createWidget,
    deleteWidget,
    getWidget,
    getWidgets,
    updateWidget,
  };
}
