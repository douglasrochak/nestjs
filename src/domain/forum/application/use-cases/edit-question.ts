import { Either, left, right } from '@/core/either';
import { Question } from '../../enterprise/entities';
import { QuestionsRepository } from '../repositories/questions-repository';
import { QuestionAttachmentsRepository } from '../repositories/question-attachments-repository';
import { QuestionAttachmentList } from '../../enterprise/entities/question-attachment-list';
import QuestionAttachment from '../../enterprise/entities/question-attachment';
import { UniqueEntityID } from '@/core/entities';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found';
import { NotAllowedError } from '@/core/errors/errors/not-allowed';

interface EditQuestionUseCaseRequest {
  questionId: string;
  authorId: string;
  title: string;
  content: string;
  attachmentsIds: string[];
}

type EditQuestionUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    question: Question;
  }
>;

export default class EditQuestionUseCase {
  constructor(
    private questionsRepo: QuestionsRepository,
    private questionAttachmentsRepo: QuestionAttachmentsRepository,
  ) {}

  async execute({
    questionId,
    authorId,
    title,
    content,
    attachmentsIds,
  }: EditQuestionUseCaseRequest): Promise<EditQuestionUseCaseResponse> {
    const question = await this.questionsRepo.findById(questionId);

    if (!question) return left(new ResourceNotFoundError());

    if (question.authorId.toString() !== authorId)
      return left(new NotAllowedError());

    const currentQuestionAttachments =
      await this.questionAttachmentsRepo.findManyByQuestionId(questionId);
    const questionAttachmentList = new QuestionAttachmentList(
      currentQuestionAttachments,
    );

    const questionAttachments = attachmentsIds.map((attachmentId) =>
      QuestionAttachment.create({
        attachmentId: new UniqueEntityID(attachmentId),
        questionId: question.id,
      }),
    );

    questionAttachmentList.update(questionAttachments);

    question.title = title;
    question.content = content;
    question.attachments = questionAttachmentList;

    await this.questionsRepo.save(question);

    return right({ question });
  }
}
