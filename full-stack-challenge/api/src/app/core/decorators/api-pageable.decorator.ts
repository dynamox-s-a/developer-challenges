import { applyDecorators } from "@nestjs/common";
import { ApiQuery, ApiResponse, getSchemaPath } from "@nestjs/swagger";

export function ApiPageableParams(cls) {
  return applyDecorators(
    ApiQuery({
      name: "page",
      type: "integer",
    }),
    ApiQuery({
      name: "size",
      type: "integer",
      required: false,
    }),
    ApiQuery({
      name: "orderBy",
      type: "string",
      required: false,
      description: "name of the field to order the results",
    }),
    ApiQuery({
      name: "orderDirection",
      type: "string",
      required: false,
      enum: ["asc", "desc"],
    }),
    ApiQuery({
      name: "withDeleted",
      type: "boolean",
      required: false,
    }),
    ApiResponse({
      schema: {
        properties: {
          data: {
            type: "array",
            items: {
              $ref: getSchemaPath(cls),
            },
          },
          total: {
            type: "integer",
          },
        },
      },
    }),
  );
}
