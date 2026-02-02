import { Notification, INotification, NotificationType } from './notification.model.js';
import { NotFoundError } from '../../lib/errors.js';

interface CreateNotificationInput {
  type: NotificationType;
  title: string;
  message: string;
  metadata?: Record<string, any>;
}

interface NotificationQuery {
  storeId: string;
  read?: boolean;
  page?: number;
  limit?: number;
}

export class NotificationService {
  async create(storeId: string, input: CreateNotificationInput) {
    const notification = await Notification.create({
      storeId,
      type: input.type,
      title: input.title,
      message: input.message,
      metadata: input.metadata,
    });

    return notification;
  }

  async list(query: NotificationQuery) {
    const { storeId, read, page = 1, limit = 20 } = query;

    const filter: any = { storeId };

    if (typeof read === 'boolean') {
      filter.read = read;
    }

    const [notifications, total] = await Promise.all([
      Notification.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Notification.countDocuments(filter),
    ]);

    return {
      notifications,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async markAsRead(storeId: string, id: string) {
    const notification = await Notification.findOneAndUpdate(
      { _id: id, storeId },
      { read: true },
      { new: true }
    );

    if (!notification) {
      throw new NotFoundError('Notification');
    }

    return notification;
  }

  async markAllAsRead(storeId: string) {
    const result = await Notification.updateMany(
      { storeId, read: false },
      { read: true }
    );

    return { modifiedCount: result.modifiedCount };
  }

  async getUnreadCount(storeId: string) {
    const count = await Notification.countDocuments({ storeId, read: false });
    return { count };
  }
}

export const notificationService = new NotificationService();
