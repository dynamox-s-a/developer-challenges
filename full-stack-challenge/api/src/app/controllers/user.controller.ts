import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBadRequestResponse,
  ApiBasicAuth,
  ApiBody,
  ApiConsumes,
  ApiExtraModels,
  ApiNotFoundResponse,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import * as Joi from 'joi';
import { ApiPageableParams } from '../core/decorators/api-pageable.decorator';
import { Page } from '../core/decorators/page.decorator';
import { ParseObjectIdPipe } from '../core/pipes/parse-object-id.pipe';
import { ValidationPipe } from '../core/pipes/validation.pipe';
import PageResult from '../core/types/page-result.type';
import User from '../models/user.model';
import UserService from '../services/user.service';

@ApiExtraModels(User)
@ApiTags('Users')
@Controller('users')
@ApiBasicAuth('bearerAuth')
@UseGuards(AuthGuard('bearerAdmin'))
export default class UserController {
  static schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });

  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiQuery({
    name: 'criteria',
    type: 'string',
    description: 'param to filter results by text',
    required: false,
  })
  @ApiPageableParams(User)
  async list(
    @Page() page,
    @Query('criteria') criteria: string
  ): Promise<PageResult<User>> {
    const where: any = {};

    if (criteria) {
      where.$or = [
        { name: { $regex: criteria.trim(), $options: 'i' } },
        { email: { $regex: criteria.trim(), $options: 'i' } },
      ];
    }

    return this.userService.pageable({
      ...page,
      where,
      populate: 'city',
    });
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    schema: { type: 'string', format: 'objectID' },
  })
  @ApiResponse({
    status: 200,
    schema: { $ref: getSchemaPath(User) },
  })
  @ApiResponse({
    status: 404,
    description: 'User not found.',
  })
  async findById(@Param('id', ParseObjectIdPipe) id: string): Promise<User> {
    const user = await this.userService.findById(id);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado', 'user_not_found');
    }
    return user;
  }

  @Post()
  @HttpCode(201)
  @ApiConsumes('application/json')
  @ApiBody({
    type: 'application/json',
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        email: { type: 'string' },
        password: { type: 'string' },
      },
      required: ['name', 'email', 'password'],
    },
  })
  @ApiResponse({
    status: 201,
    schema: { $ref: getSchemaPath(User) },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid body fields, Check the response for details.',
  })
  async insert(
    @Body(new ValidationPipe(UserController.schema)) body
  ): Promise<User> {
    const newPassword = this.userService.encryptPassword(body.password);
    if (!newPassword) {
      throw new BadRequestException(
        'Não foi possível criar a senha',
        'new_password_error'
      );
    }
    body.password = newPassword;
    return this.userService.insert(body);
  }

  @Put(':id')
  @HttpCode(200)
  @ApiParam({
    name: 'id',
    schema: {
      type: 'string',
      format: 'objectID',
    },
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        email: { type: 'string' },
      },
      required: ['name', 'email'],
    },
  })
  @ApiResponse({
    status: 200,
    schema: { $ref: getSchemaPath(User) },
  })
  @ApiBadRequestResponse({
    description: 'Invalid body fields, Check the response for details.',
  })
  @ApiNotFoundResponse({
    description: 'User not found.',
  })
  async update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body(new ValidationPipe(UserController.schema)) body,
    @UploadedFile() file
  ): Promise<User> {
    const user = await this.userService.findById(id);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado', 'user_not_found');
    }
    return this.userService.update(user._id, body, file);
  }

  @Delete(':id')
  @HttpCode(200)
  @ApiParam({
    name: 'id',
    schema: { type: 'string', format: 'objectId' },
  })
  @ApiResponse({
    status: 200,
    description: 'User disabled',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found.',
  })
  async delete(@Param('id', ParseObjectIdPipe) id: string): Promise<void> {
    const user = await this.userService.findById(id);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado', 'user_not_found');
    }
    await this.userService.disableById(user._id);
  }
}
