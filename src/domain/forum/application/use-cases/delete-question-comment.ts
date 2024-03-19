import { Either, left, right } from '@/core/either';
import { QuestionCommentsRepository } from '../repositories/question-comments-repository';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found';
import { NotAllowedError } from '@/core/errors/errors/not-allowed';

interface DeleteQuestionCommentUseCaseRequest {
  authorId: string;
  questionCommentId: string;
}

type DeleteQuestionCommentUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  object
>;

export default class DeleteQuestionCommentUseCase {
  constructor(private repo: QuestionCommentsRepository) {}

  async execute({
    authorId,
    questionCommentId,
  }: DeleteQuestionCommentUseCaseRequest): Promise<DeleteQuestionCommentUseCaseResponse> {
    const questionComment = await this.repo.findById(questionCommentId);
    if (!questionComment) return left(new ResourceNotFoundError());

    if (questionComment.authorId.toString() !== authorId)
      return left(new NotAllowedError());

    await this.repo.delete(questionComment);

    return right({});
  }
}
