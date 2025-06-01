import { Link } from '@evolonix/ui';

export const Nav = () => {
  return (
    <div role="navigation">
      <ul className="flex gap-2">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/about">About</Link>
        </li>
      </ul>
    </div>
  );
};
