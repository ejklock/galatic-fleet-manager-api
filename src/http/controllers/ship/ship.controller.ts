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
  Put,
  Query,
} from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { ShipService } from '../../../domains/ship/ship.service';
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
  @ApiQuery({ name: 'page', type: Number, required: false, example: 1 })
  @ApiQuery({ name: 'limit', type: Number, required: false, example: 10 })
  findAll(@Query('page') page: number = 1, @Query('limit') limit: number = 10) {
    return this.shipService.getAllWithCurrentFuelLevelPaginated(page, limit);
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.shipService.findOneWithCurrentFuelLevel(+id);
  }

  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateShipDto: UpdateShipDto) {
    return this.shipService.update(id, updateShipDto);
  }

  @HttpCode(HttpStatus.OK)
  @Put(':id/add-fuel/:amount')
  addFuel(@Param('id') id: number, @Param('amount') fuelAmount: number) {
    return this.shipService.addFuel(id, fuelAmount);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.shipService.remove(id);
  }
}
