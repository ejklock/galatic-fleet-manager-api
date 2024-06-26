import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlanetEntity } from './planet.entity';
import { PlanetService } from './planet.service';
import { ValidPlanetConstraint } from './validators/valid-planet.decorator';

@Module({
  providers: [PlanetService, ValidPlanetConstraint],
  imports: [TypeOrmModule.forFeature([PlanetEntity])],
  exports: [PlanetService],
})
export class PlanetModule {}
