import { UITableColumn } from "./ui";

export interface TableProps<T extends object> {
  columns: UITableColumn<T>[];
  dataSource: readonly T[];
  rowKey: keyof T;
  className?: string;
  bordered?: boolean;
  striped?: boolean;
  hover?: boolean;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  size?: "sm" | "lg";
  variant?: string;
  // CONTROL FLAGS
  enableSearch?: boolean; // default true
  enableFilter?: boolean; // default true
  enableSetting?: boolean;
  enableColumnReorder?: boolean;
  searchPlaceholder?: string;
  // FILTER CONFIG
  filtersConfig?: FilterConfig<T>[];
  pagination?: {
    currentPage: number;
    pageSize: number;
    total: number;
    onChange: (page: number) => void;
    onPageSizeChange?: (size: number) => void;
  };
  loading?: boolean;
  onSort?: (key: string) => void;
  onFilterChange?: (filters: Record<string, string[]>) => void;
  stickyHeader?: boolean;
  accordion?: AccordionNode<T>;
  rowActions?: TableRowInteraction<T>;
  fixed?: "none" | "left" | "right";
  width?: string | number;
  expandable?: {
    rowExpandable: (record: any) => boolean;
  };
  accordian?: string | object;
  cardListing?: object;
  showActions?: boolean;
  cardColumns?: number;
  cardImage?: boolean;
}

// types/CommonProjectCard.types.ts
export interface CommonCardProps<T extends { id: string | number }> {
  items: T;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  showActions?: boolean;
  accordion?: AccordionNode<T>;
}
export interface UserAccordionRecord {
  id: string | number | undefined; // ✅ REQUIRED
  name: string;
  email: string;
  status?: number;
  createdAt?: string;
  updatedAt?: string;
  children?: UserAccordionRecord[];
}

export interface PaginationConfig {
  currentPage: number;
  pageSize: number;
  total: number;
  onChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
}

export interface FilterConfig<T extends object> {
  key: keyof T;
  label: string;
  options: Array<{
    label: string;
    value: T[keyof T];
  }>;
}

export interface AccordionNode<T extends object> {
  rowKey: keyof T;
  columns?: UITableColumn<T>[];
  shouldRender?: (record: T) => boolean;
  renderContent?: (record: T) => React.ReactNode;
  children?: AccordionNode<T>;
}

export interface UserProfileCardProps {
  user: {
    name?: string;
    email?: string;
    status?: number;
  };
}

export type FieldType = "text" | "badge";
export type Key = string | number;

export interface UserField {
  labelKey: string;
  value: React.ReactNode;
  type?: FieldType;
}

export interface UserColumn {
  fields: UserField[];
  width?: number | string; // e.g. 120 | "120px" | "15%"
}

export interface SortableHeaderCellProps<T extends object>{
  column: UITableColumn<T>;
  index: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  onSort?: (key: string) => void;
  stickyProps?: any;
  children?: React.ReactNode;
  enableColumnReorder?: boolean;
}
export type TableRowInteraction<T> = {
  /** Called when row is clicked */
  onRowClick?: (record: T) => void;
};


export type BasicRow = {
  id: string | number; // Ensure `id` is mandatory
  name: string; // Ensure name is always a string
  age?: number;
  address?: string;
  status?: number;
  createdAt?: string;
  updatedAt?: string;
  email: string; // Make `email` mandatory
  accordion?: AccordionNode<UserAccordionRecord>;
};
