import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShipEntity } from './ship.entity';
import { ShipService } from './ship.service';
import { ValidShipConstraint } from './validators/valid-ship.decorator';

@Module({
  imports: [TypeOrmModule.forFeature([ShipEntity])],
  exports: [ShipService],
  providers: [ShipService, ValidShipConstraint],
})
export class ShipModule {}
