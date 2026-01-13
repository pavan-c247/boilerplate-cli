import { StepConfig } from "@/types/forms/multistepForm";
import { MultistepFormInputs } from "@/validations/schemas/forms/multistep-form.zod.schema";

/**
 * Default form values
 */
export const MULTISTEP_FORM_DEFAULT_VALUES: MultistepFormInputs = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  zipCode: "",
  country: "",
  dateOfBirth: "",
  bio: "",
  agreeToTerms: false,
  agreeToPrivacy: false,
};

export const MULTISTEP_FORM_STEP_FIELDS = {
  step1: ["firstName", "lastName", "email", "phone"] as const,
  step2: ["address", "city", "state", "zipCode", "country"] as const,
  step3: ["dateOfBirth", "bio"] as const,
  step4: ["agreeToTerms", "agreeToPrivacy"] as const,
};

/**
 * Step IDs
 */
export const MULTISTEP_FORM_STEP_IDS = {
  PERSONAL: "personal",
  ADDRESS: "address",
  ADDITIONAL: "additional",
  TERMS: "terms",
} as const;

/**
 * Country options for the country select field
 */
export const MULTISTEP_FORM_COUNTRY_OPTIONS: Array<{
  label: string;
  value: string;
  disabled?: boolean;
}> = [
  { label: "United States", value: "us" },
  { label: "United Kingdom", value: "uk" },
  { label: "Canada", value: "ca" },
  { label: "Australia", value: "au" },
  { label: "India", value: "in" },
];

/**
 * Date constraints for date of birth field
 */
export const MULTISTEP_FORM_DATE_CONSTRAINTS = {
  MIN_DATE: "1900-01-01",
  getMaxDate: (): string => new Date().toISOString().split("T")[0], // Today's date
};

/**
 * Step Indicator variant types
 */
export const STEP_INDICATOR_VARIANTS = {
  STEPPER: "stepper",
  NUMBERS: "numbers",
  DOTS: "dots",
  TABS: "tabs",
} as const;

/**
 * Step status types
 */
export const STEP_STATUS = {
  COMPLETED: "completed",
  ACTIVE: "active",
  UPCOMING: "upcoming",
} as const;

/**
 * Default navigation button labels
 * These are fallback values if translations are not provided
 */
export const MULTISTEP_FORM_DEFAULT_NAVIGATION_LABELS = {
  NEXT: "Next",
  PREV: "Previous",
  SUBMIT: "Submit",
  SUBMITTING: "Submitting...",
} as const;

/**
 * Step indices (0-based)
 */
export const MULTISTEP_FORM_STEP_INDICES = {
  PERSONAL: 0,
  ADDRESS: 1,
  ADDITIONAL: 2,
  TERMS: 3,
} as const;

/**
 * Input field types
 */
export const INPUT_TYPES = {
  EMAIL: "email",
  TEL: "tel",
  DATE: "date",
} as const;

/**
 * Form field names
 */
export const MULTISTEP_FORM_FIELD_NAMES = {
  FIRST_NAME: "firstName",
  LAST_NAME: "lastName",
  EMAIL: "email",
  PHONE: "phone",
  ADDRESS: "address",
  CITY: "city",
  STATE: "state",
  ZIP_CODE: "zipCode",
  COUNTRY: "country",
  DATE_OF_BIRTH: "dateOfBirth",
  BIO: "bio",
  AGREE_TO_TERMS: "agreeToTerms",
  AGREE_TO_PRIVACY: "agreeToPrivacy",
} as const;

/**
 * Form configuration constants
 */
export const MULTISTEP_FORM_CONFIG = {
  INITIAL_STEP: 0,
  TEXTAREA_ROWS: 4,
  SUBMISSION_DELAY_MS: 1000,
  VALIDATION_MODE: "onChange" as const,
  EMPTY_STRING: "",
} as const;

/**
 * Helper function to create step configuration with translations
 * This function takes a translation function and returns step configs
 */
export const createMultistepFormSteps = (
  t: (key: string) => string
): StepConfig[] => {
  return [
    {
      id: MULTISTEP_FORM_STEP_IDS.PERSONAL,
      title: t("steps.personal.title"),
      description: t("steps.personal.description"),
      fields: [...MULTISTEP_FORM_STEP_FIELDS.step1],
    },
    {
      id: MULTISTEP_FORM_STEP_IDS.ADDRESS,
      title: t("steps.address.title"),
      description: t("steps.address.description"),
      fields: [...MULTISTEP_FORM_STEP_FIELDS.step2],
    },
    {
      id: MULTISTEP_FORM_STEP_IDS.ADDITIONAL,
      title: t("steps.additional.title"),
      description: t("steps.additional.description"),
      fields: [...MULTISTEP_FORM_STEP_FIELDS.step3],
    },
    {
      id: MULTISTEP_FORM_STEP_IDS.TERMS,
      title: t("steps.terms.title"),
      description: t("steps.terms.description"),
      fields: [...MULTISTEP_FORM_STEP_FIELDS.step4],
    },
  ];
};
