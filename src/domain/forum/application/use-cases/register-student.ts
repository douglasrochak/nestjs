import { Student } from '../../enterprise/entities';
import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { StudentsRepository } from '../repositories/students-repository';
import { HashGenerator } from '../crypto/hash-generator';
import { StudentAlreadyExistsError } from './errors/student-already-exists-error';

interface RegisterStudentUseCaseRequest {
  name: string;
  email: string;
  password: string;
}

type RegisterStudentUseCaseResponse = Either<
  StudentAlreadyExistsError,
  {
    student: Student;
  }
>;

@Injectable()
export default class RegisterStudentUseCase {
  constructor(
    private studentsRepo: StudentsRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    email,
    name,
    password,
  }: RegisterStudentUseCaseRequest): Promise<RegisterStudentUseCaseResponse> {
    const studentWithSameEmail = await this.studentsRepo.findByEmail(email);

    if (studentWithSameEmail) return left(new StudentAlreadyExistsError(email));

    const hashPassword = await this.hashGenerator.hash(password);

    const student = Student.create({
      name,
      email,
      password: hashPassword,
    });

    await this.studentsRepo.create(student);

    return right({ student });
  }
}
