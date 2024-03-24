import { UniqueEntityID } from '@/core/entities';
import { AnswersRepository } from '../repositories/answers-repository';
import { Answer } from '../../enterprise/entities';
import { Either, right } from '@/core/either';
import { AnswerAttachmentList } from '../../enterprise/entities/answer-attachment-list';
import AnswerAttachment from '../../enterprise/entities/answer-attachment';
import { Injectable } from '@nestjs/common';

interface AnswerQuestionUseCaseRequest {
  instructorId: string;
  questionId: string;
  content: string;
  attachmentsIds: string[];
}

type AnswerQuestionUseCaseResponse = Either<null, { answer: Answer }>;

@Injectable()
export default class AnswerQuestionUseCase {
  constructor(private repo: AnswersRepository) {}

  async execute({
    instructorId,
    questionId,
    content,
    attachmentsIds,
  }: AnswerQuestionUseCaseRequest): Promise<AnswerQuestionUseCaseResponse> {
    const answer = Answer.create({
      content,
      authorId: new UniqueEntityID(instructorId),
      questionId: new UniqueEntityID(questionId),
    });

    const answerAttachments = attachmentsIds.map((attachmentId) => {
      return AnswerAttachment.create({
        attachmentId: new UniqueEntityID(attachmentId),
        answerId: answer.id,
      });
    });

    answer.attachments = new AnswerAttachmentList(answerAttachments);

    await this.repo.create(answer);

    return right({ answer });
  }
}
