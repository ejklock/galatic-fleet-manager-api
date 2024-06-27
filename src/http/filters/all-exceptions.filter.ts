import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);
  catch(exception: Error, host: ArgumentsHost) {
    this.logger.error(exception);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    let resultMessage: string | object = message;

    if (typeof message === 'object' && 'message' in message) {
      resultMessage = message.message as object;
    }

    response.status(status).json({
      statusCode: status,
      errors: resultMessage,
      message: exception.message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
