import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ShipService } from 'src/domains/ship/ship.service';
import { CreateShipDto } from './dto/create-ship.dto';
import { UpdateShipDto } from './dto/update-ship.dto';

@Controller('ships')
export class ShipController {
  constructor(private readonly shipService: ShipService) {}

  @Post()
  create(@Body() createShipDto: CreateShipDto) {
    return this.shipService.store(createShipDto);
  }

  @Get()
  findAll() {
    return this.shipService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.shipService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateShipDto: UpdateShipDto) {
    return this.shipService.update(id, updateShipDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.shipService.remove(id);
  }
}
