import { UniqueEntityID, Entity } from '@/core/entities';

interface InstructorProps {
  name: string;
}

export default class Instructor extends Entity<InstructorProps> {
  static create(props: InstructorProps, id?: UniqueEntityID) {
    const instructor = new Instructor(props, id);

    return instructor;
  }
}
