import { QuestionsRepository } from '../repositories/questions-repository';
import { Question } from '../../enterprise/entities';
import { Either, right } from '@/core/either';

interface FetchRecentQuestionsUseCaseRequest {
  page: number;
}

type FetchRecentQuestionsUseCaseResponse = Either<
  null,
  {
    questions: Question[];
  }
>;

export default class FetchRecentQuestionsUseCase {
  constructor(private repo: QuestionsRepository) {}

  async execute({
    page,
  }: FetchRecentQuestionsUseCaseRequest): Promise<FetchRecentQuestionsUseCaseResponse> {
    const questions = await this.repo.findManyRecent({ page });

    return right({ questions });
  }
}
