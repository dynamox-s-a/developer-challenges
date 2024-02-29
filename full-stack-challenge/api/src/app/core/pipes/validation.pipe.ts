import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from "@nestjs/common";
import { ObjectSchema, ArraySchema } from "joi";
import { mapValues, isPlainObject } from "lodash";

@Injectable()
export class ValidationPipe implements PipeTransform {
  constructor(private schema: ObjectSchema | ArraySchema) {}

  transform(value: any, metadata: ArgumentMetadata) {
    let error: any
    let convertedValue: any
    if (!Array.isArray(value)) {
      const mapFunction = x =>
        isPlainObject(x) ? mapValues(x, mapFunction) : x === "null" ? null : x;

      const validate = this.schema.validate(mapValues(value, mapFunction), {
        abortEarly: false,
        stripUnknown: true,
      });
      error = validate.error
      convertedValue = validate.value
    } else {
      const validate = this.schema.validate(value, {
        abortEarly: false,
        stripUnknown: true,
      });
      error = validate.error
      convertedValue = validate.value
    }

    if (error) {
      throw new BadRequestException(
        error.details.map(e => ({
          message: e.message.replace(/"/g, ""),
          path: e.path[0],
          type: e.type,
        })),
        `invalid_${metadata.type}`,
      );
    }
    return convertedValue;
  }
}
