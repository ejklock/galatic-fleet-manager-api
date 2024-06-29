import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PilotCreditTransactionEntity } from './pilot-credit-transaction.entity';
import { PilotCreditTransactionService } from './pilot-credit-transaction.service';

@Module({
  providers: [PilotCreditTransactionService],
  imports: [TypeOrmModule.forFeature([PilotCreditTransactionEntity])],
  exports: [PilotCreditTransactionService],
})
export class PilotCreditTransactionModule {}
