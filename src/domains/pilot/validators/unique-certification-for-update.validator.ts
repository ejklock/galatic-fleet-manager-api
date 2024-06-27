import { Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';
import { PilotService } from '../pilot.service';

@ValidatorConstraint({ async: true })
@Injectable()
export class UniqueCertificationForUpdateConstraint
  implements ValidatorConstraintInterface
{
  constructor(private readonly pilotService: PilotService) {}

  async validate(certification: string, args: ValidationArguments) {
    const idToUpdate = args.object['id']; // ID da entidade que está sendo atualizada

    const pilotWithSameCertification =
      await this.pilotService.findOtherPilotWithCertification(
        idToUpdate,
        certification,
      );

    return !pilotWithSameCertification;
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} already exists for another pilot`;
  }
}

export function UniqueCertificationForUpdate(
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'uniqueCertificationForUpdate',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: UniqueCertificationForUpdateConstraint,
    });
  };
}
