import { NavLink, Route, Routes } from 'react-router-dom';
import { Home } from './home/home';
import { Widgets } from './widgets/widgets';

const navigation = [
  { to: '/', name: 'Home' },
  { to: '/widgets', name: 'Widgets' },
];

export function App() {
  return (
    <div className="p-4">
      <div role="navigation">
        <ul className="flex items-center gap-4">
          {navigation.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  isActive ? 'text-green-600 hover:text-green-700' : ''
                }
              >
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      <main className="mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/widgets" element={<Widgets />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
