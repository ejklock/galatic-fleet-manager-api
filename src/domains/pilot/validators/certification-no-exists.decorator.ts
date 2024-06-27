import { Injectable } from '@nestjs/common';
import {
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';
import { PilotService } from '../pilot.service';

@ValidatorConstraint({ async: true })
@Injectable()
export class CertificationNoExistsConstraint
  implements ValidatorConstraintInterface
{
  constructor(private readonly pilotService: PilotService) {}

  async validate(value: string) {
    return !(await this.pilotService.getRepository().findOne({
      where: { certification: value },
    }));
  }

  defaultMessage() {
    return 'Certification already exists';
  }
}

export function CertificationNoExists(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [CertificationNoExistsConstraint],
      validator: CertificationNoExistsConstraint,
    });
  };
}
