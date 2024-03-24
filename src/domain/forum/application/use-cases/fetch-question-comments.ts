import { Either, right } from '@/core/either';
import { QuestionComment } from '../../enterprise/entities';
import { QuestionCommentsRepository } from '../repositories/question-comments-repository';
import { Injectable } from '@nestjs/common';

interface FetchQuestionCommentsUseCaseRequest {
  questionId: string;
  page: number;
}

type FetchQuestionCommentsUseCaseResponse = Either<
  null,
  {
    questionComments: QuestionComment[];
  }
>;

@Injectable()
export default class FetchQuestionCommentsUseCase {
  constructor(private repo: QuestionCommentsRepository) {}

  async execute({
    questionId,
    page,
  }: FetchQuestionCommentsUseCaseRequest): Promise<FetchQuestionCommentsUseCaseResponse> {
    const questionComments = await this.repo.findManyByQuestionId(questionId, {
      page,
    });

    return right({ questionComments });
  }
}
