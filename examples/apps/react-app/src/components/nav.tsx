import clsx from 'clsx';
import { NavLink } from 'react-router-dom';

const navigation = [
  { to: '/', name: 'Home' },
  { to: '/widgets', name: 'Widgets' },
];

export const Nav = () => {
  return (
    <div role="navigation">
      <ul className="flex items-center gap-4">
        {navigation.map((item) => (
          <li key={item.to}>
            <NavLink
              className={({ isActive }) =>
                clsx(
                  'hover:text-secondary-400',
                  isActive ? 'text-secondary-500 hover:text-secondary-400' : '',
                )
              }
              to={item.to}
            >
              {item.name}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
};
