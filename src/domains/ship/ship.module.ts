import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PilotCreditTransactionModule } from '../pilot-credit-transaction/pilot-credit-transaction.module';
import { ShipFuelTransactionModule } from '../ship-fuel-transaction/ship-fuel-transaction.module';
import { ShipEntity } from './ship.entity';
import { ShipService } from './ship.service';
import { ValidShipConstraint } from './validators/valid-ship.decorator';

@Module({
  imports: [
    TypeOrmModule.forFeature([ShipEntity]),
    PilotCreditTransactionModule,
    ShipFuelTransactionModule,
  ],
  exports: [ShipService],
  providers: [ShipService, ValidShipConstraint],
})
export class ShipModule {}
