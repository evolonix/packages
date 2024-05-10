import { Link } from '@evolonix/ui';

export const Nav = () => {
  return (
    <div role="navigation">
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/page-2">Page 2</Link>
        </li>
      </ul>
    </div>
  );
};
