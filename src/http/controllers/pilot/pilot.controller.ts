import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PilotService } from 'src/domains/pilot/pilot.service';
import { CreatePilotDto } from './dto/create-pilot.dto';
import { UpdatePilotDto } from './dto/update-pilot.dto';

@ApiTags('pilots')
@Controller('pilots')
export class PilotController {
  constructor(private readonly pilotService: PilotService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(@Body() createPilotDto: CreatePilotDto) {
    const { shipsId = [], ...pilotData } = createPilotDto;

    return await this.pilotService.storeWithShips(pilotData, shipsId);
  }

  @HttpCode(HttpStatus.OK)
  @Get()
  findAll() {
    return this.pilotService.findAll();
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pilotService.findOne(+id);
  }

  @HttpCode(HttpStatus.CREATED)
  @Patch(':id')
  update(@Param('id') id: number, @Body() updatePilotDto: UpdatePilotDto) {
    return this.pilotService.update(id, updatePilotDto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.pilotService.remove(id);
  }
}
