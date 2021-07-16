import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';
import { tap } from 'rxjs/operators';

import { RidesService } from '../../services/rides/rides.service';
import { RidePrice } from '../../domain/ride-price';

import { RidesController } from './rides.controller';

import * as rides from '../../../mocks/rides.json';

describe('RidesController', () => {
  let controller: RidesController;
  let ridesService: RidesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RidesController],
      providers: [RidesService],
    }).compile();

    controller = module.get<RidesController>(RidesController);
    ridesService = module.get<RidesService>(RidesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should get all rides', (done) => {
    jest.spyOn(ridesService, 'findAll').mockReturnValue(of(rides));

    controller
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

  it('should get a ride given its id', (done) => {
    const [ride] = rides;

    const findOneStub = jest
      .spyOn(ridesService, 'findOne')
      .mockReturnValue(of(ride));

    controller
      .findOne(`${ride.id}`)
      .pipe(
        tap((result) => {
          expect(findOneStub).toHaveBeenNthCalledWith(1, ride.id);
          expect(result).toStrictEqual(ride);
        })
      )
      .subscribe({
        next: () => done(),
        error: (err) => done(err),
      });
  });

  it('should get the ride price given its id', (done) => {
    const [{ id }] = rides;
    const ridePrice: RidePrice = {
      id,
      price: 100,
    };

    const calcRidePriceStub = jest
      .spyOn(ridesService, 'calcRidePrice')
      .mockReturnValue(of(ridePrice));

    controller
      .getPrice(`${id}`)
      .pipe(
        tap((result) => {
          expect(calcRidePriceStub).toHaveBeenNthCalledWith(1, id);
          expect(result).toStrictEqual(ridePrice);
        })
      )
      .subscribe({
        next: () => done(),
        error: (err) => done(err),
      });
  });
});
