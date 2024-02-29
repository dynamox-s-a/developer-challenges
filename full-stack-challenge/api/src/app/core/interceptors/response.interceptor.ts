import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { isArrayLikeObject, isPlainObject, omit } from 'lodash';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Response<T> {}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Observable<Response<T>> {
    const normalizeBody = (document) => {
      if (document && document.length === 0) {
        return document;
      }

      if (document) {
        Object.keys(document).forEach((key) => {
          if (isPlainObject(document[key])) {
            document[key] = normalizeBody(document[key]);
          } else if (
            isArrayLikeObject(document[key]) &&
            isPlainObject(document[key][0])
          ) {
            document[key] = document[key].map(normalizeBody);
          }
        });
      }

      return omit(document, ['temporaryPassword', 'password', '__v']);
    };

    return next.handle().pipe(
      map((data) => {
        if (Array.isArray(data)) {
          return data.map(normalizeBody);
        } else {
          return normalizeBody(data);
        }
      })
    );
  }
}
