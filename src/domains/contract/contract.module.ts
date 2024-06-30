import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContractResourceModule } from '../contract-resource/contract-resource.module';
import { PilotModule } from '../pilot/pilot.module';
import { TravelConfigModule } from '../travel-config/travel-config.module';
import { ContractEntity } from './contract.entity';
import { ContractService } from './contract.service';

@Module({
  providers: [ContractService],
  imports: [
    TypeOrmModule.forFeature([ContractEntity]),
    TravelConfigModule,
    PilotModule,
    ContractResourceModule,
  ],
  exports: [ContractService],
})
export class ContractModule {}
