import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PilotEntity } from './pilot.entity';
import { PilotService } from './pilot.service';
import { CertificationNoExistsConstraint } from './validators/certification-no-exists.validator';
import { UniqueCertificationForUpdateConstraint } from './validators/unique-certification-for-update.validator';
import { ValidPilotConstraint } from './validators/valid-pilot.validator';

@Module({
  providers: [
    PilotService,
    CertificationNoExistsConstraint,
    UniqueCertificationForUpdateConstraint,
    ValidPilotConstraint,
  ],
  imports: [TypeOrmModule.forFeature([PilotEntity])],
  exports: [PilotService],
})
export class PilotModule {}
