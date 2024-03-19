import { UniqueEntityID } from '@/core/entities';
import { Either, right } from '@/core/either';
import { NotificationsRepository } from '../repositories/notifications-repository';
import { Notification } from '../../enterprise/entities';

export interface SendNotificationUseCaseRequest {
  recipientId: string;
  title: string;
  content: string;
}

export type SendNotificationUseCaseResponse = Either<
  null,
  {
    notification: Notification;
  }
>;

export default class SendNotificationUseCase {
  constructor(private repo: NotificationsRepository) {}

  async execute({
    recipientId,
    title,
    content,
  }: SendNotificationUseCaseRequest): Promise<SendNotificationUseCaseResponse> {
    const notification = Notification.create({
      recipientId: new UniqueEntityID(recipientId),
      title,
      content,
    });

    await this.repo.create(notification);

    return right({ notification });
  }
}
