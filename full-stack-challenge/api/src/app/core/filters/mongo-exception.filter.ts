import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import { MongoError } from 'mongodb';

@Catch(MongoError)
export class MongoExceptionFilter implements ExceptionFilter<MongoError> {
  catch(exception: MongoError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    console.log(exception);
    if (exception.code === 11000) {
      response.status(409).json({
        statusCode: 409,
        message: 'Dados duplicados',
        // @ts-expect-error: Unreachable error
        error: `duplicated${Object.keys(exception.keyPattern).reduce(
          (acc: string, key) => acc.concat('_').concat(key),
          ''
        )}`,
      });
    } else {
      response.status(500).json({
        statusCode: 500,
        message: 'Ocorreu um erro inesperado',
        error: 'general_db_error',
      });
    }
  }
}
