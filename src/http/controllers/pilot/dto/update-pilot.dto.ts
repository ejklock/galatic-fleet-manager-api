import { PartialType } from '@nestjs/swagger';

import { UniqueCertificationForUpdate } from '../../../../domains/pilot/validators/unique-certification-for-update.validator';
import { CreatePilotDto } from './create-pilot.dto';

export class UpdatePilotDto extends PartialType(CreatePilotDto) {
  @UniqueCertificationForUpdate()
  certification: string;
}
