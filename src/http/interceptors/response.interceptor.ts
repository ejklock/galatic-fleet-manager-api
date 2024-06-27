import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    return next.handle().pipe(
      map((data) => {
        if (
          request.method === 'POST' &&
          response.statusCode === HttpStatus.CREATED
        ) {
          const location = `${request.protocol}://${request.get('host')}${request.originalUrl}/${data.id}`;
          response.setHeader('Location', location);
        }
        return {
          status: 'success',
          message: 'Operation successful',
          data: data,
        };
      }),
    );
  }
}
