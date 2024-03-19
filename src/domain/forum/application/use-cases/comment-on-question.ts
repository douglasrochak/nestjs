import { UniqueEntityID } from '@/core/entities';
import { QuestionComment } from '../../enterprise/entities';
import { QuestionsRepository } from '../repositories/questions-repository';
import { QuestionCommentsRepository } from '../repositories/question-comments-repository';
import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found';

interface CommentOnQuestionUseCaseRequest {
  authorId: string;
  questionId: string;
  content: string;
}

type CommentOnQuestionUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    questionComment: QuestionComment;
  }
>;

export default class CommentOnQuestionUseCase {
  constructor(
    private questionsRepo: QuestionsRepository,
    private questionCommentsRepo: QuestionCommentsRepository,
  ) {}

  async execute({
    authorId,
    questionId,
    content,
  }: CommentOnQuestionUseCaseRequest): Promise<CommentOnQuestionUseCaseResponse> {
    const question = await this.questionsRepo.findById(questionId);
    if (!question) return left(new ResourceNotFoundError());

    const questionComment = QuestionComment.create({
      authorId: new UniqueEntityID(authorId),
      questionId: new UniqueEntityID(questionId),
      content,
    });

    await this.questionCommentsRepo.create(questionComment);

    return right({ questionComment });
  }
}
