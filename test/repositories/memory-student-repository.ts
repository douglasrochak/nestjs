import { StudentsRepository } from '@/domain/forum/application/repositories/students-repository';
import { Student } from '@/domain/forum/enterprise/entities';

export class MemoryStudentsRepo implements StudentsRepository {
  public items: Student[] = [];

  async findByEmail(email: string): Promise<Student | null> {
    const student = this.items.find((item) => item.email === email);
    if (!student) return null;
    return student;
  }

  async delete(student: Student): Promise<void> {
    const studentIndex = this.items.findIndex((item) => item.id === student.id);

    this.items.splice(studentIndex, 1);
  }

  async save(student: Student): Promise<void> {
    const studentIndex = this.items.findIndex((item) => item.id === student.id);

    this.items[studentIndex] = student;
  }

  async create(student: Student) {
    this.items.push(student);
  }
}
