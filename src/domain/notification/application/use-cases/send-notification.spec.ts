import { MemoryNotificationsRepo } from 'test/repositories/memory-notifications-repository';
import SendNotificationUseCase from './send-notification';

describe('Send Notification Use Case', () => {
  let notificationRepo: MemoryNotificationsRepo;
  let sut: SendNotificationUseCase;

  beforeEach(() => {
    notificationRepo = new MemoryNotificationsRepo();
    sut = new SendNotificationUseCase(notificationRepo);
  });

  it('Should be able to create a notification', async () => {
    const result = await sut.execute({
      recipientId: 'fake-recipient-id',
      title: 'Notification 1',
      content: 'Notification content',
    });

    expect(result.isRight()).toEqual(true);
    expect(notificationRepo.items[0].id).toEqual(result.value?.notification.id);
  });
});
