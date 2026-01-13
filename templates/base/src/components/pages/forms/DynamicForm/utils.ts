import type { RegisterOptions, UseFormRegister } from "react-hook-form";

import { DATA_TYPES } from "@/constants";
import type {
  DynamicFieldConfig,
  FieldValues,
} from "@/types/forms/dynamicForm";
import { FieldType } from "@/types/forms/dynamicForm";
import { VALIDATION_PATTERNS } from "@/validations/common/patterns";

/**
 * Get default validation based on field type
 */
const getDefaultValidationByType = (
  fieldType: FieldType,
  tValidations: (
    key: string,
    params?: Record<string, string | number>
  ) => string
): Partial<RegisterOptions<FieldValues, string>> => {
  const rules: Partial<RegisterOptions<FieldValues, string>> = {};

  switch (fieldType) {
    case FieldType.EMAIL:
      rules.pattern = {
        value: VALIDATION_PATTERNS.EMAIL,
        message: tValidations("messages.email"),
      };
      break;

    case FieldType.URL:
      rules.pattern = {
        value: VALIDATION_PATTERNS.URL,
        message: tValidations("messages.invalidUrl"),
      };
      break;

    case FieldType.TEL:
      rules.pattern = {
        value: VALIDATION_PATTERNS.PHONE,
        message: tValidations("messages.invalidPhone"),
      };
      break;

    case FieldType.PASSWORD:
      rules.pattern = {
        value: VALIDATION_PATTERNS.PASSWORD,
        message: tValidations("messages.password"),
      };
      break;

    case FieldType.NUMBER:
      rules.valueAsNumber = true;
      break;
  }
  return rules;
};

/**
 * Helper function to get validation rules compatible with react-hook-form
 */
export const getValidationRules = (
  field: DynamicFieldConfig,
  t?: (key: string, params?: Record<string, string>) => string,
  tValidations?: (
    key: string,
    params?: Record<string, string | number>
  ) => string
): RegisterOptions<FieldValues, string> | undefined => {
  // Provide default function if tValidations is not provided
  const getValidationMessage = tValidations || ((key: string) => key);

  const rules: RegisterOptions<FieldValues, string> = {};

  // Apply default validation based on field type first
  const defaultValidation = getDefaultValidationByType(
    field.type,
    getValidationMessage
  );
  // Deep copy to ensure each field gets its own validation rules
  if (defaultValidation.pattern) {
    if (
      typeof defaultValidation.pattern === DATA_TYPES.OBJECT &&
      "value" in defaultValidation.pattern
    ) {
      rules.pattern = {
        value: defaultValidation.pattern.value,
        message: defaultValidation.pattern.message,
      };
    } else {
      rules.pattern = defaultValidation.pattern;
    }
  }
  if (defaultValidation.valueAsNumber !== undefined) {
    rules.valueAsNumber = defaultValidation.valueAsNumber;
  }

  // Handle required validation (after default validation to ensure it takes precedence for required check)
  if (field.required) {
    // Generate unique message for this specific field using its label
    // Create a fresh string to ensure each field gets its own unique message
    const requiredMessage = getValidationMessage("messages.required", {
      field: field.label,
    });
    rules.required = String(requiredMessage); // Ensure it's a new string instance
  }

  // Handle min/max validation for NUMBER and RANGE fields (from field.min/max properties)
  if (field.type === FieldType.NUMBER || field.type === FieldType.RANGE) {
    const numberField = field as { min?: number; max?: number };
    if (numberField.min !== undefined) {
      rules.min = {
        value: numberField.min,
        message: getValidationMessage("messages.min", {
          min: String(numberField.min),
        }),
      };
    }
    if (numberField.max !== undefined) {
      rules.max = {
        value: numberField.max,
        message: getValidationMessage("messages.max", {
          max: String(numberField.max),
        }),
      };
    }
  }

  // Convert field.validation to RegisterOptions format
  if (field.validation) {
    // Min value validation
    if (field.validation.min !== undefined) {
      rules.min = {
        value: field.validation.min,
        message: getValidationMessage("messages.min", {
          min: field.validation.min,
        }),
      };
    }

    // Max value validation
    if (field.validation.max !== undefined) {
      rules.max = {
        value: field.validation.max,
        message: getValidationMessage("messages.max", {
          max: field.validation.max,
        }),
      };
    }

    // Min length validation
    if (field.validation.minLength !== undefined) {
      rules.minLength = {
        value: field.validation.minLength,
        message: getValidationMessage("messages.minLength", {
          min: field.validation.minLength,
        }),
      };
    }

    // Max length validation
    if (field.validation.maxLength !== undefined) {
      rules.maxLength = {
        value: field.validation.maxLength,
        message: getValidationMessage("messages.maxLength", {
          max: field.validation.maxLength,
        }),
      };
    }

    // Pattern validation - convert string to RegExp
    if (field.validation.pattern) {
      try {
        rules.pattern = {
          value: new RegExp(field.validation.pattern),
          message: getValidationMessage("messages.pattern"),
        };
      } catch {
        // If pattern is invalid, skip it
        console.warn(`Invalid pattern: ${field.validation.pattern}`);
      }
    }

    // Email validation (if explicitly set in validation object)
    if (field.validation.email) {
      rules.pattern = {
        value: VALIDATION_PATTERNS.EMAIL,
        message: getValidationMessage("messages.email"),
      };
    }

    // URL validation (if explicitly set in validation object)
    if (field.validation.url) {
      rules.pattern = {
        value: VALIDATION_PATTERNS.URL,
        message: getValidationMessage("messages.invalidUrl"),
      };
    }

    // Custom validation function
    if (field.validation.custom) {
      rules.validate = (value: any) => {
        const result = field.validation!.custom!(value);
        if (typeof result === "string") {
          return result;
        }
        if (result === false) {
          return getValidationMessage("messages.custom");
        }
        return result || true;
      };
    }
  }

  // If no rules were added, return undefined
  if (Object.keys(rules).length === 0) {
    return undefined;
  }

  // Checkbox validation
  if (field.type === FieldType.CHECKBOX && field.required) {
    rules.validate = (value: Record<string, boolean>) => {
      if (!value || typeof value !== DATA_TYPES.OBJECT) {
        return getValidationMessage("messages.atLeastOneSelected");
      }
      const hasChecked = Object.values(value).some(Boolean);
      return hasChecked || getValidationMessage("messages.atLeastOneSelected");
    };
    // IMPORTANT: do NOT use rules.required for checkbox
    delete rules.required;
  }

  // Radio validation
  if (field.type === FieldType.RADIO && field.required) {
    rules.validate = (value: string | boolean) => {
      return (
        (value !== undefined &&
          value !== null &&
          value !== "" &&
          value !== false) ||
        getValidationMessage("messages.atLeastOneSelected")
      );
    };
    delete rules.required;
  }
  return rules;
};

/**
 * Helper function to get common input props
 */
export const getCommonInputProps = (
  field: DynamicFieldConfig,
  register: UseFormRegister<FieldValues>,
  error?: { message?: string },
  t?: (key: string, params?: Record<string, string>) => string,
  options?: { valueAsNumber?: boolean; useZodValidation?: boolean },
  tValidations?: (
    key: string,
    params?: Record<string, string | number>
  ) => string
) => {
  // When using Zod validation, don't pass validation rules to register
  // Zod resolver handles all validation
  const registerOptions: RegisterOptions<FieldValues, string> | undefined =
    options?.useZodValidation
      ? options?.valueAsNumber
        ? ({ valueAsNumber: true } as RegisterOptions<FieldValues, string>)
        : {}
      : (() => {
          // Generate validation rules fresh for this specific field
          // This ensures each field gets its own unique validation rules object
          const getValidationMessage = tValidations || ((key: string) => key);
          // Capture the field label at registration time to ensure we use the correct value
          const currentFieldLabel = field.label;
          const validationRules = getValidationRules(
            field,
            t || ((key: string) => key),
            tValidations
          );
          if (!validationRules) {
            return options?.valueAsNumber
              ? ({ valueAsNumber: true } as RegisterOptions<
                  FieldValues,
                  string
                >)
              : undefined;
          }
          // Create a completely new object with fresh message strings for this field
          const freshRules: RegisterOptions<FieldValues, string> = {};
          const isRuleObject = <T>(
            rule: unknown
          ): rule is { value: T; message?: string } =>
            typeof rule === "object" && rule !== null && "value" in rule;

          // Regenerate required message with this field's specific label (captured at registration time)
          if (validationRules.required) {
            // Use the captured label to ensure we're using the correct value for this field
            freshRules.required = getValidationMessage("messages.required", {
              field: currentFieldLabel,
            });
          }
          // Copy other validation rules
          if (validationRules.min) {
            freshRules.min = isRuleObject<number | string>(validationRules.min)
              ? {
                  value: validationRules.min.value,
                  message: validationRules.min.message,
                }
              : validationRules.min;
          }

          if (validationRules.max) {
            freshRules.max = isRuleObject<number | string>(validationRules.max)
              ? {
                  value: validationRules.max.value,
                  message: validationRules.max.message,
                }
              : validationRules.max;
          }

          if (validationRules.minLength) {
            freshRules.minLength = isRuleObject<number>(
              validationRules.minLength
            )
              ? {
                  value: validationRules.minLength.value,
                  message: validationRules.minLength.message,
                }
              : validationRules.minLength;
          }

          if (validationRules.maxLength) {
            freshRules.maxLength = isRuleObject<number>(
              validationRules.maxLength
            )
              ? {
                  value: validationRules.maxLength.value,
                  message: validationRules.maxLength.message,
                }
              : validationRules.maxLength;
          }

          if (validationRules.pattern) {
            if (
              typeof validationRules.pattern === DATA_TYPES.OBJECT &&
              "value" in validationRules.pattern
            ) {
              freshRules.pattern = {
                value: validationRules.pattern.value,
                message: validationRules.pattern.message,
              };
            } else {
              freshRules.pattern = validationRules.pattern;
            }
          }
          if (validationRules.validate) {
            freshRules.validate = validationRules.validate;
          }
          if (
            validationRules.valueAsNumber !== undefined ||
            options?.valueAsNumber
          ) {
            freshRules.valueAsNumber = true;
          }
          return freshRules;
        })();

  const registerReturn = register(field.name, registerOptions);
  return {
    ...registerReturn,
    placeholder: field.placeholder,
    disabled: field.disabled,
    isInvalid: !!error,
    className: field.className,
  };
};

/**
 * Escapes special characters that need to be escaped in string literals
 */
export const escapeString = (value: string): string => {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/\n/g, "\\n")
    .replace(/\r/g, "\\r")
    .replace(/\t/g, "\\t");
};
