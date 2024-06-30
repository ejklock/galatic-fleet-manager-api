import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ContractResourceModule } from 'src/domains/contract-resource/contract-resource.module';
import { ContractModule } from 'src/domains/contract/contract.module';
import { PilotCreditTransactionModule } from 'src/domains/pilot-credit-transaction/pilot-credit-transaction.module';
import { PilotShipModule } from 'src/domains/pilot-ship/pilot-ship.module';
import { PilotModule } from 'src/domains/pilot/pilot.module';
import { PlanetModule } from 'src/domains/planet/planet.module';
import { ReportModule } from 'src/domains/report/report.module';
import { ResourceModule } from 'src/domains/resource/resource.module';
import { ShipFuelTransactionModule } from 'src/domains/ship-fuel-transaction/ship-fuel-transaction.module';
import { ShipModule } from 'src/domains/ship/ship.module';
import { TravelConfigModule } from 'src/domains/travel-config/travel-config.module';
import { TravelModule } from 'src/domains/travel/travel.module';
import { ContractController } from './controllers/contract/contract.controller';
import { PilotController } from './controllers/pilot/pilot.controller';
import { ReportController } from './controllers/report/report.controller';
import { ShipController } from './controllers/ship/ship.controller';
import { TravelController } from './controllers/travel/travel.controller';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';
import { ResponseInterceptor } from './interceptors/response.interceptor';

@Module({
  imports: [
    ContractResourceModule,
    ContractModule,
    PilotModule,
    PilotShipModule,
    ResourceModule,
    ShipModule,
    TravelConfigModule,
    TravelModule,
    PlanetModule,
    PilotCreditTransactionModule,
    ShipFuelTransactionModule,
    ReportModule,
  ],
  controllers: [
    ContractController,
    PilotController,
    ShipController,
    TravelController,
    ReportController,
  ],
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
