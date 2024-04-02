import { Route, Routes } from 'react-router-dom';
import { Nav } from '../components';
import { Home } from './home/home';
import { WidgetsRoutes } from './widgets/widgets.routes';

export function App() {
  return (
    <div className="p-4">
      <Nav />

      <main className="mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/widgets/*" element={<WidgetsRoutes />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
