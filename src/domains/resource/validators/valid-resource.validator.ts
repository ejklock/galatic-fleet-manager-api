import { Injectable } from '@nestjs/common';
import {
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';
import { ResourceService } from '../resource.service';

@ValidatorConstraint({ async: true })
@Injectable()
export class ValidResourceConstraint implements ValidatorConstraintInterface {
  constructor(private readonly resourceService: ResourceService) {}

  async validate(value: number) {
    return !!(await this.resourceService.findOne(value));
  }

  defaultMessage() {
    return 'Resource not found or invalid';
  }
}

export function ValidResource(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: ['shipId'],
      validator: ValidResourceConstraint,
    });
  };
}
