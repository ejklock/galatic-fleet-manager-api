import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContractResourceEntity } from './contract-resource.entity';
import { ContractResourceService } from './contract-resource.service';

@Module({
  providers: [ContractResourceService],
  imports: [TypeOrmModule.forFeature([ContractResourceEntity])],
  exports: [TypeOrmModule, ContractResourceService],
})
export class ContractResourceModule {}
