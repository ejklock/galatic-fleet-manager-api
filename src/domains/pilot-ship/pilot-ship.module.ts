import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PilotShipEntity } from './pilot-ship.entity';
import { PilotShipService } from './pilot-ship.service';

@Module({
  providers: [PilotShipService],
  imports: [TypeOrmModule.forFeature([PilotShipEntity])],
  exports: [PilotShipService],
})
export class PilotShipModule {}
