import type React from "react";
import type { SubmitHandler as RHFSubmitHandler } from "react-hook-form";
import type { z } from "zod";

export type FieldValues = Record<string, any>;
export type SubmitHandler<T extends FieldValues = FieldValues> =
  RHFSubmitHandler<T>;

export interface SelectOption {
  label: string;
  value: string;
  checked?: boolean;
}

export interface AddOptionsManagerProps {
  options: Array<SelectOption>;
  onChange: (options: Array<SelectOption>) => void;
}

export interface OptionsFormData {
  options: Array<SelectOption>;
}

export enum FieldType {
  TEXT = "text",
  TEXTAREA = "textarea",
  PASSWORD = "password",
  SEARCH = "search",
  SELECT = "select",
  MULTISELECT = "multiselect",
  CHECKBOX = "checkbox",
  FILE = "file",
  DATE = "date",
  EDITOR = "editor",
  EMAIL = "email",
  URL = "url",
  TEL = "tel",
  NUMBER = "number",
  DATETIME = "datetime",
  TIME = "time",
  MULTIFILE = "multifile",
  COLOR = "color",
  RANGE = "range",
  RADIO = "radio",
}

export type GridSize = 12 | 6 | 4 | 3;

export interface BaseFieldConfig {
  id: string;
  name: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  helpText?: string;
  validation?: FieldValidation;
  className?: string;
  gridSize?: GridSize;
}

export interface FieldValidation {
  required?: boolean;
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  email?: boolean;
  url?: boolean;
  custom?: (value: any) => boolean | string;
}

export interface TextFieldConfig extends BaseFieldConfig {
  type:
    | FieldType.TEXT
    | FieldType.EMAIL
    | FieldType.URL
    | FieldType.TEL
    | FieldType.COLOR;
}

export interface TextAreaFieldConfig extends BaseFieldConfig {
  type: FieldType.TEXTAREA;
  rows?: number;
}

export interface PasswordFieldConfig extends BaseFieldConfig {
  type: FieldType.PASSWORD;
}

export interface SearchFieldConfig extends BaseFieldConfig {
  type: FieldType.SEARCH;
}

export interface SelectFieldConfig extends BaseFieldConfig {
  type: FieldType.SELECT;
  options: Array<{ label: string; value: string }>;
  optionGroups?: Array<{
    label: string;
    options: Array<{ label: string; value: string }>;
  }>;
}

export interface MultiSelectFieldConfig extends BaseFieldConfig {
  type: FieldType.MULTISELECT;
  options: Array<{ label: string; value: string }>;
  optionGroups?: Array<{
    label: string;
    options: Array<{ label: string; value: string }>;
  }>;
}

export interface CheckboxFieldConfig extends BaseFieldConfig {
  type: FieldType.CHECKBOX;
  checked?: boolean;
  inline?: boolean;
  options: SelectOption[];
}

export interface RadioFieldConfig extends BaseFieldConfig {
  type: FieldType.RADIO;
  options: Array<{ label: string; value: string }>;
}

export interface FileFieldConfig extends BaseFieldConfig {
  type: FieldType.FILE | FieldType.MULTIFILE;
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
}

export interface DateFieldConfig extends BaseFieldConfig {
  type: FieldType.DATE | FieldType.DATETIME | FieldType.TIME;
  min?: string;
  max?: string;
  minDate?: string;
  maxDate?: string;
  step?: number;
}

export interface EditorFieldConfig extends BaseFieldConfig {
  type: FieldType.EDITOR;
  minHeight?: number;
  readOnly?: boolean;
}

export interface NumberFieldConfig extends BaseFieldConfig {
  type: FieldType.NUMBER;
  min?: number;
  max?: number;
  step?: number;
}

export interface RangeFieldConfig extends BaseFieldConfig {
  type: FieldType.RANGE;
  min?: number;
  max?: number;
  step?: number;
}

export type DynamicFieldConfig =
  | TextFieldConfig
  | TextAreaFieldConfig
  | PasswordFieldConfig
  | SearchFieldConfig
  | SelectFieldConfig
  | MultiSelectFieldConfig
  | CheckboxFieldConfig
  | FileFieldConfig
  | DateFieldConfig
  | EditorFieldConfig
  | NumberFieldConfig
  | RangeFieldConfig
  | RadioFieldConfig;

export interface DynamicFormConfig {
  fields: DynamicFieldConfig[];
  title?: string;
  description?: string;
  submitButtonText?: string;
  resetButtonText?: string;
  showResetButton?: boolean;
}

export interface FieldTypeMetadata {
  type: FieldType;
  label: string;
  description?: string;
  category: "input" | "selection" | "file" | "rich" | "other" | "editor";
  defaultConfig: Partial<DynamicFieldConfig>;
}

export interface DynamicFormBuilderProps {
  initialConfig?: DynamicFormConfig;
  onSave?: (config: DynamicFormConfig) => void;
  formId?: string;
}

export interface DynamicFormRendererProps {
  config: DynamicFormConfig;
  onSubmit: (data: Record<string, any>) => void | Promise<void>;
  zodSchema?: z.ZodSchema<any>;
  defaultValues?: Record<string, any>;
  className?: string;
  formOptions?: Omit<
    import("react-hook-form").UseFormProps<Record<string, any>>,
    "defaultValues" | "resolver"
  >;
}

export interface FieldLabelProps {
  label: string;
  required?: boolean;
  htmlFor?: string;
}

export interface HelpTextProps {
  helpText?: string;
  text?: string; // For backward compatibility
}

export interface ErrorFeedbackProps {
  error?: string;
}

export interface FieldWrapperProps {
  children: React.ReactNode;
  fieldId?: string;
  field?: DynamicFieldConfig;
  required?: boolean;
  helpText?: string;
  error?: any;
  showLabel?: boolean;
}

export interface FieldEditorProps {
  field: DynamicFieldConfig;
  index: number;
  isEditing: boolean;
  onEdit: () => void;
  onUpdate: (updates: Partial<DynamicFieldConfig>) => void;
  onRemove: () => void;
  onDuplicate?: () => void;
}

export interface ViewCodeModalProps {
  show: boolean;
  onClose: () => void;
  formId?: string;
}

export interface DynamicFormField {
  key: string;
  label: string;
  type: string;
  enabled: boolean;
  required: boolean;
  placeholder?: string;
  helpText?: string;
  options?: Array<{ label: string; value: string }>;
  optionGroups?: Array<{
    label: string;
    options: Array<{ label: string; value: string }>;
  }>;
  accept?: string;
  maxSize?: number;
  multiple?: boolean;
  min?: number;
  max?: number;
  step?: number;
  rows?: number;
  minDate?: string;
  maxDate?: string;
  checked?: boolean;
  inline?: boolean;
  minHeight?: number;
  readOnly?: boolean;
  validation?: FieldValidation;
}

export interface DynamicFormRequest {
  title: string;
  config: DynamicFormField[];
}

export interface DynamicFormResponseData extends Record<string, unknown> {
  id: string;
  title: string;
  config: DynamicFormField[];
  createdAt?: string;
  updatedAt?: string;
  isActive?: boolean;
  [key: string]: unknown; // Added index signature
}

export interface DynamicFormResponse {
  success: boolean;
  message: string;
  data: DynamicFormResponseData;
}

export interface DynamicFormListResponse {
  success: boolean;
  message: string;
  data: {
    list: Array<DynamicFormResponseData>;
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

export interface DynamicFormBuilderFormValues {
  title: string;
}

export interface FieldSettingProps {
  field: any;
  t: (key: string, params?: any) => string;
  onUpdate: (data: any) => void;
}

export interface FieldPreviewProps {
  field: any;
  metadata: any;
  t: (key: string) => string;
  onClick: () => void;
}

export interface FormPreviewModalProps {
  config: DynamicFormConfig;
  onClose: () => void;
}

export interface FormHeaderProps {
  title: string;
  config: DynamicFormConfig;
  formId?: string;
  onViewCode: () => void;
  onPreview: () => void;
  onSave?: () => void;
}