import { Route, Routes } from 'react-router-dom';
import { WidgetDetail } from './widget-detail';
import { WidgetEdit } from './widget-edit';
import { WidgetNew } from './widget-new';
import { Widgets } from './widgets';

export const WidgetsRoutes = () => {
  return (
    <Routes>
      <Route index element={<Widgets />} />
      <Route path=":id" element={<WidgetDetail />} />
      <Route path="new" element={<WidgetNew />} />
      <Route path=":id/edit" element={<WidgetEdit />} />
    </Routes>
  );
};
