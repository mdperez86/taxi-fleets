import React from 'react';
import { ThemeProvider } from '@material-ui/core';
import { render, waitFor, fireEvent } from '@testing-library/react';
import axios from 'axios';

import { Ride } from './Ride';

import theme from '../../../themes/main';

jest.mock('../../atoms/RidePrice', () => ({
  RidePrice: ({ price }) => <span data-testid="ride-price">{price}</span>,
}));

describe('<Ride />', () => {
  const ride = {
    id: 1,
    distance: 2,
  };
  const ridePrice = {
    id: ride.id,
    price: 10,
  }
  let axiosGetStub: jest.SpyInstance<Promise<unknown>>;

  beforeEach(() => {
    axiosGetStub = jest.spyOn(axios, 'get');
  });

  afterEach(() => {
    axiosGetStub.mockReset();
  });

  it('should render the ride', async () => {
    axiosGetStub.mockResolvedValue({ data: ridePrice });
    const onClick = jest.fn();
    const { baseElement, queryByTestId } = render(
      <ThemeProvider theme={theme}>
        <Ride {...ride} onClick={onClick} />
      </ThemeProvider>
    );

    expect(baseElement).toBeTruthy();
    expect(axiosGetStub).toHaveBeenNthCalledWith(1, expect.any(String));

    const rideInfoElement = queryByTestId('ride-info');
    expect(rideInfoElement).toBeTruthy();
    expect(rideInfoElement.textContent).toContain(`${ride.id}`);

    const rideClickedElement = queryByTestId('ride-clicked');
    expect(rideClickedElement).toBeFalsy();

    const ridePriceSkeletonElement = queryByTestId('ride-price-skeleton');
    expect(ridePriceSkeletonElement).toBeTruthy();

    await waitFor(() => {
      const ridePriceElement = queryByTestId('ride-price');
      expect(ridePriceElement).toBeTruthy();
      expect(ridePriceElement.textContent).toContain(`${ridePrice.price}`);
    });
  })

  it('should add Clicked text when ride element was clicked', async () => {
    axiosGetStub.mockResolvedValue({ data: ridePrice });
    const onClick = jest.fn();
    const { baseElement, getByTestId } = render(
      <ThemeProvider theme={theme}>
        <Ride {...ride} onClick={onClick} />
      </ThemeProvider>
    );

    expect(baseElement).toBeTruthy();
    expect(onClick).toHaveBeenCalledTimes(0);

    const rideElement = getByTestId('ride');

    fireEvent.click(rideElement);

    await waitFor(() => {
      expect(onClick).toHaveBeenNthCalledWith(1, ride.id);

      const rideClickedElement = getByTestId('ride-clicked');
      expect(rideClickedElement.textContent).toStrictEqual('Clicked');
    });
  })
});
