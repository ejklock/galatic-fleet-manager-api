import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

@ApiExtraModels()
export class CreateShipDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    type: Number,
    description: 'The fuel capacity of the ship',
    example: 10.0,
  })
  fuelCapacity: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    type: Number,
    description: 'The fuel level of the ship',
    example: 10.0,
  })
  fuelLevel: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    type: Number,
    description: 'The weight capacity of the ship',
    example: 10.0,
  })
  weightCapacity;
}
