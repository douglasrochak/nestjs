import { Optional } from '@/core/types';
import { Slug } from './shared';
import { UniqueEntityID } from '@/core/entities';
import dayjs from 'dayjs';
import AggregateRoot from '@/core/entities/aggregate-root';
import { QuestionAttachmentList } from './question-attachment-list';
import { QuestionBestAnswerChosenEvent } from '../events';

export interface QuestionProps {
  title: string;
  slug: Slug;
  content: string;
  authorId: UniqueEntityID;
  bestAnswerId?: UniqueEntityID;
  attachments: QuestionAttachmentList;
  createdAt: Date;
  updatedAt?: Date;
}

export default class Question extends AggregateRoot<QuestionProps> {
  static create(
    props: Optional<QuestionProps, 'createdAt' | 'slug' | 'attachments'>,
    id?: UniqueEntityID,
  ) {
    const question = new Question(
      {
        ...props,
        slug: props.slug ?? Slug.createFromText(props.title),
        attachments: props.attachments ?? new QuestionAttachmentList(),
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    return question;
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  set title(title: string) {
    this.props.title = title;
    this.props.slug = Slug.createFromText(title);
    this.touch();
  }

  set content(content: string) {
    this.props.content = content;
    this.touch();
  }

  set attachments(attachments: QuestionAttachmentList) {
    this.props.attachments = attachments;
    this.touch();
  }

  set bestAnswerId(bestAnswerId: UniqueEntityID | undefined) {
    if (bestAnswerId && bestAnswerId !== this.props.bestAnswerId) {
      this.addDomainEvent(
        new QuestionBestAnswerChosenEvent(this, bestAnswerId),
      );
    }

    this.props.bestAnswerId = bestAnswerId;

    this.touch();
  }

  get isNew() {
    return dayjs().diff(this.createdAt, 'days') <= 3;
  }

  get title() {
    return this.props.title;
  }

  get slug() {
    return this.props.slug;
  }

  get content() {
    return this.props.content;
  }

  get authorId() {
    return this.props.authorId;
  }

  get bestAnswerId() {
    return this.props.bestAnswerId;
  }

  get attachments() {
    return this.props.attachments;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }
}
