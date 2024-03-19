import { UniqueEntityID } from '@/core/entities';
import { Optional } from '@/core/types';
import Comment, { CommentProps } from './comment';

export interface AnswerCommentProps extends CommentProps {
  answerId: UniqueEntityID;
}

export default class AnswerComment extends Comment<AnswerCommentProps> {
  static create(
    props: Optional<AnswerCommentProps, 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    const answerComment = new AnswerComment(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    return answerComment;
  }

  get answerId() {
    return this.props.answerId;
  }
}
