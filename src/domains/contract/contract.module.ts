import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContractEntity } from './contract.entity';
import { ContractService } from './contract.service';

@Module({
  providers: [ContractService],
  imports: [TypeOrmModule.forFeature([ContractEntity])],
  exports: [TypeOrmModule, ContractService],
})
export class ContractModule {}
