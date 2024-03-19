import { MemoryNotificationsRepo } from 'test/repositories/memory-notifications-repository';
import ReadNotificationUseCase from './read-notification';
import { makeNotification } from 'test/factories/make-notification';
import { UniqueEntityID } from '@/core/entities';
import { NotAllowedError } from '@/core/errors/errors/not-allowed';

describe('Read Notification Use Case', () => {
  let notificationsRepo: MemoryNotificationsRepo;
  let sut: ReadNotificationUseCase;

  beforeEach(() => {
    notificationsRepo = new MemoryNotificationsRepo();
    sut = new ReadNotificationUseCase(notificationsRepo);
  });

  it('Should be able to read a notification', async () => {
    const notification = makeNotification({});

    await notificationsRepo.create(notification);

    const result = await sut.execute({
      recipientId: notification.recipientId.toString(),
      notificationId: notification.id.toString(),
    });

    expect(result.isRight()).toEqual(true);
    expect(notificationsRepo.items[0].readAt).toEqual(expect.any(Date));
  });

  it('Should not be able to read a notification from another user', async () => {
    const notification = makeNotification({
      recipientId: new UniqueEntityID('user-1'),
    });

    await notificationsRepo.create(notification);

    const result = await sut.execute({
      recipientId: 'user-2',
      notificationId: notification.id.toString(),
    });

    expect(result.isLeft()).toEqual(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
    expect(notificationsRepo.items[0].readAt).toBeUndefined();
  });
});
