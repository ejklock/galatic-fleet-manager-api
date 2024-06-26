import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { PilotService } from 'src/domains/pilot/pilot.service';
import { CreatePilotDto } from './dto/create-pilot.dto';
import { UpdatePilotDto } from './dto/update-pilot.dto';

@Controller('pilots')
export class PilotController {
  constructor(private readonly pilotService: PilotService) {}

  @Post()
  create(@Body() createPilotDto: CreatePilotDto) {
    return this.pilotService.store(createPilotDto);
  }

  @Get()
  findAll() {
    return this.pilotService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pilotService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updatePilotDto: UpdatePilotDto) {
    return this.pilotService.update(id, updatePilotDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.pilotService.remove(id);
  }
}
