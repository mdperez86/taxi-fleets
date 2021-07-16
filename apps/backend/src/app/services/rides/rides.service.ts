import { Injectable } from '@nestjs/common';
import { from, Observable, of, throwError } from 'rxjs';
import { find, map, switchMap } from 'rxjs/operators';

import { RideNotFoundException } from '../../exceptions/ride-not-found.exception';
import { Ride } from '../../domain/ride';
import { RidePrice } from '../../domain/ride-price';

import * as rides from '../../../mocks/rides.json';

@Injectable()
export class RidesService {
  public static INITIAL_CHARGE = 1;
  public static CHARGE_PER_ONE_OVER_FIVETH_MILES = 0.5;
  public static CHARGE_IN_NIGHT_PERIOD = 0.5;
  public static CHARGE_IN_BUSY_PERIOD = 1;

  public findAll(): Observable<Ride[]> {
    return of(rides);
  }

  public findOne(rideId: number): Observable<Ride> {
    return from(rides).pipe(
      find(({ id }) => id === rideId),
      switchMap((ride) =>
        ride ? of(ride) : throwError(new RideNotFoundException(rideId))
      ),
      map((ride) => {
        const { startTime, duration } = ride;
        const endDate = this.calcEndDate(startTime, duration);
        const endTime = endDate.toISOString();
        return {
          ...ride,
          endTime,
        };
      })
    );
  }

  public calcRidePrice(rideId: number): Observable<RidePrice> {
    return this.findOne(rideId).pipe(
      map(({ distance, startTime, endTime }) => {
        const startDate = new Date(startTime);
        const endDate = new Date(endTime);

        let price = RidesService.INITIAL_CHARGE;
        price += this.calcAmountPerOneOverFivethMile(distance);
        price += this.calcChargeInNightPeriod(startDate, endDate);
        price += this.calcChargeInBusyPeriod(startDate, endDate);
        return {
          id: rideId,
          price,
        };
      })
    );
  }

  private calcAmountPerOneOverFivethMile(distance: number): number {
    return (distance / (1 / 5)) * RidesService.CHARGE_PER_ONE_OVER_FIVETH_MILES;
  }

  private calcEndDate(startTime: string, duration: number): Date {
    const endDate = new Date(startTime);
    endDate.setSeconds(endDate.getSeconds() + duration);
    return endDate;
  }

  private calcChargeInNightPeriod(startDate: Date, endDate: Date): number {
    const day =
      startDate.getUTCHours() >= 6
        ? startDate.getUTCDate()
        : startDate.getUTCDate() - 1;
    const startNightDate = new Date(
      Date.UTC(startDate.getUTCFullYear(), startDate.getUTCMonth(), day, 20)
    );
    const endNightDate = new Date(
      Date.UTC(endDate.getUTCFullYear(), endDate.getUTCMonth(), day + 1, 6)
    );
    if (
      (startNightDate <= startDate && startDate < endNightDate) ||
      (startNightDate < endDate && endDate <= endNightDate) ||
      (startDate <= startNightDate && endNightDate <= endDate)
    )
      return RidesService.CHARGE_IN_NIGHT_PERIOD;
    return 0;
  }

  private calcChargeInBusyPeriod(startDate: Date, endDate: Date): number {
    const startBusyDate = new Date(
      Date.UTC(
        startDate.getUTCFullYear(),
        startDate.getUTCMonth(),
        startDate.getUTCDate(),
        16
      )
    );
    const endBusyDate = new Date(
      Date.UTC(
        startDate.getUTCFullYear(),
        startDate.getUTCMonth(),
        startDate.getUTCDate(),
        19
      )
    );
    if (
      (startBusyDate <= startDate && startDate < endBusyDate) ||
      (startBusyDate < endDate && endDate <= endBusyDate) ||
      (startDate <= startBusyDate && endBusyDate <= endDate)
    )
      return RidesService.CHARGE_IN_BUSY_PERIOD;
    return 0;
  }
}
