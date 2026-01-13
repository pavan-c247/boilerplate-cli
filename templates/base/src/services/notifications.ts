import type {
  MarkNotificationsReadRequest,
  MarkNotificationsReadResponse,
  NotificationListResponse,
} from "@/types/notifications";
import { api } from "@/utils/api";

const BASE_PATH = "notification";
const ENDPOINTS = {
  NOTIFICATIONS: BASE_PATH,
  MARK_READ: `${BASE_PATH}/read`,
};

export const notificationService = {
  /**
   * Get all notifications list
   * @param page - Page number (0-indexed)
   * @param size - Page size
   * @param sort - Sort field and direction (e.g., "createdAt,DESC")
   */
 getNotifications: async (
  params: { page: number; limit: number }
): Promise<NotificationListResponse> => {
  try {
    const response = await api.get<NotificationListResponse>(
      ENDPOINTS.NOTIFICATIONS,
      {
        params,
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
},


  /**
   * Mark notifications as read
   * @param data - Object containing notificationIds and userId
   */
  markNotificationsRead: async (
    data: MarkNotificationsReadRequest,
  ): Promise<MarkNotificationsReadResponse> => {
    try {
      const response = await api.patch<MarkNotificationsReadResponse>(ENDPOINTS.MARK_READ, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
