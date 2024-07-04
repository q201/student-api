/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Put, Body, Query, Param, Delete, UseGuards } from '@nestjs/common';
import { StudentService } from './student.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { PaginationDto } from './dto/pagination.dto';
import { ApiTags,ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';

@ApiTags('students')
@Controller('students')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  // Endpoint to create a new student
  @UseGuards(RolesGuard) 
  @Roles([Role.Admin])
  @UseGuards(AuthGuard)
  @ApiBearerAuth('JWT')
  @Post()
  createStudent(@Body() data: CreateStudentDto) {
    return this.studentService.create(data);
  }

  // Endpoint to get all students with optional pagination
  @Get()
  findAll(@Query() paginationDto: PaginationDto): CreateStudentDto[] | object {
    return this.studentService.findAll(paginationDto);
  } 
  
  // Endpoint to get a student by ID
  @Get('user/:id')
  findOne(@Param('id') id: string) {
    return this.studentService.findOne(id);
  }

  // Endpoint to delete a student by ID
  @UseGuards(AuthGuard)
  @Delete('user/:id')
  removeOne(@Param('id') id: string) {
    return this.studentService.removeOne(id);
  }

  // Endpoint to update a student by ID
  @UseGuards(AuthGuard)
  @Put('user/:id')
  updateOne(@Param('id') id: string, @Body() updateStudentDto: UpdateStudentDto) {
    return this.studentService.updateOne(id, updateStudentDto);
  }

  // Endpoint to search for students by first name (case-insensitive)
  @Get('search')
  async findByFirstName(@Query('firstName') firstName: string): Promise<CreateStudentDto[]> {
    return this.studentService.findByFirstName(firstName);
  }
}
