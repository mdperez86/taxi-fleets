import { Module } from '@nestjs/common';

import { RidesController } from './controllers/rides/rides.controller';
import { RidesService } from './services/rides/rides.service';

@Module({
  imports: [],
  controllers: [RidesController],
  providers: [RidesService],
})
export class AppModule {}
