import { HttpException } from '@nestjs/common';

export class DomainRuleViolationException extends HttpException {
  constructor(message: string) {
    super(message, 422);
  }
}
