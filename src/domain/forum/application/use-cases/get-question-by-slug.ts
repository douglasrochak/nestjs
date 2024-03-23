import { QuestionsRepository } from '../repositories/questions-repository';
import { Question } from '../../enterprise/entities';
import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found';
import { Injectable } from '@nestjs/common';

interface GetQuestionBySlugUseCaseRequest {
  slug: string;
}

type GetQuestionBySlugUseCaseResponse = Either<
  ResourceNotFoundError,
  { question: Question }
>;

@Injectable()
export default class GetQuestionBySlugUseCase {
  constructor(private repo: QuestionsRepository) {}

  async execute({
    slug,
  }: GetQuestionBySlugUseCaseRequest): Promise<GetQuestionBySlugUseCaseResponse> {
    const question = await this.repo.findBySlug(slug);

    if (!question) return left(new ResourceNotFoundError());

    return right({ question });
  }
}
