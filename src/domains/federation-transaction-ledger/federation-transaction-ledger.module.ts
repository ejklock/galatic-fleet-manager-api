import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FederationTransactionLedgerEntity } from './federation-transaction-ledger.entity';
import { FederationTransactionLedgerService } from './federation-transaction-ledger.service';

@Module({
  imports: [TypeOrmModule.forFeature([FederationTransactionLedgerEntity])],
  providers: [FederationTransactionLedgerService],
  exports: [FederationTransactionLedgerService],
})
export class FederationTransactionLedgerModule {}
