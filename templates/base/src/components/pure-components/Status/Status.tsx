import classnames from "classnames";
import {
  AlertCircle,
  Archive,
  CheckCircle2,
  Clock,
  FileText,
  Info,
  XCircle,
} from "lucide-react";
import React from "react";

import styles from "./styles.module.scss";
import { StatusProps } from "./types";

const Status: React.FC<StatusProps> = ({
  variant,
  label,
  showIcon = true,
  size = "md",
  className,
}) => {
  // Get icon based on variant
  const getIcon = () => {
    const iconSize = size === "sm" ? 14 : size === "lg" ? 18 : 16;

    switch (variant) {
      case "active":
      case "published":
      case "success":
        return <CheckCircle2 size={iconSize} />;
      case "inactive":
      case "error":
        return <XCircle size={iconSize} />;
      case "pending":
      case "scheduled":
        return <Clock size={iconSize} />;
      case "warning":
        return <AlertCircle size={iconSize} />;
      case "info":
        return <Info size={iconSize} />;
      case "archived":
        return <Archive size={iconSize} />;
      case "draft":
        return <FileText size={iconSize} />;
      default:
        return <CheckCircle2 size={iconSize} />;
    }
  };

  // Get default label if not provided
  const getLabel = () => {
    if (label) return label;

    switch (variant) {
      case "active":
        return "Active";
      case "inactive":
        return "Inactive";
      case "published":
        return "Published";
      case "draft":
        return "Draft";
      case "archived":
        return "Archived";
      case "scheduled":
        return "Scheduled";
      case "pending":
        return "Pending";
      case "success":
        return "Success";
      case "error":
        return "Error";
      case "warning":
        return "Warning";
      case "info":
        return "Info";
      default:
        return variant;
    }
  };

  return (
    <span
      className={classnames(
        styles.status,
        styles[variant],
        styles[size],
        className
      )}
    >
      {showIcon && <span className={styles.statusIcon}>{getIcon()}</span>}
      <span className={styles.statusLabel}>{getLabel()}</span>
    </span>
  );
};

export default Status;

