import { Injectable } from '@nestjs/common';
import {
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';
import { ShipService } from '../ship.service';

@ValidatorConstraint({ async: true })
@Injectable()
export class ValidShipConstraint implements ValidatorConstraintInterface {
  constructor(private readonly shipService: ShipService) {}

  async validate(value: number) {
    return !!this.shipService.findOne(value);
  }

  defaultMessage() {
    return 'Ship not found or invalid';
  }
}

export function ValidShip(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: ['shipId'],
      validator: ValidShipConstraint,
    });
  };
}
