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
export class CertificationNoExistsConstraint
  implements ValidatorConstraintInterface
{
  constructor(private readonly pilotService: PilotService) {}

  async validate(value: string, args: ValidationArguments) {
    const [ignoreId] = args.constraints;

    const pilot = await this.pilotService.findByCertification(value);

    return !pilot || pilot.id === ignoreId;
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} already exists`;
  }
}

export function CertificationNoExists(
  ignoreId?: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [ignoreId],
      validator: CertificationNoExistsConstraint,
    });
  };
}
