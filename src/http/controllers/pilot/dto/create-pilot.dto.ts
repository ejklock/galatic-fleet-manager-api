import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Length,
  Max,
  Min,
} from 'class-validator';
import { CertificationNoExists } from 'src/domains/pilot/validators/certification-no-exists.validator';

import { ValidPlanet } from 'src/domains/planet/validators/valid-planet.decorator';

@ApiExtraModels()
export class CreatePilotDto {
  @IsNumber()
  @ValidPlanet()
  @ApiProperty({
    example: 1,
    required: true,
    type: Number,
    description: 'Location planet id',
  })
  locationPlanetId: number;

  @IsNotEmpty()
  @Length(7)
  @CertificationNoExists()
  @ApiProperty({
    example: '1234567',
    required: true,
    type: String,
    description:
      'Pilot certification number (7 characters) - the identification document permission to fly a ship. It uses Luhn validation similar to Brazilian CPF, composed by 6 digits and 1 check digit',
  })
  certification: string;

  @ApiProperty({
    example: 'Luke Skywalker',
    required: true,
    type: String,
    description: 'Pilot name',
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 18,
    minimum: 18,
    maximum: 255,
    required: true,
    type: Number,
    description: 'Pilot age',
  })
  @Min(18)
  @Max(255)
  @IsNumber()
  age: number;

  @ApiProperty({
    example: [1, 2, 3],
    required: false,
    type: [Number],
    description: 'List of ships id',
  })
  @IsNumber({}, { each: true })
  @IsOptional()
  shipsId?: number[];
}
