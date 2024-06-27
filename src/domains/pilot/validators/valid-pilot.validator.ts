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
export class ValidPilotConstraint implements ValidatorConstraintInterface {
  constructor(private readonly pilotService: PilotService) {}

  async validate(value: number) {
    console.log(value);
    return !!this.pilotService.findOne(value);
  }

  defaultMessage() {
    return 'Pilot not found or invalid';
  }
}

export function ValidPilot(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: ['shipId'],
      validator: ValidPilotConstraint,
    });
  };
}
