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
import { ContractService } from 'src/domains/contract/contract.service';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';

@ApiTags('contracts')
@Controller('contracts')
export class ContractController {
  constructor(private readonly contractService: ContractService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(@Body() CreateContractDto: CreateContractDto) {
    return await this.contractService.store(CreateContractDto);
  }

  @HttpCode(HttpStatus.OK)
  @ApiQuery({ name: 'page', type: Number, required: false, example: 1 })
  @ApiQuery({ name: 'limit', type: Number, required: false, example: 10 })
  @Get()
  findAll(@Query('page') page: number = 1, @Query('limit') limit: number = 10) {
    return this.contractService.getAllPaginated(page, limit);
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.contractService.findOne(id);
  }

  @HttpCode(HttpStatus.CREATED)
  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateContractDto: UpdateContractDto,
  ) {
    return this.contractService.update(id, updateContractDto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.contractService.remove(id);
  }
}