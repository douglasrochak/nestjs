import { Entity, UniqueEntityID } from '@/core/entities';

export interface AnswerAttachmentProps {
  answerId: UniqueEntityID;
  attachmentId: UniqueEntityID;
}

export default class AnswerAttachment extends Entity<AnswerAttachmentProps> {
  get answerId() {
    return this.props.answerId;
  }

  get attachmentId() {
    return this.props.attachmentId;
  }

  static create(props: AnswerAttachmentProps, id?: UniqueEntityID) {
    return new AnswerAttachment(props, id);
  }
}
