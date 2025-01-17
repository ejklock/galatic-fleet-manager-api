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
  Query,
} from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { PilotCreditTransactionService } from '../../../domains/pilot-credit-transaction/pilot-credit-transaction.service';
import { PilotService } from '../../../domains/pilot/pilot.service';
import { AddCreditDto } from './dto/add-credit.dto';
import { CreatePilotDto } from './dto/create-pilot.dto';
import { UpdatePilotDto } from './dto/update-pilot.dto';

@ApiTags('pilots')
@Controller('pilots')
export class PilotController {
  constructor(
    private readonly pilotService: PilotService,
    private readonly pilotCreditTransactionService: PilotCreditTransactionService,
  ) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(@Body() createPilotDto: CreatePilotDto) {
    const { shipsId = [], ...pilotData } = createPilotDto;

    return await this.pilotService.storeWithShips(pilotData, shipsId);
  }

  @HttpCode(HttpStatus.OK)
  @ApiQuery({ name: 'page', type: Number, required: false, example: 1 })
  @ApiQuery({ name: 'limit', type: Number, required: false, example: 10 })
  @Get()
  findAll(@Query('page') page: number = 1, @Query('limit') limit: number = 10) {
    return this.pilotService.getAllPaginatedWithCredits(page, limit);
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.pilotService.findOneWithCredits(id);
  }

  @HttpCode(HttpStatus.CREATED)
  @Patch(':id')
  update(@Param('id') id: number, @Body() updatePilotDto: UpdatePilotDto) {
    return this.pilotService.update(id, updatePilotDto);
  }
  @HttpCode(HttpStatus.CREATED)
  @Patch(':id/credits/add')
  addCredits(@Param('id') id: number, @Body() addCreditDto: AddCreditDto) {
    return this.pilotCreditTransactionService.createPilotCreditTransaction(
      id,
      'ADD CREDITS',
      addCreditDto.amount,
    );
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.pilotService.remove(id);
  }
}
