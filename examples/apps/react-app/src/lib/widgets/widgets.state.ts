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
  selectedWidgetId?: string;
  sortBy: string;
  sortDirection: 'asc' | 'desc';
}

/**
 * Read-only values computed from existing/updated state
 */
export interface WidgetsComputedState {
  errors: string[];
  selectedWidget?: Widget;
}

/**
 * This is a simple API meant for use within the
 * UI layer html templates
 */
export interface WidgetsApi {
  // Widgets RAVE (Remove, Add, View, Edit) - synonymous with CRUD
  add: (
    partial: Omit<Widget, 'id' | 'createdAt'>,
  ) => Promise<Widget | undefined>; // Add
  edit: (widget: Widget, optimistic?: boolean) => Promise<Widget>; // Edit
  findById: (id: string) => Promise<Widget | null>; // View
  loadAll: (
    searchQuery?: string,
    sortBy?: string,
    sortDirection?: 'asc' | 'desc',
  ) => Promise<Widget[]>; // View
  remove: (widget: Widget) => Promise<boolean>; // Remove
  select: (widget: Widget) => void;
}

export type WidgetsViewModel = WidgetsState & WidgetsComputedState & WidgetsApi;
