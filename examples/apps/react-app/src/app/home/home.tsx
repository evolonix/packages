import { Link } from 'react-router-dom';

export const Home = () => {
  return (
    <div>
      This is the generated root route.{' '}
      <Link to="/widgets">Click here for widgets.</Link>
    </div>
  );
};
