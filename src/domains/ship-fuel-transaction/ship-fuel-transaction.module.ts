import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShipFuelTransactionEntity } from './ship-fuel-transaction.entity';
import { ShipFuelTransactionService } from './ship-fuel-transaction.service';

@Module({
  providers: [ShipFuelTransactionService],
  imports: [TypeOrmModule.forFeature([ShipFuelTransactionEntity])],
  exports: [ShipFuelTransactionService],
})
export class ShipFuelTransactionModule {}
