import { Link } from '@evolonix/ui';

export const Nav = () => {
  return (
    <div role="navigation">
      <ul>
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
