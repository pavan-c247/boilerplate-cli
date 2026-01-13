
import { ReactNode } from 'react';
import { Control, FieldError, FieldValues, Path, RegisterOptions } from 'react-hook-form';

/**
 * Base props that all form fields should have
 * All props have sensible defaults - you can use fields with minimal props
 */
export interface BaseFieldProps<TFieldValues extends FieldValues = FieldValues> {
  /** Field name (must match form schema) - REQUIRED */
  name: Path<TFieldValues>;
  /** Field label - Default: empty string */
  label?: ReactNode;
  /** Placeholder text - Default: empty string */
  placeholder?: string;
  /** Whether field is required - Default: false */
  required?: boolean;
  /** Whether field is disabled - Default: false */
  disabled?: boolean;
  /** Whether field is readonly - Default: false */
  readonly?: boolean;
  /** Error message from form validation - Default: undefined */
  error?: string | FieldError;
  /** Help text shown below field - Default: undefined */
  helpText?: ReactNode;
  /** Additional CSS class for field wrapper - Default: empty string */
  className?: string;
  /** Additional CSS class for input element - Default: empty string */
  inputClassName?: string;
  /** Inline styles for field wrapper - Default: undefined */
  style?: React.CSSProperties;
  /** Inline styles for input element - Default: undefined */
  inputStyle?: React.CSSProperties;
  /** Field size - Default: 'md' */
  size?: 'sm' | 'md' | 'lg';
  /** Custom label renderer - Default: standard label rendering */
  renderLabel?: (label: React.ReactNode, required: boolean | undefined) => React.ReactNode;
  /** Custom error renderer - Default: standard error rendering */
  renderError?: (error: string | FieldError) => React.ReactNode;
  /** Custom help text renderer - Default: standard help text rendering */
  renderHelpText?: (helpText: ReactNode) => ReactNode;
  /** Custom wrapper component - Default: Form.Item */
  wrapperComponent?: React.ComponentType<any>;
  /** Custom wrapper props - Default: empty object */
  wrapperProps?: Record<string, any>;
  /** Hide label - Default: false */
  hideLabel?: boolean;
  /** Hide error message - Default: false */
  hideError?: boolean;
  /** Hide help text - Default: false */
  hideHelpText?: boolean;
  /** Custom validation mode - Default: form's validation mode */
  validationMode?: 'onChange' | 'onBlur' | 'onSubmit' | 'onTouched' | 'all';
  /** Custom error message override - Default: undefined */
  errorMessage?: string;
  /** Show validation on mount - Default: false */
  validateOnMount?: boolean;
  /** Custom onChange handler (in addition to form handler) - Default: undefined */
  onChange?: (value: any) => void;
  /** Custom onBlur handler (in addition to form handler) - Default: undefined */
  onBlur?: () => void;
  /** Custom onFocus handler - Default: undefined */
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  /** Custom onClick handler - Default: undefined */
  onClick?: (event: React.MouseEvent<HTMLInputElement>) => void;
  /** Custom onKeyDown handler - Default: undefined */
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  /** Custom onKeyUp handler - Default: undefined */
  onKeyUp?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  /** Custom onKeyPress handler - Default: undefined */
  onKeyPress?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  /** Custom form item size (for Form.Item) - Default: 'md' */
  formItemSize?: 'sm' | 'md' | 'lg' | 'xl';
  /** Dense spacing for Form.Item - Default: false */
  dense?: boolean;
  /** Control from React Hook Form (if not using FormProvider) - Default: from FormProvider */
  control?: Control<TFieldValues>;
  /** Validation rules for React Hook Form - Default: undefined */
  rules?: RegisterOptions;
  /** Custom field ID - Default: auto-generated from name */
  id?: string;
  /** Custom field name (if different from name prop) - Default: same as name */
  fieldName?: string;
  /** Auto focus - Default: false */
  autoFocus?: boolean;
  /** Auto complete - Default: undefined (or 'bday' for DateField) */
  autoComplete?: string;
  /** Tab index - Default: undefined */
  tabIndex?: number;
  /** ARIA label - Default: label or name */
  'aria-label'?: string;
  /** ARIA described by - Default: undefined */
  'aria-describedby'?: string;
  /** ARIA labelled by - Default: undefined */
  'aria-labelledby'?: string;
  /** Data attributes */
  'data-testid'?: string;
  'data-cy'?: string;
  [key: `data-${string}`]: any;
}

/**
 * Hook options for useFormField
 */
export interface UseFormFieldOptions<TFieldValues extends FieldValues = FieldValues> {
  name: Path<TFieldValues>;
  control?: Control<TFieldValues>;
  rules?: RegisterOptions;
  defaultValue?: any;
}

/**
 * Return type for useFormField hook
 */
export interface UseFormFieldReturn<TFieldValues extends FieldValues = FieldValues> {
  field: {
    name: Path<TFieldValues>;
    value: any;
    onChange: (value: any) => void;
    onBlur: () => void;
    ref: (instance: any) => void;
  };
  fieldState: {
    error?: { message?: string };
    invalid: boolean;
    isDirty: boolean;
    isTouched: boolean;
  };
  formState: {
    errors: any;
  };
}
