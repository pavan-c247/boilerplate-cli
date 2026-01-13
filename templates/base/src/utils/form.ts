import { FieldValues, UseFormRegister } from 'react-hook-form';

import { FORM_VALIDATION } from '@/constants/validation';
import { VALIDATION_PATTERNS } from "@/validations/common/patterns";

// Type for form field registration
export type FormFieldRegistration = {
  register: UseFormRegister<FieldValues>;
  name: string;
  validation?: keyof typeof FORM_VALIDATION;
};

/**
 * Helper function to register form fields with validation
 * @param register - React Hook Form's register function
 * @param name - Field name
 * @param validation - Optional validation type from FORM_VALIDATION
 * @returns Register options for the field
 */
export const registerField = ({ register, name, validation }: FormFieldRegistration) => {
  if (validation && FORM_VALIDATION[validation]) {
    return register(name, FORM_VALIDATION[validation]);
  }
  return register(name);
};

/**
 * Format form error message
 * @param error - Error message or object
 * @returns Formatted error message
 */
export const formatFormError = (error: unknown): string => {
  if (typeof error === 'string') return error;
  if (error instanceof Error) return error.message;
  return 'An error occurred';
};

/**
 * Check if form is valid
 * @param errors - Form errors object
 * @returns Boolean indicating if form is valid
 */
export const isFormValid = (errors: Record<string, unknown>): boolean => {
  return Object.keys(errors).length === 0;
};

/**
 * Get email validation pattern
 * @param errorMessage - Error message to display when validation fails
 * @returns React Hook Form pattern validation object
 */
export const getEmailValidationPattern = (errorMessage: string) => ({
  pattern: {
    value: VALIDATION_PATTERNS.EMAIL,
    message: errorMessage,
  },
});

/**
 * Validate comma-separated email addresses
 * @param value - String containing comma-separated emails
 * @param errorMessage - Error message to return if validation fails
 * @returns true if valid or empty (optional field), error message string if invalid
 */
export const validateCommaSeparatedEmails = (
  value: string | undefined,
  errorMessage: string
): true | string => {
  if (!value || value.trim() === '') return true; // Optional field
  
  const emails = value.split(',').map((e) => e.trim()).filter(Boolean);
  const invalidEmails = emails.filter((email) => !VALIDATION_PATTERNS.EMAIL.test(email));
  
  return invalidEmails.length === 0 || errorMessage;
}; 