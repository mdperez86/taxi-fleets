import { BusinessException } from './business.exception';

export class RideNotFoundException extends BusinessException {
  constructor(public readonly rideId: number) {
    super('RIDE_NOT_FOUND', `Ride with id ${rideId} was not found`);
  }
}
