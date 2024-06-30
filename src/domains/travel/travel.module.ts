import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContractModule } from '../contract/contract.module';
import { PilotCreditTransactionModule } from '../pilot-credit-transaction/pilot-credit-transaction.module';
import { PilotModule } from '../pilot/pilot.module';
import { ShipFuelTransactionModule } from '../ship-fuel-transaction/ship-fuel-transaction.module';
import { ShipModule } from '../ship/ship.module';
import { TravelConfigModule } from '../travel-config/travel-config.module';
import { TravelEntity } from './travel.entity';
import { TravelService } from './travel.service';

@Module({
  providers: [TravelService],
  imports: [
    TypeOrmModule.forFeature([TravelEntity]),
    TravelConfigModule,
    PilotModule,
    ShipModule,
    ContractModule,
    PilotCreditTransactionModule,
    ShipFuelTransactionModule,
  ],
  exports: [TravelService],
})
export class TravelModule {}
