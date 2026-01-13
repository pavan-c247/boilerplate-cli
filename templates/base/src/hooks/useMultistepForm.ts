/**

 * 
 * @example
 * ```tsx
 * const {
 *   // RHF methods
 *   control,
 *   handleSubmit,
 *   reset,
 *   // Step navigation
 *   currentStep,
 *   nextStep,
 *   prevStep,
 *   isFirstStep,
 *   isLastStep,
 * } = useMultistepForm(steps, defaultValues);
 * ```
 */

import { useCallback,useState } from 'react';
import {FieldValues, Path, useForm } from 'react-hook-form';

import { 
  UseMultistepFormOptions, 
  UseMultistepFormReturn 
} from '@/types/forms/multistepForm';


export function useMultistepForm<T extends FieldValues = FieldValues>(
  options: UseMultistepFormOptions<T>
): UseMultistepFormReturn<T> {
  const { steps, defaultValues, initialStep = 0, formOptions = {} } = options;



  const formMethods = useForm<T>({
    ...formOptions,
    defaultValues: formOptions?.defaultValues ?? defaultValues,
    mode: formOptions?.mode ?? 'onChange',
  });

  // Step navigation state
  const [currentStep, setCurrentStep] = useState<number>(initialStep);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const totalSteps = steps.length;
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;

//validate steps firssst here
  const validateStep = useCallback(
    async (step: number): Promise<boolean> => {
      // Safety check: ensure step index is valid
      if (step < 0 || step >= steps.length) {
        console.warn(`Invalid step index: ${step}. Total steps: ${steps.length}`);
        return false;
      }

      const stepConfig = steps[step];

      // Safety check: ensure step config exists
      if (!stepConfig) {
        console.warn(`Step config not found for index: ${step}`);
        return false;
      }

      // If step has custom validation function, use it
      if (stepConfig.validate) {
        try {
          return await stepConfig.validate();
        } catch (error) {
          console.error('Custom validation error:', error);
          return false;
        }
      }

      
      if (stepConfig.fields && stepConfig.fields.length > 0) {
        try {
       
          const result = await formMethods.trigger(
            stepConfig.fields as Path<T>[]
          );
          return result;
        } catch (error) {
          console.error('RHF validation error:', error);
          return false;
        }
      }

      // Default: allow navigation (no validation required)
      return true;
    },
    [steps, formMethods]
  );

  /**
   * Navigate to specific step
   */
  const goToStep = useCallback(
    (step: number) => {
      if (step >= 0 && step < totalSteps) {
        setCurrentStep(step);
      }
    },
    [totalSteps]
  );

  /**
   * Move to previous step
   */
  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  }, [currentStep]);

  /**
   * Mark step as completed
   */
  const markStepComplete = useCallback((step: number) => {
    setCompletedSteps((prev) => {
      if (!prev.includes(step)) {
        return [...prev, step];
      }
      return prev;
    });
  }, []);

  /**
   * Move to next step (with validation)
   */
  const nextStep = useCallback(async () => {
    if (currentStep < totalSteps - 1) {
      // Validate current step before moving
      const isValid = await validateStep(currentStep);
      if (isValid) {
        markStepComplete(currentStep);
        setCurrentStep((prev) => prev + 1);
      }
    }
  }, [currentStep, totalSteps, validateStep, markStepComplete]);

  /**
   * Check if step is completed
   */
  const isStepComplete = useCallback(
    (step: number): boolean => {
      return completedSteps.includes(step);
    },
    [completedSteps]
  );

  /**
   * Validate all steps and return the first invalid step index
   * Returns -1 if all steps are valid
   */
  const validateAllSteps = useCallback(async (): Promise<number> => {
    for (let i = 0; i < steps.length; i++) {
      const isValid = await validateStep(i);
      if (!isValid) {
        return i;
      }
    }
    return -1; // All steps are valid
  }, [steps, validateStep]);

 
  const resetFormAndSteps = useCallback(() => {
    formMethods.reset();
    setCurrentStep(initialStep);
    setCompletedSteps([]);
  }, [formMethods, initialStep]);

  const { reset: resetForm, ...restFormMethods } = formMethods;

  return {
    ...restFormMethods,
    reset: resetFormAndSteps, 
    resetForm, 
    currentStep,
    totalSteps,
    steps,
    goToStep,
    nextStep,
    prevStep,
    isFirstStep,
    isLastStep,
    completedSteps,
    validateStep,
    validateAllSteps,
    markStepComplete,
    isStepComplete,
  };
}
