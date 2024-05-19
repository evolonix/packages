import { Button, Link } from '@evolonix/ui';

export const Home = () => {
  return (
    <>
      <div>
        This is the generated root route.{' '}
        <Link to="/about">Click here for page 2.</Link>
      </div>

      <Button>Test</Button>
    </>
  );
};
