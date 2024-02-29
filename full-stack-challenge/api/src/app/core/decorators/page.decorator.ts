import { BadRequestException, createParamDecorator, ExecutionContext } from "@nestjs/common";
import * as Joi from "joi";

const schema = Joi.object({
  page: Joi.number()
    .integer()
    .required(),
  size: Joi.number()
    .integer()
    .default(25),
  orderBy: Joi.string()
    .optional()
    .allow(null),
  orderDirection: Joi.string()
    .valid("asc", "desc")
    .lowercase()
    .optional()
    .allow(null),
  withDeleted: Joi.boolean()
    .default(false)
    .optional()
    .allow(null),
});

export const Page = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();

  const { error, value } = schema.validate(request.query, {
    abortEarly: false,
    allowUnknown: true,
    convert: true,
    stripUnknown: true,
  });

  if (error) {
    throw new BadRequestException(
      error.details.map(e => ({
        message: e.message.replace(/"/g, ""),
        path: e.path[0],
        type: e.type,
      })),
      `invalid_page_query_params`,
    );
  }

  return value;
});
