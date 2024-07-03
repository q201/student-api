/* eslint-disable prettier/prettier */
import { IsString, IsEmail, IsNotEmpty, MinLength, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class registerUserDto {

  @ApiProperty()  
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

 
  @ApiProperty()
  @IsString()
  @IsOptional()
  role?: string;

   @ApiProperty()
  @IsString()
  @IsOptional()
  profilePictureUrl?: string;
}
