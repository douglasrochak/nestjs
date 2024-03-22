import { Entity, UniqueEntityID } from '@/core/entities';

interface StudentProps {
  name: string;
  email: string;
  password: string;
}

export default class Student extends Entity<StudentProps> {
  get name() {
    return this.props.name;
  }

  get email() {
    return this.props.email;
  }

  get password() {
    return this.props.password;
  }

  static create(props: StudentProps, id?: UniqueEntityID) {
    const student = new Student(props, id);

    return student;
  }
}
