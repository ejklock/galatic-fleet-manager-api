import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { isObject } from 'class-validator';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  private readonly logger = new Logger(ResponseInterceptor.name);
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const baseUrlPathWithoutQueryParams = request.originalUrl.split('?')[0];

    this.logger.log(`[Response] ${request.method} ${request.url}`);

    return next.handle().pipe(
      map((resultData) => {
        if (
          request.method === 'POST' &&
          response.statusCode === HttpStatus.CREATED &&
          resultData?.id
        ) {
          const location = `${request.protocol}://${request.get('host')}${request.originalUrl}/${resultData.id}`;
          response.setHeader('Location', location);
        }

        if (request.method === 'GET' && resultData && resultData.meta) {
          const baseUrl = `${request.protocol}://${request.get('host')}${baseUrlPathWithoutQueryParams}`;
          resultData.links.first = `${baseUrl}${resultData.links.first}`;
          resultData.links.last = `${baseUrl}${resultData.links.last}`;
          if (resultData.links.prev) {
            resultData.links.prev = `${baseUrl}${resultData.links.prev}`;
          }
          if (resultData.links.next) {
            resultData.links.next = `${baseUrl}${resultData.links.next}`;
          }
        }
        let data = resultData;
        if (isObject(data) && 'data' in data) {
          data = {
            ...data,
          };
        } else {
          data = {
            data,
          };
        }
        return {
          status: 'success',
          ...data,
        };
      }),
    );
  }
}
