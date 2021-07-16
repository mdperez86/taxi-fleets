import React from 'react';
import { render } from '@testing-library/react';

import Index from '../pages/index';

jest.mock('../components/templates/MainTemplate', () => ({
  MainTemplate: ({ children }) => <div data-testid="main-template">{children}</div>
}))

jest.mock('../components/organisms/Rides', () => ({
  Rides: () => <div data-testid="rides"></div>
}))

describe('<Index />', () => {
  it('should render successfully', () => {
    const { baseElement, getByTestId } = render(<Index />);
    expect(baseElement).toBeTruthy();
    expect(getByTestId('main-template')).toBeTruthy();
    expect(getByTestId('rides')).toBeTruthy();
  });
});
