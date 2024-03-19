import { DomainEvents } from '@/core/events';
import { EventHandler } from '@/core/events/event-handler';
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository';
import { QuestionBestAnswerChosenEvent } from '@/domain/forum/enterprise/events';
import { SendNotificationUseCase } from '@/domain/notification/application/use-cases';

export default class OnQuestionBestAnswerChosen implements EventHandler {
  constructor(
    private answersRepository: AnswersRepository,
    private sendNotification: SendNotificationUseCase,
  ) {
    this.setupSubscriptions();
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendQuestionBestAnswerNotification.bind(this) as (
        event: unknown,
      ) => Promise<void>,
      QuestionBestAnswerChosenEvent.name,
    );
  }

  private async sendQuestionBestAnswerNotification({
    question,
    bestAnswerId,
  }: QuestionBestAnswerChosenEvent) {
    const answer = await this.answersRepository.findById(
      bestAnswerId.toString(),
    );

    if (answer) {
      await this.sendNotification.execute({
        recipientId: answer.authorId.toString(),
        title: 'Sua resposta foi escolhida!',
        content: `A resposta que você enviou em "${question.title
          .substring(0, 20)
          .concat('...')}" foi escolhida pelo autor.`,
      });
    }
  }
}
