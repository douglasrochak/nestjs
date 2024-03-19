import { Entity, UniqueEntityID } from '@/core/entities';

interface StudentProps {
  name: string;
}

export default class Student extends Entity<StudentProps> {
  static create(props: StudentProps, id?: UniqueEntityID) {
    const student = new Student(props, id);

    return student;
  }
}
