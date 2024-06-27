import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { PilotModule } from 'src/domains/pilot/pilot.module';
import { PlanetModule } from 'src/domains/planet/planet.module';
import { ShipModule } from 'src/domains/ship/ship.module';
import { PilotController } from './controllers/pilot/pilot.controller';
import { ShipController } from './controllers/ship/ship.controller';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';
import { ResponseInterceptor } from './interceptors/response.interceptor';

@Module({
  imports: [PlanetModule, ShipModule, PilotModule],
  controllers: [ShipController, PilotController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class HttpModule {}
