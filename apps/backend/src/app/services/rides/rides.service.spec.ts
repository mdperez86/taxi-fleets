import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { Ride } from '../../domain/ride';
import { RideNotFoundException } from '../../exceptions/ride-not-found.exception';
import { RidesService } from './rides.service';

import * as rides from '../../../mocks/rides.json';

describe('RidesService', () => {
  let service: RidesService;

  const itShouldCalcRidePrice = (
    ride: Ride,
    price: number,
    done: jest.DoneCallback
  ) => {
    const findOneStub = jest
      .spyOn(service, 'findOne')
      .mockReturnValue(of(ride));

    service
      .calcRidePrice(ride.id)
      .pipe(
        tap((result) => {
          expect(findOneStub).toHaveBeenNthCalledWith(1, ride.id);
          expect(result.id).toStrictEqual(ride.id);
          expect(result.price).toStrictEqual(price);
        })
      )
      .subscribe({
        next: () => done(),
        error: (err) => done(err),
      });
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RidesService],
    }).compile();

    service = module.get<RidesService>(RidesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get all rides', (done) => {
    service
      .findAll()
      .pipe(
        tap((result) => {
          expect(result).toStrictEqual(rides);
        })
      )
      .subscribe({
        next: () => done(),
        error: (err) => done(err),
      });
  });

  it('should get a ride by its id', (done) => {
    const [ride] = rides;
    service
      .findOne(ride.id)
      .pipe(
        tap((result) => {
          expect(result.id).toStrictEqual(ride.id);
        })
      )
      .subscribe({
        next: () => done(),
        error: (err) => done(err),
      });
  });

  it('should get a ride by its id with an endTime', (done) => {
    const [{ id, startTime, duration }] = rides;
    const endDate = new Date(startTime);
    endDate.setSeconds(endDate.getSeconds() + duration);
    const endTime = endDate.toISOString();

    service
      .findOne(id)
      .pipe(
        tap((result) => {
          expect(result.id).toStrictEqual(id);
          expect(result.endTime).toStrictEqual(endTime);
        })
      )
      .subscribe({
        next: () => done(),
        error: (err) => done(err),
      });
  });

  it('should throw RideNotFoundException if cannot find a ride for the given id', (done) => {
    service
      .findOne(-1)
      .pipe(
        catchError((err) => {
          expect(err instanceof RideNotFoundException).toBeTruthy();
          return of({});
        })
      )
      .subscribe({
        next: () => done(),
        error: (err) => done(err),
      });
  });

  it('should calc a ride price in normal period', (done) => {
    const ride: Ride = {
      id: 100,
      startTime: '2020-06-19T12:00:00.031Z',
      endTime: '2020-06-19T13:00:00.031Z',
      duration: 60 * 60,
      distance: 10,
    };

    const price =
      RidesService.INITIAL_CHARGE +
      (ride.distance / (1 / 5)) * RidesService.CHARGE_PER_ONE_OVER_FIVETH_MILES;

    itShouldCalcRidePrice(ride, price, done);
  });

  it('should calc a ride price in the begining of night period', (done) => {
    const ride: Ride = {
      id: 100,
      startTime: '2020-06-19T20:00:00.031Z',
      endTime: '2020-06-19T21:00:00.031Z',
      duration: 60 * 60,
      distance: 10,
    };

    const price =
      RidesService.INITIAL_CHARGE +
      (ride.distance / (1 / 5)) *
        RidesService.CHARGE_PER_ONE_OVER_FIVETH_MILES +
      RidesService.CHARGE_IN_NIGHT_PERIOD;

    itShouldCalcRidePrice(ride, price, done);
  });

  it('should calc a ride price in the middle of night period', (done) => {
    const ride: Ride = {
      id: 100,
      startTime: '2020-06-19T19:00:00.031Z',
      endTime: '2020-06-20T00:00:00.031Z',
      duration: 60 * 60,
      distance: 10,
    };

    const price =
      RidesService.INITIAL_CHARGE +
      (ride.distance / (1 / 5)) *
        RidesService.CHARGE_PER_ONE_OVER_FIVETH_MILES +
      RidesService.CHARGE_IN_NIGHT_PERIOD;

    itShouldCalcRidePrice(ride, price, done);
  });

  it('should calc a ride price in the end of night period', (done) => {
    const ride: Ride = {
      id: 100,
      startTime: '2020-06-19T05:59:59.999Z',
      endTime: '2020-06-19T06:59:59.999Z',
      duration: 60 * 60,
      distance: 10,
    };

    const price =
      RidesService.INITIAL_CHARGE +
      (ride.distance / (1 / 5)) *
        RidesService.CHARGE_PER_ONE_OVER_FIVETH_MILES +
      RidesService.CHARGE_IN_NIGHT_PERIOD;

    itShouldCalcRidePrice(ride, price, done);
  });

  it('should calc a ride price when duration is greater or equals to night period', (done) => {
    const ride: Ride = {
      id: 100,
      startTime: '2020-06-19T20:00:00.000Z',
      endTime: '2020-06-20T07:00:00.000Z',
      duration: 60 * 60,
      distance: 10,
    };

    const price =
      RidesService.INITIAL_CHARGE +
      (ride.distance / (1 / 5)) *
        RidesService.CHARGE_PER_ONE_OVER_FIVETH_MILES +
      RidesService.CHARGE_IN_NIGHT_PERIOD;

    itShouldCalcRidePrice(ride, price, done);
  });

  it('should calc a ride price in the begining of busy period', (done) => {
    const ride: Ride = {
      id: 100,
      startTime: '2020-06-19T16:00:00.000Z',
      endTime: '2020-06-19T17:00:00.000Z',
      duration: 60 * 60,
      distance: 10,
    };

    const price =
      RidesService.INITIAL_CHARGE +
      (ride.distance / (1 / 5)) *
        RidesService.CHARGE_PER_ONE_OVER_FIVETH_MILES +
      RidesService.CHARGE_IN_BUSY_PERIOD;

    itShouldCalcRidePrice(ride, price, done);
  });

  it('should calc a ride price in the middle of busy period', (done) => {
    const ride: Ride = {
      id: 100,
      startTime: '2020-06-19T17:00:00.000Z',
      endTime: '2020-06-19T18:00:00.000Z',
      duration: 60 * 60,
      distance: 10,
    };

    const price =
      RidesService.INITIAL_CHARGE +
      (ride.distance / (1 / 5)) *
        RidesService.CHARGE_PER_ONE_OVER_FIVETH_MILES +
      RidesService.CHARGE_IN_BUSY_PERIOD;

    itShouldCalcRidePrice(ride, price, done);
  });

  it('should calc a ride price in the end of busy period', (done) => {
    const ride: Ride = {
      id: 100,
      startTime: '2020-06-19T18:59:59.999Z',
      endTime: '2020-06-19T19:59:59.999Z',
      duration: 60 * 60,
      distance: 10,
    };

    const price =
      RidesService.INITIAL_CHARGE +
      (ride.distance / (1 / 5)) *
        RidesService.CHARGE_PER_ONE_OVER_FIVETH_MILES +
      RidesService.CHARGE_IN_BUSY_PERIOD;

    itShouldCalcRidePrice(ride, price, done);
  });

  it('should calc a ride price when duration is greater or equals to busy period', (done) => {
    const ride: Ride = {
      id: 100,
      startTime: '2020-06-19T16:00:00.000Z',
      endTime: '2020-06-19T19:00:00.000Z',
      duration: 60 * 60 * 3,
      distance: 10,
    };

    const price =
      RidesService.INITIAL_CHARGE +
      (ride.distance / (1 / 5)) *
        RidesService.CHARGE_PER_ONE_OVER_FIVETH_MILES +
      RidesService.CHARGE_IN_BUSY_PERIOD;

    itShouldCalcRidePrice(ride, price, done);
  });

  it('should calc a ride price when duration is greater or equals to busy period and night period', (done) => {
    const ride: Ride = {
      id: 100,
      startTime: '2020-06-19T00:00:00.000Z',
      endTime: '2020-06-20T00:00:00.000Z',
      duration: 60 * 60 * 24,
      distance: 10,
    };

    const price =
      RidesService.INITIAL_CHARGE +
      (ride.distance / (1 / 5)) *
        RidesService.CHARGE_PER_ONE_OVER_FIVETH_MILES +
      RidesService.CHARGE_IN_BUSY_PERIOD +
      RidesService.CHARGE_IN_NIGHT_PERIOD;

    itShouldCalcRidePrice(ride, price, done);
  });
});
