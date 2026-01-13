"use client";

import React from "react";
import {
  Control,
  Controller,
  FieldErrors,
  UseFormRegister,
} from "react-hook-form";

import {
  ErrorFeedback,
  FieldWrapper,
  HelpText,
} from "@/components/pages/forms/DynamicForm/FieldHelpers";
import {
  getCommonInputProps,
  getValidationRules,
} from "@/components/pages/forms/DynamicForm/utils";
import Checkbox from "@/components/pure-components/Checkbox";
import EditorJSComponent, {
  EditorJSData,
} from "@/components/pure-components/EditorJS";
import { FileUpload } from "@/components/pure-components/FileUpload";
import {
  FormGroup,
  FormLabel,
  FormText,
} from "@/components/pure-components/Form";
import Input from "@/components/pure-components/Form/Input";
import Password from "@/components/pure-components/Form/Input/Password";
import Search from "@/components/pure-components/Form/Input/Search";
import TextArea from "@/components/pure-components/Form/Input/TextArea";
import MultiSelect from "@/components/pure-components/MultiSelect";
import Radio from "@/components/pure-components/Radio";
import Select from "@/components/pure-components/Select";
import { DATA_TYPES } from "@/constants";
import { MAX_SIZE } from "@/constants/forms/dynamicForm";
import type {
  CheckboxFieldConfig,
  DateFieldConfig,
  DynamicFieldConfig,
  EditorFieldConfig,
  FieldValues,
  FileFieldConfig,
  MultiSelectFieldConfig,
  NumberFieldConfig,
  RadioFieldConfig,
  RangeFieldConfig,
  SelectFieldConfig,
  TextAreaFieldConfig,
} from "@/types/forms/dynamicForm";
import { FieldType } from "@/types/forms/dynamicForm";

export const RenderField = (
  field: DynamicFieldConfig,
  control: Control<FieldValues>,
  errors: FieldErrors<FieldValues>,
  register: UseFormRegister<FieldValues>,
  watch?: (name: string) => unknown,
  t?: (key: string, params?: Record<string, string>) => string,
  useZodValidation?: boolean,
  tValidations?: (
    key: string,
    params?: Record<string, string | number>
  ) => string,
  trigger?: any
) => {
  const error = errors[field.name];
  const tDynamic =
    t ||
    ((key: string, params?: Record<string, string>) => {
      if (params) {
        return Object.entries(params).reduce(
          (str, [k, v]) => str.replace(`{${k}}`, v),
          key
        );
      }
      return key;
    });

  switch (field.type) {
    case FieldType.TEXT:
    case FieldType.EMAIL:
    case FieldType.URL:
    case FieldType.TEL:
      return (
        <FieldWrapper field={field} error={error} fieldId={field.id}>
          <Input
            {...getCommonInputProps(
              field,
              register,
              error,
              t,
              { useZodValidation },
              tValidations
            )}
            type={
              field.type === FieldType.EMAIL ? DATA_TYPES.TEXT : (field.type as string)
            }
          />
        </FieldWrapper>
      );

    case FieldType.TEXTAREA: {
      const textareaField = field as TextAreaFieldConfig;
      return (
        <FieldWrapper field={field} error={error} fieldId={field.id}>
          <TextArea
            {...getCommonInputProps(
              field,
              register,
              error,
              t,
              { useZodValidation },
              tValidations
            )}
            rows={textareaField.rows || 3}
          />
        </FieldWrapper>
      );
    }

    case FieldType.PASSWORD:
      return (
        <FieldWrapper field={field} error={error} fieldId={field.id}>
          <Password
            {...getCommonInputProps(
              field,
              register,
              error,
              t,
              { useZodValidation },
              tValidations
            )}
          />
        </FieldWrapper>
      );

    case FieldType.SEARCH:
      return (
        <FieldWrapper field={field} error={error} fieldId={field.id}>
          <Search
            {...getCommonInputProps(
              field,
              register,
              error,
              t,
              { useZodValidation },
              tValidations
            )}
          />
        </FieldWrapper>
      );

    case FieldType.NUMBER: {
      const numberField = field as NumberFieldConfig;
      return (
        <FieldWrapper field={field} error={error} fieldId={field.id}>
          <Input
            {...getCommonInputProps(
              field,
              register,
              error,
              t,
              {
                valueAsNumber: true,
              },
              tValidations
            )}
            type="number"
            min={numberField.min}
            max={numberField.max}
            step={numberField.step}
          />
        </FieldWrapper>
      );
    }

    case FieldType.DATE:
    case FieldType.DATETIME:
    case FieldType.TIME: {
      const dateField = field as DateFieldConfig;
      return (
        <FieldWrapper field={field} error={error} fieldId={field.id}>
          <Input
            {...getCommonInputProps(
              field,
              register,
              error,
              t,
              { useZodValidation },
              tValidations
            )}
            type={field.type as string}
            min={dateField.minDate}
            max={dateField.maxDate}
          />
        </FieldWrapper>
      );
    }

    case FieldType.SELECT: {
      const selectField = field as SelectFieldConfig;
      const validationRules = useZodValidation
        ? undefined
        : getValidationRules(field, t || ((key: string) => key), tValidations);
      return (
        <FieldWrapper field={field} error={error} fieldId={field.id}>
          <Controller
            name={field.name}
            control={control}
            rules={validationRules}
            render={({ field: controllerField }) => (
              <Select
                {...controllerField}
                options={[
                  {
                    label: field.placeholder || tDynamic("selectOption"),
                    value: "",
                  },
                  ...selectField.options,
                ]}
                optionGroups={selectField.optionGroups}
                className={field.className}
              />
            )}
          />
        </FieldWrapper>
      );
    }

    case FieldType.MULTISELECT: {
      const multiselectField = field as MultiSelectFieldConfig;
      const validationRules = useZodValidation
        ? undefined
        : getValidationRules(field, t || ((key: string) => key), tValidations);
      return (
        <FieldWrapper field={field} error={error} fieldId={field.id}>
          <Controller
            name={field.name}
            control={control}
            rules={validationRules}
            render={({ field: controllerField }) => {
              const currentValue = Array.isArray(controllerField.value)
                ? controllerField.value
                : controllerField.value
                ? [String(controllerField.value)]
                : [];
              return (
                <MultiSelect
                  value={currentValue}
                  onChange={(e) => {
                    const values =
                      e.target.value
                        ?.split(",")
                        .map((val) => val.trim())
                        .filter(Boolean) ?? [];
                    controllerField.onChange(values);
                  }}
                  options={multiselectField.options}
                  optionGroups={multiselectField.optionGroups}
                  className={field.className}
                  disabled={field.disabled}
                />
              );
            }}
          />
        </FieldWrapper>
      );
    }

    case FieldType.CHECKBOX: {
      const checkboxField = field as CheckboxFieldConfig;
      const validationRules = useZodValidation
        ? undefined
        : getValidationRules(field, t || ((key: string) => key), tValidations);
      return (
        <FieldWrapper
          field={field}
          error={error}
          fieldId={field.id}
          showLabel={true}
        >
          {/* Group-level validation */}
          <Controller
            name={field.name}
            control={control}
            rules={validationRules}
            render={() => <></>}
          />
          {checkboxField.options?.map((option) => (
            <Controller
              key={option.value}
              name={`${field.name}.${option.value}`}
              control={control}
              defaultValue={option.checked ?? false}
              render={({ field: controllerField }) => (
                <Checkbox
                  label={option.label}
                  checked={controllerField.value || false}
                  onChange={(checked) => {
                    controllerField.onChange(checked);
                    trigger(field.name); // Force re-validation
                  }}
                  disabled={field.disabled}
                  inline={checkboxField.inline}
                  isInvalid={!!error}
                  className={field.className}
                />
              )}
            />
          ))}
        </FieldWrapper>
      );
    }

    case FieldType.FILE:
    case FieldType.MULTIFILE: {
      const fileField = field as FileFieldConfig;
      const validationRules = useZodValidation
        ? undefined
        : getValidationRules(field, t || ((key: string) => key), tValidations);
      return (
        <FieldWrapper
          field={field}
          error={error}
          fieldId={field.id}
          showLabel={false}
        >
          <Controller
            name={field.name}
            control={control}
            rules={validationRules}
            render={({ field: controllerField }) => (
              <FileUpload
                name={field.name}
                label={field.label}
                accept={fileField.accept || "*/*"}
                multiple={
                  fileField.multiple || field.type === FieldType.MULTIFILE
                }
                maxSize={fileField.maxSize || MAX_SIZE}
                required={field.required}
                disabled={field.disabled}
                onFileSelect={(files) => {
                  const fileArray =
                    fileField.multiple || field.type === FieldType.MULTIFILE
                      ? files
                      : files[0] || null;
                  controllerField.onChange(fileArray);
                }}
              />
            )}
          />
        </FieldWrapper>
      );
    }

    case FieldType.COLOR:
      return (
        <FieldWrapper field={field} error={error} fieldId={field.id}>
          <Input
            {...getCommonInputProps(
              field,
              register,
              error,
              t,
              { useZodValidation },
              tValidations
            )}
            type="color"
          />
        </FieldWrapper>
      );

    case FieldType.RANGE: {
      const rangeField = field as RangeFieldConfig;
      const value = watch ? (watch(field.name) as number) : rangeField.min || 0;
      return (
        <FormGroup>
          <FormLabel>
            {field.label}
            {field.required && <span className="text-danger"> *</span>}
            {value !== undefined && (
              <span className="ms-2 text-muted">({value})</span>
            )}
          </FormLabel>
          <Input
            {...getCommonInputProps(
              field,
              register,
              error,
              t,
              {
                valueAsNumber: true,
                useZodValidation,
              },
              tValidations
            )}
            type="range"
            min={rangeField.min}
            max={rangeField.max}
            step={rangeField.step}
          />
          <ErrorFeedback
            error={error?.message ? String(error.message) : undefined}
          />
          <HelpText helpText={field.helpText} />
        </FormGroup>
      );
    }

    case FieldType.RADIO: {
      const radioField = field as RadioFieldConfig;
      const validationRules = useZodValidation
        ? undefined
        : getValidationRules(field, t || ((key: string) => key), tValidations);
      return (
        <FieldWrapper
          field={field}
          error={error}
          fieldId={field.id}
          showLabel={true}
        >
          <Controller
            name={field.name}
            control={control}
            rules={validationRules}
            render={({ field: controllerField }) => (
              <>
                {radioField.options?.map((option) => (
                  <Radio
                    key={option.value}
                    label={option.label}
                    name={controllerField.name}
                    value={option.value}
                    checked={controllerField.value === option.value}
                    onChange={() => controllerField.onChange(option.value)}
                    isInvalid={!!error}
                  />
                ))}
              </>
            )}
          />
        </FieldWrapper>
      );
    }

    case FieldType.EDITOR: {
      const editorField = field as EditorFieldConfig;
      const validationRules = useZodValidation
        ? undefined
        : getValidationRules(field, t || ((key: string) => key), tValidations);
      const editorPlaceholder =
        editorField.placeholder || tDynamic("editorPlaceholder");
      return (
        <FieldWrapper field={field} error={error} fieldId={field.id}>
          <Controller
            name={field.name}
            control={control}
            rules={validationRules}
            render={({ field: controllerField }) => (
              <EditorJSComponent
                data={controllerField.value as EditorJSData | undefined}
                onChange={(data) => controllerField.onChange(data)}
                placeholder={editorPlaceholder}
                minHeight={editorField.minHeight || 300}
                error={error?.message ? String(error.message) : undefined}
                isInvalid={!!error}
              />
            )}
          />
        </FieldWrapper>
      );
    }

    default: {
      const fieldType = String((field as { type: FieldType }).type);
      return (
        <FormGroup>
          <FormText className="text-danger">
            {tDynamic("unknownFieldType", { type: fieldType })}
          </FormText>
        </FormGroup>
      );
    }
  }
};
