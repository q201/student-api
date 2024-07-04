/* eslint-disable prettier/prettier */
//import {  IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';


export class RefreshTokenDto{

  
  @ApiProperty()
    refresh_token: string;
}