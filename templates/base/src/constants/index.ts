// Common constants
export const API_ENDPOINTS = {
  USERS: "/api/users",
  TAGS: "/api/tags",
  ASSETS: "/api/assets",
};

// User role constants
export const USER_ROLES = {
  ADMIN: 1,
  USER: 2,
} as const;

// User role mapper for string representation
export const USER_ROLE_MAP = {
  [USER_ROLES.ADMIN]: "Admin",
  [USER_ROLES.USER]: "User",
} as const;

// Helper to get role string from role ID
export const getRoleName = (roleId: number): string => {
  return USER_ROLE_MAP[roleId as keyof typeof USER_ROLE_MAP] || "Unknown";
};

// Button variant constants
export const BUTTON_VARIANTS = {
  PRIMARY: "primary",
  SECONDARY: "secondary",
  TERTIARY: "tertiary",
  ICON: "icon",
  ICON_BORDERED: "iconBordered",
  DANGER: "danger",
  OUTLINE_DANGER: "outline-danger",
  OUTLINE_SECONDARY: "outline-secondary",
  LINK: "link",
  INLINE_ICON: "inlineIcon",
  SUCCESS: "success",
} as const;

// Button type constants
export const BUTTON_TYPES = {
  BUTTON: "button",
  SUBMIT: "submit",
  RESET: "reset",
} as const;

// Status constants
export const STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  PENDING: "pending",
  COMPLETED: "completed",
};

// Tag colors for visual representation
export const TAG_COLORS = [
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#96CEB4",
  "#FFEAA7",
  "#DDA0DD",
  "#98D8C8",
];

// Data types for dynamic forms and filters
export const AVAILABLE_DATA_TYPES = {
  STRING: "STRING",
  NUMERIC: "NUMERIC",
  BOOLEAN: "BOOLEAN",
  DATE: "DATE",
  DATETIME: "DATETIME",
  ENUM: "ENUM",
  ARRAY: "ARRAY",
  OBJECT: "OBJECT",
} as const;

// Filter operators for query building
export const FILTER_OPERATORS = {
  EQUALS: "equals",
  NOT_EQUALS: "notEquals",
  GREATER_THAN: "gt",
  GREATER_THAN_OR_EQUALS: "gte",
  LESS_THAN: "lt",
  LESS_THAN_OR_EQUALS: "lte",
  CONTAINS: "contains",
  NOT_CONTAINS: "notContains",
  STARTS_WITH: "startsWith",
  ENDS_WITH: "endsWith",
  IN: "in",
  NOT_IN: "notIn",
  IS_NULL: "isNull",
  IS_NOT_NULL: "isNotNull",
  BETWEEN: "between",
} as const;

// Template types for content management
export const TEMPLATE_TYPES = [
  "PAGE",
  "POST",
  "COMPONENT",
  "LAYOUT",
  "PARTIAL",
  "EMAIL",
  "SMS",
] as const;

// Default pagination settings
export const DEFAULT_PAGE_SIZE_FOR_FILTER_OPTIONS = 20;
export const TOP_LEVEL_ICON_SIZE = 16;
export const CHILD_ICON_SIZE = 16;

export default {
  API_ENDPOINTS,
  STATUS,
  TAG_COLORS,
  AVAILABLE_DATA_TYPES,
  FILTER_OPERATORS,
  TEMPLATE_TYPES,
  DEFAULT_PAGE_SIZE_FOR_FILTER_OPTIONS,
  TOP_LEVEL_ICON_SIZE,
  CHILD_ICON_SIZE,
  BUTTON_VARIANTS,
  BUTTON_TYPES,
};

// constants/timezones.ts
export const TIMEZONE_OPTIONS = [
  { label: "Eastern Time (US & Canada)", value: "America/New_York" },
  { label: "Central Time (US & Canada)", value: "America/Chicago" },
  { label: "Mountain Time (US & Canada)", value: "America/Denver" },
  { label: "Pacific Time (US & Canada)", value: "America/Los_Angeles" },
  { label: "Alaska Time (US)", value: "America/Anchorage" },
  { label: "Hawaii Time (US)", value: "Pacific/Honolulu" },
  { label: "Arizona Time (no DST)", value: "America/Phoenix" },
  { label: "Newfoundland Time (Canada)", value: "America/St_Johns" },
  { label: "Atlantic Time (Canada)", value: "America/Halifax" },
  { label: "Eastern Time (Canada)", value: "America/Toronto" },
  { label: "Central Time (Canada)", value: "America/Winnipeg" },
  { label: "Mountain Time (Canada)", value: "America/Edmonton" },
  { label: "Pacific Time (Canada)", value: "America/Vancouver" },
];

export const DATE_FORMATS = {
  DEFAULT_DATE_FORMAT: "MMM DD, YYYY",
  DEFAULT_DB_FORMAT: "YYYY-MM-DD",
  DATE_SLASH_FORMAT: "YYYY/MM/DD",
  FULL_DATETIME: "MMM DD, YYYY hh:mm A",
  FULL_DATETIME_WITH_DASH: "MMM DD, YYYY - hh:mm A",
  FULL_DATETIME_WITH_SECONDS: "MMM DD, YYYY hh:mm:ss A",
  FULL_DATETIME_24H: "MMM DD, YYYY HH:mm",
};

export const FIXED_COLUMN_POSITION = {
  LEFT: "left",
  RIGHT: "right",
} as const;

export const THEME_COLORS = {
  PRIMARY: "primary",
  SECONDARY: "secondary",
  SUCCESS: "success",
  INFO: "info",
  WARNING: "warning",
  DANGER: "danger",
  LIGHT: "light",
  DARK: "dark",
} as const;

export const DATA_TYPES = {
  STRING: "string",
  NUMBER: "number",
  BOOLEAN: "boolean",
  OBJECT: "object",
  ARRAY: "array",
  DATE: "date",
  NULL: "null",
  UNDEFINED: "undefined",
  TEXT: "text",
} as const;
export const DEFAULT_PAGINATION = {
  page: 1,
  limit: 10,
};

export const DEFAULT_FILTER_LENGTH = 3;
export const MULTI_SELECT_MAX_VISIBLE_LABELS = 2;
export const DEBOUNCE_DELAY = 500;

export const FILTER_MODE = {
  RANGE: "range",
  SINGLE: "single",
  MULTIPLE: "multiple",
  ALL: "All",
  DATE: "date",
  SELECT: "select",
} as const;

export const QUERY_KEYS = {
  SEARCH: "search",
  PAGE: "page",
  LIMIT: "limit",
} as const;

export const SORT_ORDER = {
  ASC: "asc",
  DESC: "desc",
} as const;

export type SortOrder = (typeof SORT_ORDER)[keyof typeof SORT_ORDER];

export enum FILTER_ENTITY {
  USER = "user",
}

export const DEFAULT_CARD_IMAGE = "/artical-frame.png";

export const VARIANT = {
  ACTIVE: "active",
  INACTIVE: "inactive",
} as const;

export const ENVIRONMENTS = {
  DEVELOPMENT: "development",
};
