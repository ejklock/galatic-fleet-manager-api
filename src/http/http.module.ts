import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ContractResourceModule } from 'src/domains/contract-resource/contract-resource.module';
import { ContractModule } from 'src/domains/contract/contract.module';
import { PilotCreditTransactionModule } from 'src/domains/pilot-credit-transaction/pilot-credit-transaction.module';
import { PilotModule } from 'src/domains/pilot/pilot.module';
import { PlanetModule } from 'src/domains/planet/planet.module';
import { ResourceModule } from 'src/domains/resource/resource.module';
import { ShipModule } from 'src/domains/ship/ship.module';
import { TravelConfigModule } from 'src/domains/travel-config/travel-config.module';
import { ContractController } from './controllers/contract/contract.controller';
import { PilotController } from './controllers/pilot/pilot.controller';
import { ShipController } from './controllers/ship/ship.controller';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';
import { ResponseInterceptor } from './interceptors/response.interceptor';

@Module({
  imports: [
    ContractResourceModule,
    ContractModule,
    PilotModule,
    ResourceModule,
    ShipModule,
    TravelConfigModule,
    PlanetModule,
    PilotCreditTransactionModule,
  ],
  controllers: [ContractController, PilotController, ShipController],
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
