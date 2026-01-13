"use client";

import React, { FC } from "react";
import { Form as BootstrapForm } from "react-bootstrap";

import {
  FormGroup,
  FormLabel,
  FormText,
} from "@/components/pure-components/Form";
import type {
  ErrorFeedbackProps,
  FieldLabelProps,
  FieldWrapperProps,
  HelpTextProps,
} from "@/types/forms/dynamicForm";

/**
 * Helper component to render field label with required indicator
 */
export const FieldLabel: FC<FieldLabelProps> = ({ label, required }) => (
  <FormLabel>
    {label}
    {required && <span className="text-danger"> *</span>}
  </FormLabel>
);

/**
 * Helper component to render help text
 */
export const HelpText: FC<HelpTextProps> = ({ helpText, text }) => {
  const displayText = helpText || text;
  return displayText ? <FormText className="text-muted">{displayText}</FormText> : null;
};

/**
 * Helper component to render error feedback
 */
export const ErrorFeedback: FC<ErrorFeedbackProps> = ({ error }) =>
  error ? (
    <BootstrapForm.Control.Feedback type="invalid" className="d-block">
      {error}
    </BootstrapForm.Control.Feedback>
  ) : null;

/**
 * Helper component to wrap field with FormGroup, label, and help text
 */
export const FieldWrapper: FC<FieldWrapperProps> = ({
  field,
  error,
  showLabel = true,
  children,
}) => (
  <FormGroup>
    {showLabel && field && <FieldLabel label={field.label} required={field.required} />}
    {children}
    <ErrorFeedback error={error?.message ? String(error.message) : undefined} />
    {field && <HelpText text={field.helpText} />}
  </FormGroup>
);
