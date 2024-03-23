import { Attachment as PrismaAttachment } from '@prisma/client';

import { UniqueEntityID } from '@/core/entities';
import { QuestionAttachment } from '@/domain/forum/enterprise/entities';

export class PrismaQuestionAttachmentMapper {
  static toDomain(raw: PrismaAttachment): QuestionAttachment {
    if (!raw.questionId) throw new Error('Invalid attachment type');
    return QuestionAttachment.create(
      {
        attachmentId: new UniqueEntityID(raw.id),
        questionId: new UniqueEntityID(raw.questionId),
      },
      new UniqueEntityID(raw.id),
    );
  }
}
