/* eslint-disable prettier/prettier */
//import {  IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';


export class signInDto{

  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;
}