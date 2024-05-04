import { render } from '@testing-library/react';

import RsmReact from './rsm-react';

describe('RsmReact', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<RsmReact />);
    expect(baseElement).toBeTruthy();
  });
});
