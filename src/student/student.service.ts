/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository  , ILike} from 'typeorm';
import { Student } from './entities/student.entity';
import { UpdateStudentDto } from './dto/update-student.dto';
import { CreateStudentDto } from './dto/create-student.dto';
import { PaginationDto } from './dto/pagination.dto';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student)
    private studentRepository: Repository<Student>, // Injecting Student repository
  ) {}

  // Create a new student record
  async create(data: CreateStudentDto) {
    const students = this.studentRepository.create(data);
    return await this.studentRepository.save(students);
  }

  // Find all students with pagination
  async findAll(paginationDto: PaginationDto): Promise<Student[]> {
    const { page, limit } = paginationDto;

    // Check if page and limit are provided
    if (page && limit) {
      const parsedPage = parseInt(page, 10);
      const parsedLimit = parseInt(limit, 10);

      const skip = (parsedPage - 1) * parsedLimit;

      // Apply pagination
      const students = await this.studentRepository.find({
        skip,
        take: parsedLimit,
      });

      return students;
    } else {
      // Return all records if page and limit are not provided
      const students = await this.studentRepository.find();
      return students;
    }
  }

  // Find a student by ID
  async findOne(id: string) {
    const studentDetails = await this.studentRepository.findOne({
      where: { id: id },
    });
    return studentDetails;
  }

  // Remove a student by ID
  async removeOne(id: string) {
    await this.studentRepository.delete(id);
  }

  // Update a student by ID
  async updateOne(id: string, updateStudentDto: UpdateStudentDto) {
    await this.studentRepository.update({ id: id }, updateStudentDto);
  }

  // Search all students with firstName
  async findByFirstName(firstName: string): Promise<Student[]> {
    return this.studentRepository.find({ where: { firstName: ILike(`${firstName}%`) } });
  }
}
