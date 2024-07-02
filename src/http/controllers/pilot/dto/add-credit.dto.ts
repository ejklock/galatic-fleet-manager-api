import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Min } from 'class-validator';

@ApiExtraModels()
export class AddCreditDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @ApiProperty({
    example: 150,
    required: true,
    type: Number,
    description: 'Credit amount',
  })
  amount: number;
}
