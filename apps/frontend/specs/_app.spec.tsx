import React from 'react';
import { render } from '@testing-library/react';

import App from '../pages/_app';

describe('<App />', () => {
  const Component = () => <div />;
  const pageProps = {};

  it('should render successfully', () => {
    const { baseElement } = render(
      <App Component={Component} pageProps={pageProps} />
    );
    expect(baseElement).toBeTruthy();
  });
});
