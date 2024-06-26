import { Module } from '@nestjs/common';
import { PilotModule } from 'src/domains/pilot/pilot.module';
import { ShipModule } from 'src/domains/ship/ship.module';
import { ShipController } from './controllers/ship/ship.controller';
import { PilotModule } from './controllers/pilot/pilot.module';

@Module({
  imports: [ShipModule, PilotModule],
  controllers: [ShipController],
  providers: [],
})
export class HttpModule {}
