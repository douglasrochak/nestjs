import { Either, left, right } from '@/core/either';
import { Answer } from '../../enterprise/entities';
import { AnswersRepository } from '../repositories/answers-repository';
import { AnswerAttachmentList } from '../../enterprise/entities/answer-attachment-list';
import { UniqueEntityID } from '@/core/entities';
import { AnswerAttachmentsRepository } from '../repositories/answer-attachments-repository';
import AnswerAttachment from '../../enterprise/entities/answer-attachment';
import { NotAllowedError } from '@/core/errors/errors/not-allowed';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found';

interface EditAnswerUseCaseRequest {
  answerId: string;
  authorId: string;
  content: string;
  attachmentsIds: string[];
}

type EditAnswerUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    answer: Answer;
  }
>;

export default class EditAnswerUseCase {
  constructor(
    private answersRepo: AnswersRepository,
    private answerAttachmentsRepo: AnswerAttachmentsRepository,
  ) {}

  async execute({
    answerId,
    authorId,
    content,
    attachmentsIds,
  }: EditAnswerUseCaseRequest): Promise<EditAnswerUseCaseResponse> {
    const answer = await this.answersRepo.findById(answerId);

    if (!answer) return left(new ResourceNotFoundError());

    if (answer.authorId.toString() !== authorId)
      return left(new NotAllowedError());

    const currentAnswerAttachments =
      await this.answerAttachmentsRepo.findManyByAnswerId(answerId);
    const answerAttachmentList = new AnswerAttachmentList(
      currentAnswerAttachments,
    );

    const answerAttachments = attachmentsIds.map((attachmentId) =>
      AnswerAttachment.create({
        attachmentId: new UniqueEntityID(attachmentId),
        answerId: new UniqueEntityID(answerId),
      }),
    );

    answerAttachmentList.update(answerAttachments);

    answer.content = content;
    answer.attachments = answerAttachmentList;

    await this.answersRepo.save(answer);

    return right({ answer });
  }
}
