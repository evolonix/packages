import { StoreState } from '@evolonix/rsm';
import { Widget } from './widgets.model';

// *******************************************************************
// Types and initializers
// *******************************************************************

/**
 * This state is serializable
 */
export interface WidgetsState extends StoreState {
  allWidgets: Widget[];
  searchQuery: string;
  sortBy: string;
  sortDirection: 'asc' | 'desc';
  selectedWidgetId?: string;
}

/**
 * Read-only values computed from existing/updated state
 */
export interface WidgetsComputedState {
  selectedWidget?: Widget;
  errors: string[];
}

/**
 * This is a simple API meant for use within the
 * UI layer html templates
 */
export interface WidgetsApi {
  // Widgets RAVE (Remove, Add, View, Edit) - synonymous with CRUD
  loadAll: (
    query?: string,
    sortBy?: string,
    sortDirection?: 'asc' | 'desc',
  ) => Promise<Widget[]>; // View
  findById: (id: string) => Promise<Widget | null>; // View
  add: (partial: Omit<Widget, 'id' | 'createdAt'>) => Promise<Widget>; // Add
  edit: (widget: Widget, optimistic?: boolean) => Promise<Widget>; // Edit
  remove: (widget: Widget) => Promise<boolean>; // Remove
  select: (widget: Widget) => void;
}

export type WidgetsViewModel = WidgetsState & WidgetsComputedState & WidgetsApi;
