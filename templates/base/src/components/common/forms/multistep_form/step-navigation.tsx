"use client";

import classNames from "classnames";
import { FC, MouseEvent } from "react";

import Button from "@/components/pure-components/Button";
import { BUTTON_TYPES, BUTTON_VARIANTS } from "@/constants";
import {
  MULTISTEP_FORM_DEFAULT_NAVIGATION_LABELS,
} from "@/constants/forms/multistepForm";
import { StepNavigationProps } from "@/types/forms/multistepForm";

import styles from "./styles.module.scss";

const StepNavigation: FC<StepNavigationProps> = ({
  nextLabel = MULTISTEP_FORM_DEFAULT_NAVIGATION_LABELS.NEXT,
  prevLabel = MULTISTEP_FORM_DEFAULT_NAVIGATION_LABELS.PREV,
  submitLabel = MULTISTEP_FORM_DEFAULT_NAVIGATION_LABELS.SUBMIT,
  submittingLabel = MULTISTEP_FORM_DEFAULT_NAVIGATION_LABELS.SUBMITTING,
  showPrev = true,
  showNext = true,
  onNext,
  onPrev,
  onSubmit,
  isSubmitting = false,
  disabled = false,
  className,
  buttonVariant = BUTTON_VARIANTS.PRIMARY,

  isFirstStep = false,
  isLastStep = false,
  nextStep = async () => {},
  prevStep = () => {},
  validateAllSteps,
  goToStep,
  onFormSubmit,
}) => {
  const handleNext = async () => {
    if (onNext) {
      onNext();
    } else {
      await nextStep();
    }
  };

  const handlePrev = () => {
    if (onPrev) {
      onPrev();
    } else {
      prevStep();
    }
  };

  const handleSubmit = async (e: MouseEvent<HTMLButtonElement>) => {
    // If this is the last step, validate all steps before submission
    if (isLastStep && validateAllSteps && goToStep) {
      e.preventDefault(); // Prevent default form submission to validate first

      const firstInvalidStep = await validateAllSteps();

      if (firstInvalidStep !== -1) {
        // Navigate to the first invalid step
        goToStep(firstInvalidStep);
        // Don't submit - validation failed
        return;
      }

      // Validation passed - trigger form submission
      if (onFormSubmit) {
        // Use the provided form submit handler (React Hook Form's handleSubmit)
        onFormSubmit();
      } else {
        // Fallback: use requestSubmit which will trigger the form's onSubmit handler
        const form = e.currentTarget.closest("form");
        if (form) {
          form.requestSubmit();
        }
      }
    } else {
      if (onSubmit) {
        onSubmit();
      }
    }
  };

  return (
    <div className={classNames(styles.stepNavigation, className)}>
      <div className={styles.navigationButtons}>
        {showPrev && !isFirstStep && (
          <Button
            type={BUTTON_TYPES.BUTTON}
            variant={BUTTON_VARIANTS.SECONDARY}
            onClick={handlePrev}
            disabled={disabled || isSubmitting}
            className={styles.prevButton}
          >
            {prevLabel}
          </Button>
        )}

        <div className={styles.spacer} />

        {showNext && !isLastStep && (
          <Button
            type={BUTTON_TYPES.BUTTON}
            variant={buttonVariant}
            onClick={handleNext}
            disabled={disabled || isSubmitting}
            className={styles.nextButton}
          >
            {nextLabel}
          </Button>
        )}

        {isLastStep && (
          <Button
            type={BUTTON_TYPES.SUBMIT}
            variant={buttonVariant}
            onClick={handleSubmit}
            disabled={disabled || isSubmitting}
            className={styles.submitButton}
          >
            {isSubmitting ? submittingLabel : submitLabel}
          </Button>
        )}
      </div>
    </div>
  );
};

export default StepNavigation;
