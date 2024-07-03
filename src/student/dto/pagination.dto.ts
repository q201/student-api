/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class PaginationDto {
  @ApiProperty( )
  @IsOptional()
  @IsString()
  readonly page?: string;

  @ApiProperty( )
  @IsOptional()
  @IsString()
  readonly limit?: string;
}
