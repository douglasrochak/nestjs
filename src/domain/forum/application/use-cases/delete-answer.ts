import { Either, left, right } from '@/core/either';
import { AnswersRepository } from '../repositories/answers-repository';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found';
import { NotAllowedError } from '@/core/errors/errors/not-allowed';

interface DeleteAnswerUseCaseRequest {
  answerId: string;
  authorId: string;
}

type DeleteAnswerUseCaseResponse = Either<ResourceNotFoundError, object>;

export default class DeleteAnswerUseCase {
  constructor(private repo: AnswersRepository) {}

  async execute({
    answerId,
    authorId,
  }: DeleteAnswerUseCaseRequest): Promise<DeleteAnswerUseCaseResponse> {
    const answer = await this.repo.findById(answerId);

    if (!answer) return left(new ResourceNotFoundError());

    if (answer.authorId.toString() !== authorId)
      return left(new NotAllowedError());

    await this.repo.delete(answer);

    return right({});
  }
}
