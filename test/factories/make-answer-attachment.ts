import { UniqueEntityID } from '@/core/entities';
import AnswerAttachment, {
  AnswerAttachmentProps,
} from '@/domain/forum/enterprise/entities/answer-attachment';

export function makeAnswerAttachment(
  override: Partial<AnswerAttachmentProps> = {},
  id?: UniqueEntityID,
) {
  const answerAttachment = AnswerAttachment.create(
    {
      answerId: new UniqueEntityID(),
      attachmentId: new UniqueEntityID(),
      ...override,
    },
    id,
  );

  return answerAttachment;
}
