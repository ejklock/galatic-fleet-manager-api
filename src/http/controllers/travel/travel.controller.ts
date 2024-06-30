import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TravelService } from 'src/domains/travel/travel.service';
import { CreateTravelDto } from './dto/create-travel.dto';
import { UpdateTravelDto } from './dto/update-travel.dto';

@Controller('travel')
@ApiTags('travel')
export class TravelController {
  constructor(private readonly travelService: TravelService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  create(@Body() createTravelDto: CreateTravelDto) {
    return this.travelService.store(createTravelDto);
  }

  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateTravelDto: UpdateTravelDto) {
    return this.travelService.update(id, updateTravelDto);
  }
}
