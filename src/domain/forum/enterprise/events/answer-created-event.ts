import { UniqueEntityID } from '@/core/entities';
import { Answer } from '../entities';

export default class AnswerCreatedEvent {
  public ocurredAt: Date;
  public answer: Answer;

  constructor(answer: Answer) {
    this.ocurredAt = new Date();
    this.answer = answer;
  }

  getAggregateId(): UniqueEntityID {
    return this.answer.id;
  }
}
