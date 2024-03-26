import { Either, left, right } from '@/core/either';
import { Question } from '../../enterprise/entities';
import { AnswersRepository } from '../repositories/answers-repository';
import { QuestionsRepository } from '../repositories/questions-repository';
import { NotAllowedError } from '@/core/errors/errors/not-allowed';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found';
import { Injectable } from '@nestjs/common';

interface ChooseQuestionBestAnswerUseCaseRequest {
  answerId: string;
  authorId: string;
}

type ChooseQuestionBestAnswerUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  { question: Question }
>;

@Injectable()
export default class ChooseQuestionBestAnswerUseCase {
  constructor(
    private questionRepo: QuestionsRepository,
    private answerRepo: AnswersRepository,
  ) {}

  async execute({
    answerId,
    authorId,
  }: ChooseQuestionBestAnswerUseCaseRequest): Promise<ChooseQuestionBestAnswerUseCaseResponse> {
    const answer = await this.answerRepo.findById(answerId);
    if (!answer) return left(new ResourceNotFoundError());

    const question = await this.questionRepo.findById(
      answer.questionId.toString(),
    );
    if (!question) return left(new ResourceNotFoundError());

    if (authorId !== question.authorId.toString())
      return left(new NotAllowedError());

    question.bestAnswerId = answer.id;
    this.questionRepo.save(question);

    return right({ question });
  }
}
