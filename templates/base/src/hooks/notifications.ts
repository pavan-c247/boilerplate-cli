import { useMutation, UseMutationResult, useQuery, useQueryClient } from "@tanstack/react-query";

import { notificationService } from "@/services/notifications";
import type {
  MarkNotificationsReadRequest,
  MarkNotificationsReadResponse,
  NotificationListResponse,
} from "@/types/notifications";

import { useInfiniteListQuery } from "./useInfiniteListQuery";

const NOTIFICATION_QUERY_KEYS = {
  NOTIFICATIONS: "notification",
} as const;

/**
 * Paginated query for notifications
 * @deprecated Use useNotificationsInfiniteQuery for infinite scrolling instead
 */
export const useNotificationsQuery = (
  params: {
    page: number;
    limit: number;
  },
  options?: { enabled?: boolean },
) =>
  useQuery<NotificationListResponse, Error>({
    queryKey: [NOTIFICATION_QUERY_KEYS.NOTIFICATIONS, params],
    queryFn: () => notificationService.getNotifications(params),
    refetchOnWindowFocus: false,
    enabled: options?.enabled !== false && !!params,
  });

/**
 * Infinite query for notifications with automatic pagination handling
 * @param limit - Number of items per page
 * @param options - Query options (enabled flag)
 * @returns InfiniteQueryResult with notifications data and pagination methods
 */
export const useNotificationsInfiniteQuery = (
  limit: number,
  options?: { enabled?: boolean },
) =>
  useInfiniteListQuery<NotificationListResponse>({
    queryKey: [NOTIFICATION_QUERY_KEYS.NOTIFICATIONS],
    queryFn: ({ page }) => notificationService.getNotifications({ page, limit }),
    getNextPageParam: (lastPage) => {
      // Handle both nested data structure and root level for backwards compatibility
      const pagination = lastPage.data?.pagination ?? lastPage.pagination;
      return pagination?.hasNextPage && pagination.page !== undefined
      ? parseInt(pagination.page, 10) + 1
      : undefined;
    },
    enabled: options?.enabled,
  });

/**
 * Api for to get he mark notifications as read
 * @returns
 */
export const useMarkNotificationsRead = (): UseMutationResult<
  MarkNotificationsReadResponse,
  Error,
  MarkNotificationsReadRequest
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: MarkNotificationsReadRequest) =>
      notificationService.markNotificationsRead(data),

    onSuccess: () => {
      // Invalidate and refetch notifications to update read status
      queryClient.invalidateQueries({
        queryKey: [NOTIFICATION_QUERY_KEYS.NOTIFICATIONS],
      });
    },
    onError: (error) => {
      console.error("Failed to mark notifications as read:", error);
    },
  });
};

