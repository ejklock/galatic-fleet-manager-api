import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, Min, ValidateNested } from 'class-validator';
import { ValidPilot } from 'src/domains/pilot/validators/valid-pilot.validator';
import { ValidPlanet } from 'src/domains/planet/validators/valid-planet.decorator';
import { ContractResourceDto } from './contract-resource.dto';

@ApiExtraModels()
export class CreateContractDto {
  @IsNumber()
  @ValidPlanet()
  @ApiProperty({
    example: 1,
    required: true,
    type: Number,
    description: 'origin planet id',
  })
  originPlanetId: number;

  @IsNumber()
  @ValidPlanet()
  @ApiProperty({
    example: 2,
    required: true,
    type: Number,
    description: 'destination planet id',
  })
  destinationPlanetId: number;

  @ApiProperty({
    example: 1,
    required: true,
    type: Number,
    description: 'pilot id',
  })
  @IsNumber()
  @ValidPilot()
  pilotId: number;

  @ApiProperty({
    example: 'Contract description',
    required: true,
    type: String,
    description: 'Contract description',
  })
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    example: 1000,
    required: true,
    type: Number,
    description: 'Contract value',
  })
  @IsNumber()
  @Min(0)
  value: number;

  @ApiProperty({
    example: [
      {
        resourceId: 1,
        quantity: 10,
      },
      {
        resourceId: 2,
        quantity: 20,
      },
    ],
    required: false,
    type: [ContractResourceDto],
    description: 'List of resources',
  })
  @ValidateNested({ each: true })
  @Type(() => ContractResourceDto)
  resources: [ContractResourceDto];
}
