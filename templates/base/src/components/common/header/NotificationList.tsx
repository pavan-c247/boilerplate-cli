"use client";

import type { Notification } from "@/types/notifications";
import { formatDate } from "@/utils/formatDate";

import styles from "./styles.module.scss";

interface NotificationListProps {
  allNotifications: Notification[];
  readNotificationIds: Set<string>;
  handleNotificationClick: (notification: Notification) => void;
  isLoading: boolean;
  error: unknown;
  isFetching: boolean;
  hasMore: boolean;
  loadMoreRef: React.RefObject<HTMLDivElement>;
  tCommon: (key: string) => string;
}

const NotificationList: React.FC<NotificationListProps> = ({
  allNotifications,
  readNotificationIds,
  handleNotificationClick,
  isLoading,
  error,
  isFetching,
  hasMore,
  loadMoreRef,
  tCommon,
}) => {
  // Early return for loading state
  if (isLoading && allNotifications.length === 0) {
    return (
      <div className={styles.notificationLoading}>
        {tCommon("loading.default")}
      </div>
    );
  }

  // Early return for error state
  if (error) {
    return (
      <div className={styles.notificationError}>
        {tCommon("notification.failedNotification")}
      </div>
    );
  }

  // Early return for empty state
  if (allNotifications.length === 0) {
    return (
      <div className={styles.notificationEmpty}>
        {tCommon("notification.noNewNotifications")}
      </div>
    );
  }

  return (
    <>
      <div className={styles.notificationItems}>
        {allNotifications.map((notification) => {
          const isRead =
            notification.read || readNotificationIds.has(notification.id);
          return (
            <div
              key={notification.id}
              className={`${styles.notificationItem} ${
                isRead ? styles.read : styles.unread
              }`}
              onClick={() => handleNotificationClick(notification)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleNotificationClick(notification);
                }
              }}
            >
              <div className={styles.notificationContent}>
                <div className={styles.notificationMessage}>
                  {notification.message}
                </div>
                <div className={styles.notificationTime}>
                  {formatDate(notification.createdAt, "YYYY-MM-DD HH:mm")}
                </div>
              </div>
              {!isRead && <span className={styles.unreadDot} />}
            </div>
          );
        })}
      </div>

      {/* Infinite scroll loading indicator */}
      <div ref={loadMoreRef} className={styles.loadMoreContainer}>
        {isFetching && allNotifications.length > 0 && (
          <div className={styles.loadingSpinner}>
            <span
              className="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
            />
            <span className="ms-2">{tCommon("notification.loadingMore")}</span>
          </div>
        )}
        {!hasMore && allNotifications.length > 0 && (
          <div className={styles.endOfResults}>{tCommon("notification.noMoreNotifications")}</div>
        )}
      </div>
    </>
  );
};

export default NotificationList;

