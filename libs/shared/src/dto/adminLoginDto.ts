import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AdminLoginDto {
  @ApiProperty({ example: 'admin@admin.com', description: 'Admin email address' })
  @IsNotEmpty()
  @IsString()
  email!: string;

  @ApiProperty({ example: 'abc123', description: 'Admin password' })
  @IsNotEmpty()
  @IsString()
  password!: string;
}
