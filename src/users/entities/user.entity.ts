/* eslint-disable prettier/prettier */
//import {  IsString, IsNotEmpty } from 'class-validator';

import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  role?: string;

  @Column({ unique: true })
  email: string;

  @Column({ default: false })
  isVerified: boolean;


  @Column({ nullable: true })
  profilePictureUrl: string;
 
}
