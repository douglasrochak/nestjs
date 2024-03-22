import { Student } from '../../enterprise/entities';

export abstract class StudentsRepository {
  abstract create(student: Student): Promise<void>;
  abstract delete(student: Student): Promise<void>;
  abstract save(student: Student): Promise<void>;
  abstract findByEmail(email: string): Promise<Student | null>;
}
