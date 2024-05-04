import { render } from '@testing-library/react';

import Di from './di';

describe('Di', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Di />);
    expect(baseElement).toBeTruthy();
  });
});
