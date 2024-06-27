import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PilotEntity } from './pilot.entity';
import { PilotService } from './pilot.service';
import { CertificationNoExistsConstraint } from './validators/certification-no-exists.decorator';

@Module({
  providers: [PilotService, CertificationNoExistsConstraint],
  imports: [TypeOrmModule.forFeature([PilotEntity])],
  exports: [PilotService],
})
export class PilotModule {}
