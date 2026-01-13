export interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
  updatedAt: string;
  userId?: string;
  metadata?: Record<string, unknown>;
}

export interface PaginationInfo {
  page: string;
  limit: string;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface NotificationListResponse {
  notifications: Notification[];
  unreadCount: number;
  pagination: PaginationInfo;
  data:{
    notifications: Notification[];
    unreadCount: number;
    pagination: PaginationInfo;
  };
}

export interface MarkNotificationsReadRequest {
  notificationIds: string[];
}

export interface MarkNotificationsReadResponse {
  success: boolean;
  message: string;
  data?: {
    modifiedCount: number;
  };
}

export interface UnreadCountResponse {
  success: boolean;
  data: {
    unreadCount: number;
  };
}

// API Error Types
export interface NotificationApiError {
  message: string;
  code?: string;
  status?: number;
  errors?: Record<string, string[]>;
}
