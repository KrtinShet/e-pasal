import { forwardRef, type HTMLAttributes } from 'react';

import { cn } from '../../../utils';

export interface NotificationItemData {
  id: string;
  title: string;
  description?: string;
  avatarUrl?: string;
  type?: string;
  createdAt: Date | string;
  isUnRead?: boolean;
}

export interface NotificationItemProps extends HTMLAttributes<HTMLDivElement> {
  notification: NotificationItemData;
}

export const NotificationItem = forwardRef<HTMLDivElement, NotificationItemProps>(
  ({ className, notification, ...props }, ref) => {
    const timeAgo = getTimeAgo(
      typeof notification.createdAt === 'string'
        ? new Date(notification.createdAt)
        : notification.createdAt
    );

    return (
      <div
        ref={ref}
        className={cn(
          'flex gap-3 px-5 py-3 cursor-pointer transition-colors',
          'hover:bg-[var(--color-surface)]',
          notification.isUnRead && 'bg-[color-mix(in_srgb,var(--color-primary)_4%,transparent)]',
          className
        )}
        {...props}
      >
        {notification.avatarUrl && (
          <img
            src={notification.avatarUrl}
            alt=""
            className="w-10 h-10 rounded-full object-cover shrink-0"
          />
        )}

        <div className="flex-1 min-w-0">
          <p className="text-sm text-[var(--color-text-primary)]">
            <span className="font-semibold">{notification.title}</span>
            {notification.description && (
              <span className="text-[var(--color-text-secondary)]">
                {' '}
                {notification.description}
              </span>
            )}
          </p>
          <p className="mt-1 text-xs text-[var(--color-text-muted)]">{timeAgo}</p>
        </div>

        {notification.isUnRead && (
          <span className="mt-1 w-2 h-2 rounded-full bg-[var(--color-info)] shrink-0" />
        )}
      </div>
    );
  }
);

NotificationItem.displayName = 'NotificationItem';

function getTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
