import { Injectable } from '@nestjs/common';
import {
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';
import { PlanetService } from '../planet.service';

@ValidatorConstraint({ async: true })
@Injectable()
export class ValidPlanetConstraint implements ValidatorConstraintInterface {
  constructor(private readonly planetService: PlanetService) {}

  async validate(value: number) {
    return !!this.planetService.findOne(value);
  }

  defaultMessage() {
    return 'Planet not found or invalid';
  }
}

export function ValidPlanet(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: ValidPlanetConstraint,
    });
  };
}
