import { UniqueEntityID } from '@/core/entities';
import { Student } from '@/domain/forum/enterprise/entities';
import { StudentProps } from '@/domain/forum/enterprise/entities/student';
import { PrismaStudentMapper } from '@/infra/database/prisma/mappers/prisma-student-mapper';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';

export function makeStudent(
  override: Partial<StudentProps> = {},
  id?: UniqueEntityID,
) {
  const name = faker.person.firstName();
  const surname = faker.person.middleName();
  const email = `${name}${surname}@example.com`.toLowerCase();

  const student = Student.create(
    {
      name,
      email,
      password: '123456-hash',
      ...override,
    },
    id,
  );

  return student;
}

@Injectable()
export class StudentFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaStudent(data: Partial<StudentProps> = {}): Promise<Student> {
    const student = makeStudent(data);
    await this.prisma.user.create({
      data: PrismaStudentMapper.toPrisma(student),
    });

    return student;
  }
}
