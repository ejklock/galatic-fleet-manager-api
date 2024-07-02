import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FederationTransactionLedgerModule } from '../federation-transaction-ledger/federation-transaction-ledger.module';
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
    FederationTransactionLedgerModule,
  ],
  exports: [ShipService],
  providers: [ShipService, ValidShipConstraint],
})
export class ShipModule {}
