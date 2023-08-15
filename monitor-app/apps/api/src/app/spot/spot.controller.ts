import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common'
import { SpotService } from './spot.service'
import { CreateSpotDto } from './dto/create-spot.dto'
import { UpdateSpotDto } from './dto/update-spot.dto'

@Controller('spot')
export class SpotController {
  constructor(private readonly spotService: SpotService) {}

  @Post()
  create(@Body() createSpotDto: CreateSpotDto) {
    return this.spotService.create(createSpotDto)
  }

  @Get()
  findAll() {
    return this.spotService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.spotService.findOne(id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSpotDto: UpdateSpotDto) {
    return this.spotService.update(id, updateSpotDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.spotService.remove(id)
  }
}
