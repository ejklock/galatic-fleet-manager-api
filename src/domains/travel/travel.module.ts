import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TravelEntity } from './travel.entity';
import { TravelService } from './travel.service';

@Module({
  providers: [TravelService],
  imports: [TypeOrmModule.forFeature([TravelEntity])],
  exports: [TypeOrmModule, TravelService],
})
export class TravelModule {}
