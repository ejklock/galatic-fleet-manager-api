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
import { ShipService } from 'src/domains/ship/ship.service';
import { CreateShipDto } from './dto/create-ship.dto';
import { UpdateShipDto } from './dto/update-ship.dto';

@ApiTags('ships')
@Controller('ships')
export class ShipController {
  constructor(private readonly shipService: ShipService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  create(@Body() createShipDto: CreateShipDto) {
    return this.shipService.store(createShipDto);
  }

  @HttpCode(HttpStatus.OK)
  @Get()
  findAll() {
    return this.shipService.findAll();
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.shipService.findOne(+id);
  }

  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateShipDto: UpdateShipDto) {
    return this.shipService.update(id, updateShipDto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.shipService.remove(id);
  }
}
