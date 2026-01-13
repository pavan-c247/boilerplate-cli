import {
  generateFieldId,
  generateFieldName,
} from "@/config/dynamicForm.config";
import { DATA_TYPES } from "@/constants";
import type {
  CheckboxFieldConfig,
  DateFieldConfig,
  DynamicFieldConfig,
  DynamicFormConfig,
  DynamicFormField,
  DynamicFormListResponse,
  DynamicFormRequest,
  DynamicFormResponse,
  DynamicFormResponseData,
  EditorFieldConfig,
  FileFieldConfig,
  GridSize,
  MultiSelectFieldConfig,
  NumberFieldConfig,
  RadioFieldConfig,
  RangeFieldConfig,
  SelectFieldConfig,
  TextAreaFieldConfig,
} from "@/types/forms/dynamicForm";
import { FieldType } from "@/types/forms/dynamicForm";
import { api } from "@/utils/api";

const BASE_PATH = "/form-config";
const ENDPOINTS = {
  FORM_CONFIGS: BASE_PATH,
  FORM_CONFIG_BY_ID: (id: string) => `${BASE_PATH}/${id}`,
} as const;

/**
 * Extract data from wrapped API response
 * Handles both wrapped responses { success, message, data } and direct data
 */
const extractResponseData = (
  response: DynamicFormResponse | DynamicFormResponseData | any
): DynamicFormResponseData | undefined => {
  if (
    response &&
    typeof response === DATA_TYPES.OBJECT &&
    "data" in response &&
    "success" in response
  ) {
    return (response as DynamicFormResponse).data;
  }
  // If it's already the data object, return it
  if (
    response &&
    typeof response === DATA_TYPES.OBJECT &&
    "id" in response &&
    "title" in response &&
    "config" in response
  ) {
    return response as DynamicFormResponseData;
  }
  return undefined;
};

export const formConfigService = {
  // Get all form configurations
  getAllFormConfigs: async (): Promise<Array<DynamicFormResponseData>> => {
    const { data } = await api.get<DynamicFormListResponse>(
      ENDPOINTS.FORM_CONFIGS
    );

    // Handle new API format: { success, message, data: { list, pagination } }
    if (
      data &&
      typeof data === DATA_TYPES.OBJECT &&
      "success" in data &&
      "data" in data &&
      typeof data.data === DATA_TYPES.OBJECT &&
      data.data !== null &&
      "list" in data.data
    ) {
      const responseData = data as DynamicFormListResponse;
      return responseData.data.list || [];
    }

    // Fallback for old format (direct array or wrapped single response)
    if (Array.isArray(data)) {
      return data.map((item) => {
        if (typeof item === DATA_TYPES.OBJECT && item !== null && "data" in item) {
          return (item as DynamicFormResponse).data;
        }
        return item as DynamicFormResponseData;
      });
    }

    // If response is wrapped, extract data array
    if (
      data &&
      typeof data === DATA_TYPES.OBJECT &&
      "data" in data &&
      Array.isArray((data as any).data)
    ) {
      return (data as any).data;
    }

    return [];
  },

  // Get form configuration by ID
  // Returns response
  getFormConfig: async (id: string): Promise<DynamicFormResponse> => {
    const { data: response } = await api.get<DynamicFormResponse>(
      ENDPOINTS.FORM_CONFIG_BY_ID(id)
    );
    return response;
  },

  addUpdateFormConfig: async ({
    id,
    ...payload
  }: {
    id?: string;
  } & DynamicFormRequest): Promise<DynamicFormResponse> => {
    const endpoint = id
      ? ENDPOINTS.FORM_CONFIG_BY_ID(id)
      : ENDPOINTS.FORM_CONFIGS;
    const method = id ? api.put : api.post;
    const { data: response } = await method<DynamicFormResponse>(
      endpoint,
      payload
    );
    return response;
  },

  // Delete form configuration by ID
  deleteFormConfig: async (id: string): Promise<boolean> => {
    await api.delete<null>(ENDPOINTS.FORM_CONFIG_BY_ID(id));
    return true;
  },
};

// Convert DynamicFormResponse to DynamicFormConfig
export const renderDynamicFormFields = (
  response: DynamicFormResponse
): DynamicFormConfig | undefined => {
  const apiResponseData = extractResponseData(response);

  if (!apiResponseData) {
    return undefined;
  }

  // Convert API response to DynamicFormConfig
  const existingFieldNames: string[] = [];
  const fields = (apiResponseData.config || []).map((apiField) => {
    const field = convertApiFieldToDynamicField(apiField, existingFieldNames);
    existingFieldNames.push(field.name);
    return field;
  });

  return {
    title: apiResponseData.title || "",
    fields,
    description: "",
    submitButtonText: "Submit",
    resetButtonText: "Reset",
    showResetButton: true,
  };
};

// Convert API DynamicFormField to DynamicFieldConfig
const convertApiFieldToDynamicField = (
  apiField: DynamicFormField,
  existingFieldNames: string[] = []
): DynamicFieldConfig => {
  const fieldName = generateFieldName(apiField.key, existingFieldNames);
  const fieldId = generateFieldId();
  const fieldType = apiField.type as FieldType;

  const baseField: Partial<DynamicFieldConfig> = {
    id: fieldId,
    name: fieldName,
    label: apiField.label,
    type: fieldType,
    required: apiField.required,
    disabled: !apiField.enabled,
  };

  // Add common properties
  if (apiField.placeholder) {
    baseField.placeholder = apiField.placeholder;
  }
  if (apiField.helpText) {
    baseField.helpText = apiField.helpText;
  }
  if (apiField.validation) {
    baseField.validation = apiField.validation;
  }
  // Add gridSize if present in API
  if ((apiField as any).gridSize !== undefined) {
    baseField.gridSize = (apiField as any).gridSize as GridSize;
  }

  // Add field-type-specific properties
  switch (fieldType) {
    case FieldType.SELECT:
    case FieldType.MULTISELECT: {
      if (apiField.options) {
        (baseField as SelectFieldConfig | MultiSelectFieldConfig).options =
          apiField.options;
      }
      if (apiField.optionGroups) {
        (baseField as SelectFieldConfig | MultiSelectFieldConfig).optionGroups =
          apiField.optionGroups;
      }
      break;
    }

    case FieldType.FILE:
    case FieldType.MULTIFILE: {
      if (apiField.accept !== undefined) {
        (baseField as FileFieldConfig).accept = apiField.accept;
      }
      if (apiField.maxSize !== undefined) {
        (baseField as FileFieldConfig).maxSize = apiField.maxSize;
      }
      if (apiField.multiple !== undefined) {
        (baseField as FileFieldConfig).multiple = apiField.multiple;
      }
      break;
    }

    case FieldType.NUMBER:
    case FieldType.RANGE: {
      if (apiField.min !== undefined) {
        (baseField as NumberFieldConfig | RangeFieldConfig).min = apiField.min;
      }
      if (apiField.max !== undefined) {
        (baseField as NumberFieldConfig | RangeFieldConfig).max = apiField.max;
      }
      if (apiField.step !== undefined) {
        (baseField as NumberFieldConfig | RangeFieldConfig).step =
          apiField.step;
      }
      break;
    }

    case FieldType.TEXTAREA: {
      if (apiField.rows !== undefined) {
        (baseField as TextAreaFieldConfig).rows = apiField.rows;
      }
      break;
    }

    case FieldType.DATE:
    case FieldType.DATETIME:
    case FieldType.TIME: {
      if (apiField.minDate) {
        (baseField as DateFieldConfig).minDate = apiField.minDate;
      }
      if (apiField.maxDate) {
        (baseField as DateFieldConfig).maxDate = apiField.maxDate;
      }
      if (apiField.step !== undefined) {
        (baseField as DateFieldConfig).step = apiField.step;
      }
      break;
    }

    case FieldType.CHECKBOX: {
      if (apiField.checked !== undefined) {
        (baseField as CheckboxFieldConfig).checked = apiField.checked;
      }
      if (apiField.inline !== undefined) {
        (baseField as CheckboxFieldConfig).inline = apiField.inline;
      }
      if (apiField.options) {
        (baseField as CheckboxFieldConfig).options = apiField.options;
      }
      break;
    }

    case FieldType.RADIO: {
      if (apiField.options) {
        (baseField as RadioFieldConfig).options = apiField.options;
      }
      break;
    }

    case FieldType.EDITOR: {
      if (apiField.minHeight !== undefined) {
        (baseField as EditorFieldConfig).minHeight = apiField.minHeight;
      }
      if (apiField.readOnly !== undefined) {
        (baseField as EditorFieldConfig).readOnly = apiField.readOnly;
      }
      break;
    }

    default:
      // For other field types, only base properties are included
      break;
  }

  return baseField as DynamicFieldConfig;
};

// Convert DynamicFieldConfig to API DynamicFormField
const convertDynamicFieldToApiField = (
  field: DynamicFieldConfig
): DynamicFormField => {
  const baseField: DynamicFormField = {
    key: field.name,
    label: field.label,
    type: field.type,
    enabled: !field.disabled,
    required: field.required ?? false,
  };

  // Add common properties
  if (field.placeholder) {
    baseField.placeholder = field.placeholder;
  }
  if (field.helpText) {
    baseField.helpText = field.helpText;
  }
  if (field.validation) {
    baseField.validation = field.validation;
  }
  // Add gridSize if present (for layout)
  if (field.gridSize !== undefined) {
    (baseField as any).gridSize = field.gridSize;
  }

  // Add field-type-specific properties
  switch (field.type) {
    case FieldType.SELECT:
    case FieldType.MULTISELECT: {
      const selectField = field as SelectFieldConfig | MultiSelectFieldConfig;
      if (selectField.options) {
        baseField.options = selectField.options;
      }
      if (selectField.optionGroups) {
        baseField.optionGroups = selectField.optionGroups;
      }
      break;
    }

    case FieldType.FILE:
    case FieldType.MULTIFILE: {
      const fileField = field as FileFieldConfig;
      if (fileField.accept) {
        baseField.accept = fileField.accept;
      }
      if (fileField.maxSize !== undefined) {
        baseField.maxSize = fileField.maxSize;
      }
      if (fileField.multiple !== undefined) {
        baseField.multiple = fileField.multiple;
      }
      break;
    }

    case FieldType.NUMBER:
    case FieldType.RANGE: {
      const numberField = field as NumberFieldConfig | RangeFieldConfig;
      if (numberField.min !== undefined) {
        baseField.min = numberField.min;
      }
      if (numberField.max !== undefined) {
        baseField.max = numberField.max;
      }
      if (numberField.step !== undefined) {
        baseField.step = numberField.step;
      }
      break;
    }

    case FieldType.TEXTAREA: {
      const textareaField = field as TextAreaFieldConfig;
      if (textareaField.rows !== undefined) {
        baseField.rows = textareaField.rows;
      }
      break;
    }

    case FieldType.DATE:
    case FieldType.DATETIME:
    case FieldType.TIME: {
      const dateField = field as DateFieldConfig;
      // Prefer minDate/maxDate over min/max for date fields
      if (dateField.minDate) {
        baseField.minDate = dateField.minDate;
      } else if (dateField.min) {
        baseField.minDate = dateField.min;
      }
      if (dateField.maxDate) {
        baseField.maxDate = dateField.maxDate;
      } else if (dateField.max) {
        baseField.maxDate = dateField.max;
      }
      if (dateField.step !== undefined) {
        baseField.step = dateField.step;
      }
      break;
    }

    case FieldType.CHECKBOX: {
      const checkboxField = field as CheckboxFieldConfig;
      if (checkboxField.checked !== undefined) {
        baseField.checked = checkboxField.checked;
      }
      if (checkboxField.inline !== undefined) {
        baseField.inline = checkboxField.inline;
      }
      if (checkboxField.options) {
        baseField.options = checkboxField.options;
      }
      break;
    }

    case FieldType.EDITOR: {
      const editorField = field as EditorFieldConfig;
      if (editorField.minHeight !== undefined) {
        baseField.minHeight = editorField.minHeight;
      }
      if (editorField.readOnly !== undefined) {
        baseField.readOnly = editorField.readOnly;
      }
      break;
    }

    case FieldType.RADIO: {
      const radioField = field as RadioFieldConfig;
      if (radioField.options) {
        baseField.options = radioField.options;
      }
      break;
    }

    default:
      // For other field types, only base properties are included
      break;
  }

  return baseField;
};

// Convert DynamicFormConfig to API DynamicFormRequest
export const createFormConfigApiPayload = (
  config: DynamicFormConfig
): DynamicFormRequest => ({
  title: config.title ?? "",
  config: config.fields.map(convertDynamicFieldToApiField),
});
