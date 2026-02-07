'use client';

import { useState, forwardRef, useCallback, type ReactNode, type HTMLAttributes } from 'react';

import { cn } from '../../../utils';

import { NotificationItem, type NotificationItemData } from './notification-item';

export interface NotificationsPopoverProps extends HTMLAttributes<HTMLDivElement> {
  notifications?: NotificationItemData[];
  onMarkAllRead?: () => void;
  onViewAll?: () => void;
  renderTabs?: ReactNode;
}

export const NotificationsPopover = forwardRef<HTMLDivElement, NotificationsPopoverProps>(
  ({ className, notifications = [], onMarkAllRead, onViewAll, ...props }, ref) => {
    const [open, setOpen] = useState(false);

    const totalUnRead = notifications.filter((n) => n.isUnRead).length;

    const handleToggle = useCallback(() => setOpen((prev) => !prev), []);

    return (
      <div ref={ref} className={cn('relative', className)} {...props}>
        <button
          type="button"
          onClick={handleToggle}
          className={cn(
            'relative flex items-center justify-center w-10 h-10 rounded-full',
            'transition-colors duration-[var(--transition-fast)]',
            open
              ? 'text-[var(--color-primary)]'
              : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)]'
          )}
          aria-label={totalUnRead ? `${totalUnRead} notifications` : 'Notifications'}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          {totalUnRead > 0 && (
            <span className="absolute top-1 right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-[var(--color-error)] rounded-full">
              {totalUnRead > 99 ? '99+' : totalUnRead}
            </span>
          )}
        </button>

        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} aria-hidden="true" />
            <div
              className={cn(
                'fixed inset-y-0 right-0 z-50 w-full max-w-[420px]',
                'bg-[var(--color-background)] shadow-[var(--shadow-lg)]',
                'flex flex-col'
              )}
            >
              <div className="flex items-center justify-between px-5 py-4 min-h-[68px]">
                <h6 className="text-lg font-semibold text-[var(--color-text-primary)]">
                  Notifications
                </h6>
                <div className="flex items-center gap-1">
                  {totalUnRead > 0 && (
                    <button
                      type="button"
                      onClick={onMarkAllRead}
                      className="flex items-center justify-center w-8 h-8 rounded-full text-[var(--color-primary)] hover:bg-[var(--color-surface)] transition-colors"
                      title="Mark all as read"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M18 6L7 17l-5-5" />
                        <path d="M22 10l-7.5 7.5L13 16" />
                      </svg>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-center w-8 h-8 rounded-full text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)] transition-colors sm:hidden"
                    aria-label="Close"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="border-t border-[var(--color-border)]" />

              <div className="flex-1 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <NotificationItem key={notification.id} notification={notification} />
                  ))
                ) : (
                  <div className="flex items-center justify-center py-16 text-sm text-[var(--color-text-muted)]">
                    No notifications
                  </div>
                )}
              </div>

              {onViewAll && (
                <div className="p-2 border-t border-[var(--color-border)]">
                  <button
                    type="button"
                    onClick={() => {
                      onViewAll();
                      setOpen(false);
                    }}
                    className="w-full py-3 text-sm font-medium text-[var(--color-text-primary)] hover:bg-[var(--color-surface)] rounded-[var(--radius-md)] transition-colors"
                  >
                    View All
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    );
  }
);

NotificationsPopover.displayName = 'NotificationsPopover';

export { NotificationItem } from './notification-item';
export type { NotificationItemData, NotificationItemProps } from './notification-item';
