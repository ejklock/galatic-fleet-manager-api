import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TravelConfigEntity } from './travel-config.entity';
import { TravelConfigService } from './travel-config.service';

@Module({
  providers: [TravelConfigService],
  imports: [TypeOrmModule.forFeature([TravelConfigEntity])],
  exports: [TypeOrmModule, TravelConfigService],
})
export class TravelConfigModule {}
