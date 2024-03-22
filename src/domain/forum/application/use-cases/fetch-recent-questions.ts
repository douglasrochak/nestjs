import { QuestionsRepository } from '../repositories/questions-repository';
import { Question } from '../../enterprise/entities';
import { Either, right } from '@/core/either';
import { Injectable } from '@nestjs/common';

interface FetchRecentQuestionsUseCaseRequest {
  page: number;
}

type FetchRecentQuestionsUseCaseResponse = Either<
  null,
  {
    questions: Question[];
  }
>;

@Injectable()
export default class FetchRecentQuestionsUseCase {
  constructor(private repo: QuestionsRepository) {}

  async execute({
    page,
  }: FetchRecentQuestionsUseCaseRequest): Promise<FetchRecentQuestionsUseCaseResponse> {
    const questions = await this.repo.findManyRecent({ page });

    return right({ questions });
  }
}
