import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateBillingDto {
  @ApiProperty({ example: 1, description: 'Customer ID-foreign key' })
  @IsNumber()
  @IsNotEmpty()
  customerId!: number;

  @ApiProperty({ example: 2, description: 'Product ID-foreign key' })
  @IsNumber()
  @IsNotEmpty()
  productId!: number;

  @IsNumber({}, { message: 'premiumPaid must be a number' })
  @IsNotEmpty()
  @ApiProperty({ example: 10.4, description: 'Provide premium paid in decimal (Ex: RM 10.40)' })
  premiumPaid!: number;
}
