import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
  } from '@nestjs/common';
  import { Observable } from 'rxjs';
  import { map } from 'rxjs/operators';
  
  @Injectable()
  export class TransformResponseInterceptor<T> implements NestInterceptor<T, any> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      return next.handle().pipe(
        map((data) => {
          const removeId = (item: any) => {
            const { id, ...rest } = item;
            return rest;
          };
  
          if (Array.isArray(data)) {
            return data.map((item) => removeId(item));
          } else if (typeof data === 'object' && data !== null) {
            return removeId(data);
          }
          
          return data;
        }),
      );
    }
  }