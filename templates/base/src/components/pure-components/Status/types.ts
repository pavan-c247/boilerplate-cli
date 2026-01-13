export type StatusVariant =
  | "active"
  | "inactive"
  | "published"
  | "draft"
  | "archived"
  | "scheduled"
  | "pending"
  | "success"
  | "error"
  | "warning"
  | "info";

export interface StatusProps {
  variant: StatusVariant;
  label?: string;
  showIcon?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

