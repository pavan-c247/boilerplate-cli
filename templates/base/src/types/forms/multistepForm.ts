import { ReactNode } from "react";
import {
  Control,
  DefaultValues,
  FieldErrors,
  FieldValues,
  useForm,
  UseFormRegister,
  UseFormReturn,
  UseFormTrigger,
} from "react-hook-form";

import { BUTTON_VARIANTS } from "@/constants";
import { MultistepFormInputs } from "@/validations/schemas/forms/multistep-form.zod.schema";

/**
 * Step configuration
 */
export interface StepConfig {
  id: string;
  title: string;
  description?: string;
  fields: string[];
  icon?: ReactNode;
  skippable?: boolean;
  validate?: () => Promise<boolean>;
}

/**
 * Multistep form context value
 */
export interface MultistepFormContextValue {
  currentStep: number;
  totalSteps: number;
  steps: StepConfig[];
  goToStep: (step: number) => void;
  nextStep: () => Promise<void>;
  prevStep: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  completedSteps: number[];
  validateStep: (step: number) => Promise<boolean>;
  markStepComplete: (step: number) => void;
  isStepComplete: (step: number) => boolean;
  reset: () => void;
}

/**
 * Step indicator props
 */
export interface StepIndicatorProps {
  /** Variant style */
  variant?: "numbers" | "dots" | "tabs" | "stepper";
  showLabels?: boolean;
  showDescriptions?: boolean;
  className?: string;
  onStepClick?: (step: number) => void;
  clickable?: boolean;
  currentStep?: number;
  /** Total steps (if not using context) */
  totalSteps?: number;
  steps?: StepConfig[];
  goToStep?: (step: number) => void;
  isStepComplete?: (step: number) => boolean;
}

/**
 * Step navigation props
 */
export interface StepNavigationProps {
  nextLabel?: string;
  prevLabel?: string;
  submitLabel?: string;
  submittingLabel?: string;
  showPrev?: boolean;
  showNext?: boolean;
  onNext?: () => void;
  onPrev?: () => void;
  onSubmit?: () => void;
  isSubmitting?: boolean;
  disabled?: boolean;
  className?: string;
  buttonVariant?:
    | typeof BUTTON_VARIANTS.PRIMARY
    | typeof BUTTON_VARIANTS.SECONDARY;
  isFirstStep?: boolean;
  isLastStep?: boolean;
  nextStep?: () => Promise<void>;
  prevStep?: () => void;
  validateAllSteps?: () => Promise<number>;
  goToStep?: (step: number) => void;
  onFormSubmit?: () => void;
}

/**
 * Step content props
 */
export interface StepContentProps {
  /** Step index this content belongs to */
  step: number;
  children: ReactNode;
  className?: string;
  animate?: boolean;
  animationDuration?: number;
  currentStep?: number;
}

/**
 * Multistep form provider props
 */
export interface MultistepFormProviderProps {
  steps: StepConfig[];
  initialStep?: number;
  children: ReactNode;
  validateStep?: (step: number, fields: string[]) => Promise<boolean>;
}

/**
 * Options for useMultistepForm hook
 */
export interface UseMultistepFormOptions<T extends FieldValues> {
  steps: StepConfig[];
  defaultValues: DefaultValues<T>;
  initialStep?: number;
  formOptions?: Parameters<typeof useForm<T>>[0];
}

/**
 * Return type for useMultistepForm hook
 */
export interface UseMultistepFormReturn<T extends FieldValues>
  extends Omit<UseFormReturn<T>, "reset"> {
  currentStep: number;
  totalSteps: number;
  steps: StepConfig[];
  goToStep: (step: number) => void;
  nextStep: () => Promise<void>;
  prevStep: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  completedSteps: number[];
  validateStep: (step: number) => Promise<boolean>;
  validateAllSteps: () => Promise<number>;
  markStepComplete: (step: number) => void;
  isStepComplete: (step: number) => boolean;
  /** Reset form and step navigation to initial state (overrides RHF reset) */
  reset: () => void;
  /** Original RHF reset method (only resets form, not steps) */
  resetForm: UseFormReturn<T>["reset"];
}

/**
 * Step content renderer props
 */
export interface StepContentRendererProps {
  stepIndex: number;
  steps: StepConfig[];
  t: (key: string) => string;
  register: UseFormRegister<MultistepFormInputs>;
  control: Control<MultistepFormInputs>;
  trigger: UseFormTrigger<MultistepFormInputs>;
  errors: FieldErrors<MultistepFormInputs>;
  multistepFormStepRules: ReturnType<
    typeof import("@/validations/schemas/forms/multistep-form.zod.schema").createMultistepFormStepRules
  >;
}
