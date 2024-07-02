import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Min } from 'class-validator';
import { ValidResource } from '../../../../domains/resource/validators/valid-resource.validator';

@ApiExtraModels()
export class ContractResourceDto {
  @ValidResource()
  @IsNotEmpty()
  @ApiProperty({
    example: 1,
    required: true,
    type: Number,
    description: 'resource id',
  })
  resourceId: number;

  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  @ApiProperty({
    example: 1,
    required: true,
    type: Number,
    description: 'quantity of resources',
  })
  quantity: number;
}
