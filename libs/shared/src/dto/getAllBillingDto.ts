import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class GetAllBillingDto {
  @ApiPropertyOptional({
    description: 'page number',
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Transform(({ value }) => parseInt(value, 10))
  page?: number;

  @ApiPropertyOptional({
    description: 'page size',
  })
  @IsOptional()
  @IsInt()
  @Min(5)
  @Max(100)
  @Transform(({ value }) => parseInt(value, 10))
  size?: number;

  @ApiPropertyOptional({
    description: 'filter by product code',
  })
  @IsOptional()
  @IsString()
  productCode?: string;

  @ApiPropertyOptional({
    description: 'filter by location',
  })
  @IsOptional()
  @IsString()
  location?: string;
}
