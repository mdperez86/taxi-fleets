import React from 'react';
import { render } from '@testing-library/react';

import { RidePrice } from './RidePrice';

describe('<RidePrice />', () => {
  it('should render the price', () => {
    const price = 10;
    const locale = 'es';
    const currency = 'EUR';
    const { baseElement } = render(
      <RidePrice price={price} locale={locale} currency={currency} />
    );
    const formatter = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
    });

    expect(baseElement).toBeDefined();
    expect(baseElement.textContent).toStrictEqual(formatter.format(price));
  })
});
