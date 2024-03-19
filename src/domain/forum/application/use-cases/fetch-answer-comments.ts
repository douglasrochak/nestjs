import { Either, right } from '@/core/either';
import { AnswerComment } from '../../enterprise/entities';
import { AnswerCommentsRepository } from '../repositories/answer-comments-repository';

interface FetchAnswerCommentsUseCaseRequest {
  answerId: string;
  page: number;
}

type FetchAnswerCommentsUseCaseResponse = Either<
  null,
  {
    answerComments: AnswerComment[];
  }
>;

export default class FetchAnswerCommentsUseCase {
  constructor(private repo: AnswerCommentsRepository) {}

  async execute({
    answerId,
    page,
  }: FetchAnswerCommentsUseCaseRequest): Promise<FetchAnswerCommentsUseCaseResponse> {
    const answerComments = await this.repo.findManyByAnswerId(answerId, {
      page,
    });

    return right({ answerComments });
  }
}
