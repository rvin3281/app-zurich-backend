import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class UpdateBillingDto {
  @ApiPropertyOptional({ description: 'customer id' })
  @IsOptional()
  @IsNumber()
  customerId?: number;

  @ApiPropertyOptional({ description: 'premium amount paid' })
  @IsOptional()
  @IsNumber()
  premiumPaid?: number;

  @ApiPropertyOptional({ description: 'produce id' })
  @IsOptional()
  @IsNumber()
  productId?: number;
}
