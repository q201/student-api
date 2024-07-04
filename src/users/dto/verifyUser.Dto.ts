/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsString} from 'class-validator';

export class verifyUserDto {
  @ApiProperty( )
  @IsString()
  readonly otp: string;

}
