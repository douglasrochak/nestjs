import { Entity, UniqueEntityID } from '@/core/entities';

interface AttachmentProps {
  title: string;
  link: string;
}

export default class Attachment extends Entity<AttachmentProps> {
  get title() {
    return this.props.title;
  }

  get link() {
    return this.props.link;
  }

  static create(props: AttachmentProps, id?: UniqueEntityID) {
    const attachment = new Attachment(props, id);

    return attachment;
  }
}
