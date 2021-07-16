import React from 'react';
import { render } from '@testing-library/react';

import { MainTemplate } from './MainTemplate';

describe('<MainTemplate />', () => {
  it('should render the price', () => {
    const title = 'Title';
    const children = 'children';
    const { baseElement, getByTestId } = render(
      <MainTemplate title={title}>
        {children}
      </MainTemplate>
    );

    expect(baseElement).toBeTruthy();
    expect(getByTestId('main-template-title').textContent).toStrictEqual(title);
    expect(getByTestId('main-template-container').textContent).toStrictEqual(children);
  })
});
