import { UniqueEntityID } from '@/core/entities';
import { Question } from '../entities';

export default class QuestionBestAnswerChosenEvent {
  public ocurredAt: Date;
  public question: Question;
  public bestAnswerId: UniqueEntityID;

  constructor(question: Question, bestAnswerId: UniqueEntityID) {
    this.ocurredAt = new Date();
    this.question = question;
    this.bestAnswerId = bestAnswerId;
  }

  getAggregateId(): UniqueEntityID {
    return this.question.id;
  }
}
