import {
  Get,
  Res,
  Req,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Controller,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { MachinesService } from './machines.service';
import { AuthenticatedGuard } from '../guard/authenticated.guard';
import { CreateMachineDto, UpdateMachineDto } from '@dynamox-challenge/dto';

interface AuthRequest extends Request {
  user: {
    userId: number;
  }
}

@Controller('machines')
@UseGuards(AuthGuard('jwt'), AuthenticatedGuard)
export class MachinesController {
  constructor(private readonly machinesService: MachinesService) {}

  @Post()
  async create(
    @Body() body: CreateMachineDto,
    @Res() res: Response,
    @Req() req: AuthRequest
  ){
    const userId = req.user.userId;
    const { statusCode, data } = await this.machinesService.create(body, userId);
    return res.status(statusCode).json(data);
  }

  @Get()
  async findAll(
    @Res() res: Response,
    @Req() req: AuthRequest
  ) {
    const userId = req.user.userId;
    const { statusCode, data } = await this.machinesService.findAll(userId);
    return res.status(statusCode).json(data);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Res() res: Response,
    @Req() req: AuthRequest
  ) {
    const userId = req.user.userId;
    const { statusCode, data } = await this.machinesService.findOne(+id, userId);
    return res.status(statusCode).json(data);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() body: UpdateMachineDto,
    @Res() res: Response,
    @Req() req: AuthRequest
  ) {
    const userId = req.user.userId;
    const { statusCode, data } = await this.machinesService.update(+id, body, userId);
    return res.status(statusCode).json(data);
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Res() res: Response,
    @Req() req: AuthRequest
  ) {
    const userId = req.user.userId;
    const { statusCode, data } = await this.machinesService.remove(+id, userId);
    return res.status(statusCode).json(data);
  }
}
