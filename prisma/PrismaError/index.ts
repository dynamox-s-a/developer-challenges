/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  PrismaClientValidationError,
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
} from '@prisma/client/runtime/library';
import { HttpStatus } from '@nestjs/common';

export class PrismaError {
  constructor(error: any) {
    PrismaError.handle(error);
  }

  static handle(error: any): {
    statusCode: number;
    data: string;
  } {
    if (error instanceof PrismaClientValidationError) {
      return { data: error.message, statusCode: HttpStatus.BAD_REQUEST };
    } else if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return { data: 'Content not found', statusCode: HttpStatus.NOT_FOUND };
      }
      return { data: error.message, statusCode: HttpStatus.BAD_REQUEST };
    } else if (error instanceof PrismaClientUnknownRequestError) {
      return { data: error.message, statusCode: HttpStatus.INTERNAL_SERVER_ERROR };
    } else {
      console.error(error);
      return { data: 'Internal server error', statusCode: HttpStatus.INTERNAL_SERVER_ERROR };
    }
  }
}
