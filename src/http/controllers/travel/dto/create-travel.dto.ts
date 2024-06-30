import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { ValidPilot } from 'src/domains/pilot/validators/valid-pilot.validator';
import { ValidPlanet } from 'src/domains/planet/validators/valid-planet.decorator';
import { ValidShip } from 'src/domains/ship/validators/valid-ship.decorator';

@ApiExtraModels()
export class CreateTravelDto {
  @IsOptional()
  @IsNumber()
  @ApiProperty({
    type: Number,
    required: false,
    description: 'The id of the contract (optional)',
    example: 1,
  })
  contractId?: number;

  @IsNotEmpty()
  @IsNumber()
  @ValidPlanet()
  @ApiProperty({
    type: Number,
    description: 'The id of the planet from which the ship will travel',
    example: 1,
  })
  fromPlanetId: number;

  @IsNotEmpty()
  @IsNumber()
  @ValidPlanet()
  @ApiProperty({
    type: Number,
    description: 'The id of the planet to which the ship will travel',
    example: 2,
  })
  toPlanetId: number;

  @IsNotEmpty()
  @IsNumber()
  @ValidPilot()
  @ApiProperty({
    type: Number,
    description: 'The id of the pilot',
    example: 1,
  })
  pilotId: number;

  @IsNotEmpty()
  @IsNumber()
  @ValidShip()
  @ApiProperty({
    type: Number,
    description: 'The id of the ship',
    example: 1,
  })
  shipId: number;
}
