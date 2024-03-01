import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { Types } from 'mongoose';

@Injectable()
export class ParseObjectIdPipe implements PipeTransform<any, Types.ObjectId> {
  transform(value: any): Types.ObjectId {
    if (!value) {
      return null;
    }
    const validObjectId: boolean = Types.ObjectId.isValid(value);

    if (!validObjectId) {
      throw new BadRequestException(
        'invalid_id_format',
        'Ensure that the param is an ObjectId'
      );
    }

    return Types.ObjectId.createFromHexString(value);
  }
}
