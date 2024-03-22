import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { StudentsRepository } from '../repositories/students-repository';
import { HashComparer } from '../crypto/hash-comparer';
import { Encrypter } from '../crypto/encrypter';
import { WrongCredentialsError } from './errors/wrong-credentials-error';

interface AuthenticateStudentUseCaseRequest {
  email: string;
  password: string;
}

type AuthenticateStudentUseCaseResponse = Either<
  WrongCredentialsError,
  {
    accessToken: string;
  }
>;

@Injectable()
export default class AuthenticateStudentUseCase {
  constructor(
    private studentsRepo: StudentsRepository,
    private hashCompare: HashComparer,
    private encrypter: Encrypter,
  ) {}

  async execute({
    email,
    password,
  }: AuthenticateStudentUseCaseRequest): Promise<AuthenticateStudentUseCaseResponse> {
    const student = await this.studentsRepo.findByEmail(email);

    if (!student) return left(new WrongCredentialsError());

    const isPasswordCorrect = await this.hashCompare.compare(
      password,
      student.password,
    );

    if (!isPasswordCorrect) return left(new WrongCredentialsError());

    const accessToken = await this.encrypter.encrypt({
      sub: student.id.toString(),
    });

    return right({ accessToken });
  }
}
