import { Either, left, right } from '@/core/either';
import { NotificationsRepository } from '../repositories/notifications-repository';
import { Notification } from '../../enterprise/entities';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found';
import { NotAllowedError } from '@/core/errors/errors/not-allowed';

interface ReadNotificationUseCaseRequest {
  recipientId: string;
  notificationId: string;
}

type ReadNotificationUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    notification: Notification;
  }
>;

export default class ReadNotificationUseCase {
  constructor(private repo: NotificationsRepository) {}

  async execute({
    notificationId,
    recipientId,
  }: ReadNotificationUseCaseRequest): Promise<ReadNotificationUseCaseResponse> {
    const notification = await this.repo.findById(notificationId);

    if (!notification) return left(new ResourceNotFoundError());

    if (recipientId !== notification.recipientId.toString())
      return left(new NotAllowedError());

    notification.read();

    await this.repo.save(notification);

    return right({ notification });
  }
}
