import { UniqueEntityID } from '@/core/entities';
import { Student } from '@/domain/forum/enterprise/entities';
import { StudentProps } from '@/domain/forum/enterprise/entities/student';
import { faker } from '@faker-js/faker';

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
