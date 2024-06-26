import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PilotEntity } from './pilot.entity';
import { PilotService } from './pilot.service';

@Module({
  providers: [PilotService],
  imports: [TypeOrmModule.forFeature([PilotEntity])],
  exports: [TypeOrmModule, PilotService],
})
export class PilotModule {}
