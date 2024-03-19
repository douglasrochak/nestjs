import { UniqueEntityID } from '@/core/entities';
import { Optional } from '@/core/types';
import Comment, { CommentProps } from './comment';

export interface QuestionCommentProps extends CommentProps {
  questionId: UniqueEntityID;
}

export default class QuestionComment extends Comment<QuestionCommentProps> {
  static create(
    props: Optional<QuestionCommentProps, 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    const questionComment = new QuestionComment(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    return questionComment;
  }

  get questionId() {
    return this.props.questionId;
  }
}
