import { Controller, Get, Param } from '@nestjs/common';
import { Observable } from 'rxjs';

import { Ride } from '../../domain/ride';
import { RidePrice } from '../../domain/ride-price';
import { RidesService } from '../../services/rides/rides.service';

@Controller('rides')
export class RidesController {
  constructor(private readonly ridesService: RidesService) {}

  @Get()
  public findAll(): Observable<Ride[]> {
    return this.ridesService.findAll();
  }

  @Get(':id')
  public findOne(@Param('id') id: string): Observable<Ride> {
    return this.ridesService.findOne(Number(id));
  }

  @Get(':id/price')
  public getPrice(@Param('id') id: string): Observable<RidePrice> {
    return this.ridesService.calcRidePrice(Number(id));
  }
}
