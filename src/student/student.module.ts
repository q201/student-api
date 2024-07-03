/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
 

@Module({
  imports: [
    TypeOrmModule.forFeature([Student]), // Import and provide the repository
  ],
  controllers: [StudentController],
  providers: [StudentService],
})
export class StudentModule {}
