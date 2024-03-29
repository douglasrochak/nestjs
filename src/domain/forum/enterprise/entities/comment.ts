import { Entity, UniqueEntityID } from '@/core/entities';

export interface CommentProps {
  authorId: UniqueEntityID;
  content: string;
  createdAt: Date;
  updatedAt?: Date | null;
}

export default abstract class Comment<
  Props extends CommentProps,
> extends Entity<Props> {
  private touch() {
    this.props.updatedAt = new Date();
  }

  set content(content: string) {
    this.props.content = content;
    this.touch();
  }

  get content() {
    return this.props.content;
  }

  get authorId() {
    return this.props.authorId;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }
}
