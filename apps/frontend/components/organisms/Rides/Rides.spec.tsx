import React from 'react';
import { ThemeProvider } from '@material-ui/core';
import { render, waitFor, fireEvent } from '@testing-library/react';
import axios from 'axios';

import { Rides } from './Rides';

import theme from '../../../themes/main';

jest.mock('../../molecules/Ride', () => ({
  Ride: ({id, onClick}) => <span data-testid="ride" onClick={() => onClick(id)}></span>,
}));

describe('<Rides />', () => {
  const ride = {
    id: 1,
    distance: 2,
    duration: 60 * 60,
    endTime: new Date().toISOString(),
  };
  const rides = [ride];
  let axiosGetStub: jest.SpyInstance<Promise<unknown>>;

  beforeEach(() => {
    axiosGetStub = jest.spyOn(axios, 'get');
  });

  afterEach(() => {
    axiosGetStub.mockReset();
  });

  it('should render the rides', async () => {
    axiosGetStub.mockResolvedValue({ data: rides });
    const { baseElement, getByTestId, getAllByTestId } = render(
      <ThemeProvider theme={theme}>
        <Rides />
      </ThemeProvider>
    );

    expect(baseElement).toBeTruthy();
    expect(axiosGetStub).toHaveBeenNthCalledWith(1, expect.any(String));

    const ridesElement = getByTestId('rides');
    expect(ridesElement).toBeTruthy();

    const rideSkeletonElements = getAllByTestId('ride-skeleton');
    expect(rideSkeletonElements.length).toStrictEqual(4);

    await waitFor(() => {
      const rideElements = getAllByTestId('ride');
      expect(rideElements.length).toStrictEqual(rides.length);
    });
  });

  it('should get the ride details when click it', async () => {
    axiosGetStub
      .mockResolvedValueOnce({ data: rides })
      .mockResolvedValueOnce({ data: ride });
    
    window.alert = () => ({});

    const alertStub = jest.spyOn(global, 'alert');

    const { baseElement, getByTestId, getAllByTestId } = render(
      <ThemeProvider theme={theme}>
        <Rides />
      </ThemeProvider>
    );

    expect(baseElement).toBeTruthy();
    expect(axiosGetStub).toHaveBeenNthCalledWith(1, expect.any(String));

    const ridesElement = getByTestId('rides');
    expect(ridesElement).toBeTruthy();

    const rideSkeletonElements = getAllByTestId('ride-skeleton');
    expect(rideSkeletonElements.length).toStrictEqual(4);

    await waitFor(() => {
      const rideElements = getAllByTestId('ride');
      expect(rideElements.length).toStrictEqual(rides.length);

      fireEvent.click(rideElements[0]);
    });

    await waitFor(() => {
      expect(alertStub).toHaveBeenNthCalledWith(1, `01:00:00 - ${ride.endTime}`);
      alertStub.mockRestore();
    });
  });
});
