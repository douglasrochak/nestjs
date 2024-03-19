import { NotificationsRepository } from '@/domain/notification/application/repositories/notifications-repository';
import { Notification } from '@/domain/notification/enterprise/entities';

export class MemoryNotificationsRepo implements NotificationsRepository {
  public items: Notification[] = [];

  async findById(id: string): Promise<Notification | null> {
    const notification = this.items.find((item) => item.id.toString() === id);
    if (!notification) return null;
    return notification;
  }

  async save(notification: Notification): Promise<void> {
    const notificationIndex = this.items.findIndex(
      (item) => item.id === notification.id,
    );

    this.items[notificationIndex] = notification;
  }

  async create(notification: Notification) {
    this.items.push(notification);
  }
}
