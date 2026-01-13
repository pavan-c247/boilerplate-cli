import {
  CheckboxFieldConfig,
  DynamicFieldConfig,
  FieldType,
  FieldTypeMetadata,
  MultiSelectFieldConfig,
  SelectFieldConfig,
} from "@/types/forms/dynamicForm";

/**
 * Metadata for all available field types
 * Used in the form builder UI to display available field options
 */
export const FIELD_TYPE_METADATA: Record<FieldType, FieldTypeMetadata> = {
  [FieldType.TEXT]: {
    type: FieldType.TEXT,
    label: "Text Input",
    description: "Single-line text input field",
    category: "input",
    defaultConfig: {
      type: FieldType.TEXT,
      name: "text_field",
      label: "Text Field",
      placeholder: "Enter text",
    },
  },
  [FieldType.TEXTAREA]: {
    type: FieldType.TEXTAREA,
    label: "Textarea",
    description: "Multi-line text input field",
    category: "input",
    defaultConfig: {
      type: FieldType.TEXTAREA,
      name: "textarea_field",
      label: "Textarea Field",
      placeholder: "Enter text",
      rows: 3,
    },
  },
  [FieldType.PASSWORD]: {
    type: FieldType.PASSWORD,
    label: "Password",
    description: "Password input field with hidden text",
    category: "input",
    defaultConfig: {
      type: FieldType.PASSWORD,
      name: "password_field",
      label: "Password",
      placeholder: "Enter password",
    },
  },
  [FieldType.SEARCH]: {
    type: FieldType.SEARCH,
    label: "Search",
    description: "Search input field with search icon",
    category: "input",
    defaultConfig: {
      type: FieldType.SEARCH,
      name: "search_field",
      label: "Search",
      placeholder: "Search...",
    },
  },
  [FieldType.EMAIL]: {
    type: FieldType.EMAIL,
    label: "Email",
    description: "Email input field with validation",
    category: "input",
    defaultConfig: {
      type: FieldType.EMAIL,
      name: "email_field",
      label: "Email",
      placeholder: "Enter email address",
    },
  },
  [FieldType.NUMBER]: {
    type: FieldType.NUMBER,
    label: "Number",
    description: "Numeric input field",
    category: "input",
    defaultConfig: {
      type: FieldType.NUMBER,
      name: "number_field",
      label: "Number",
      placeholder: "Enter number",
    },
  },
  [FieldType.DATE]: {
    type: FieldType.DATE,
    label: "Date",
    description: "Date picker field",
    category: "input",
    defaultConfig: {
      type: FieldType.DATE,
      name: "date_field",
      label: "Date",
    },
  },
  [FieldType.DATETIME]: {
    type: FieldType.DATETIME,
    label: "Date & Time",
    description: "Date and time picker field",
    category: "input",
    defaultConfig: {
      type: FieldType.DATETIME,
      name: "datetime_field",
      label: "Date & Time",
    },
  },
  [FieldType.TIME]: {
    type: FieldType.TIME,
    label: "Time",
    description: "Time picker field",
    category: "input",
    defaultConfig: {
      type: FieldType.TIME,
      name: "time_field",
      label: "Time",
    },
  },
  [FieldType.SELECT]: {
    type: FieldType.SELECT,
    label: "Select",
    description: "Single selection dropdown",
    category: "selection",
    defaultConfig: {
      type: FieldType.SELECT,
      name: "select_field",
      label: "Select Option",
      options: [
        { value: "option1", label: "Option 1" },
        { value: "option2", label: "Option 2" },
      ],
    },
  },
  [FieldType.MULTISELECT]: {
    type: FieldType.MULTISELECT,
    label: "Multi Select",
    description: "Multiple selection dropdown",
    category: "selection",
    defaultConfig: {
      type: FieldType.MULTISELECT,
      name: "multiselect_field",
      label: "Select Options",
      options: [
        { value: "option1", label: "Option 1" },
        { value: "option2", label: "Option 2" },
      ],
    },
  },
  [FieldType.CHECKBOX]: {
    type: FieldType.CHECKBOX,
    label: "Checkbox",
    description: "Single checkbox field",
    category: "selection",
    defaultConfig: {
      type: FieldType.CHECKBOX,
      name: "checkbox_field",
      label: "Checkbox",
      checked: false,
      options: [
        { value: "option1", label: "Option 1" },
        { value: "option2", label: "Option 2" },
      ],
    },
  },
  [FieldType.FILE]: {
    type: FieldType.FILE,
    label: "File Upload",
    description: "Single file upload field",
    category: "file",
    defaultConfig: {
      type: FieldType.FILE,
      name: "file_field",
      label: "Upload File",
      accept: "*/*",
    },
  },
  [FieldType.MULTIFILE]: {
    type: FieldType.MULTIFILE,
    label: "Multiple Files",
    description: "Multiple file upload field",
    category: "file",
    defaultConfig: {
      type: FieldType.MULTIFILE,
      name: "multifile_field",
      label: "Upload Files",
      accept: "*/*",
      multiple: true,
    },
  },
  [FieldType.URL]: {
    type: FieldType.URL,
    label: "URL",
    description: "URL input field",
    category: "input",
    defaultConfig: {
      type: FieldType.URL,
      name: "url_field",
      label: "URL",
      placeholder: "https://example.com",
    },
  },
  [FieldType.TEL]: {
    type: FieldType.TEL,
    label: "Phone",
    description: "Phone number input field",
    category: "input",
    defaultConfig: {
      type: FieldType.TEL,
      name: "tel_field",
      label: "Phone Number",
      placeholder: "+1 (555) 000-0000",
    },
  },
  [FieldType.COLOR]: {
    type: FieldType.COLOR,
    label: "Color Picker",
    description: "Color picker field",
    category: "other",
    defaultConfig: {
      type: FieldType.COLOR,
      name: "color_field",
      label: "Color",
    },
  },
  [FieldType.RANGE]: {
    type: FieldType.RANGE,
    label: "Range Slider",
    description: "Range slider input field",
    category: "other",
    defaultConfig: {
      type: FieldType.RANGE,
      name: "range_field",
      label: "Range",
      min: 0,
      max: 100,
      step: 1,
    },
  },
  [FieldType.RADIO]: {
    type: FieldType.RADIO,
    label: "Radio Button",
    description: "Single radio button field",
    category: "selection",
    defaultConfig: {
      type: FieldType.RADIO,
      name: "radio_field",
      label: "Radio Button",
      options: [
        { value: "option1", label: "Option 1" },
        { value: "option2", label: "Option 2" },
      ],
    },
  },
  [FieldType.EDITOR]: {
    type: FieldType.EDITOR,
    label: "Rich Text Editor",
    description: "Block-based rich text editor (EditorJS)",
    category: "editor",
    defaultConfig: {
      type: FieldType.EDITOR,
      name: "editor_field",
      label: "Content",
      placeholder: "Type '/' for commands",
      minHeight: 300,
    },
  },
};

/**
 * Generate a unique field ID
 */
export const generateFieldId = (): string => {
  return `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Generate a unique field name from label
 */
export const generateFieldName = (
  label: string,
  existingNames: string[]
): string => {
  const baseName = label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

  let name = baseName;
  let counter = 1;

  while (existingNames.includes(name)) {
    name = `${baseName}_${counter}`;
    counter++;
  }

  return name;
};

/**
 * Create a default field configuration based on type
 */
export const createDefaultFieldConfig = (
  type: FieldType,
  existingFieldNames: string[] = []
): DynamicFieldConfig => {
  const metadata = FIELD_TYPE_METADATA[type];
  const name = generateFieldName(
    metadata.defaultConfig.label || "field",
    existingFieldNames
  );

  const baseConfig = {
    id: generateFieldId(),
    name,
    ...metadata.defaultConfig,
  };

  switch (type) {
    case FieldType.SELECT:
      return {
        ...baseConfig,
        options: (metadata.defaultConfig as SelectFieldConfig).options || [],
      } as DynamicFieldConfig;

    case FieldType.MULTISELECT:
      return {
        ...baseConfig,
        options:
          (metadata.defaultConfig as MultiSelectFieldConfig).options || [],
      } as DynamicFieldConfig;

    case FieldType.TEXTAREA:
      return {
        ...baseConfig,
        rows: 3,
      } as DynamicFieldConfig;

    case FieldType.NUMBER:
      return {
        ...baseConfig,
        min: undefined,
        max: undefined,
        step: 1,
      } as DynamicFieldConfig;

    case FieldType.DATE:
    case FieldType.DATETIME:
    case FieldType.TIME:
      return {
        ...baseConfig,
        minDate: undefined,
        maxDate: undefined,
      } as DynamicFieldConfig;

    case FieldType.FILE:
    case FieldType.MULTIFILE:
      return {
        ...baseConfig,
        accept: "*/*",
        maxSize: 10,
        multiple: type === FieldType.MULTIFILE,
      } as DynamicFieldConfig;

    case FieldType.RANGE:
      return {
        ...baseConfig,
        min: 0,
        max: 100,
        step: 1,
      } as DynamicFieldConfig;

    case FieldType.EDITOR:
      return {
        ...baseConfig,
        placeholder: "Type '/' for commands",
        minHeight: 300,
        readOnly: false,
      } as DynamicFieldConfig;

    case FieldType.CHECKBOX:
      return {
        ...baseConfig,
        options: (metadata.defaultConfig as CheckboxFieldConfig).options || [],
      } as DynamicFieldConfig;

    default:
      return baseConfig as DynamicFieldConfig;
  }
};
