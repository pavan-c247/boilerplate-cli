import { FieldType } from "@/types/forms/dynamicForm";

export const MAX_SIZE = 10;

export const PLACEHOLDER_SUPPORTED_FIELDS = [
  FieldType.TEXT,
  FieldType.TEXTAREA,
  FieldType.EMAIL,
  FieldType.URL,
  FieldType.TEL,
  FieldType.PASSWORD,
  FieldType.SEARCH,
  FieldType.NUMBER,
  FieldType.SELECT,
  FieldType.MULTISELECT,
  FieldType.EDITOR,
];

// Grid size options for field layout
export const GRID_SIZE_OPTIONS = [
  { value: 12, label: "Full Width (12 columns)" },
  { value: 6, label: "Half Width (6 columns)" },
  { value: 4, label: "Third Width (4 columns)" },
  { value: 3, label: "Quarter Width (3 columns)" },
] as const;

export const DEFAULT_GRID_SIZE = 12;
