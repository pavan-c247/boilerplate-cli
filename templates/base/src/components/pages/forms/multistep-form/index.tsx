"use client";

import { useTranslations } from "next-intl";
import { FC, useMemo } from "react";
import { Container } from "react-bootstrap";
import { FormProvider, SubmitHandler, useFormContext } from "react-hook-form";

import {
  StepContent,
  StepIndicator,
  StepNavigation,
} from "@/components/common/forms/multistep_form";
import Card from "@/components/pure-components/Card";
import { Form } from "@/components/pure-components/Form";
import { BUTTON_VARIANTS } from "@/constants";
import {
  createMultistepFormSteps,
  MULTISTEP_FORM_CONFIG,
  MULTISTEP_FORM_DEFAULT_VALUES,
  STEP_INDICATOR_VARIANTS,
} from "@/constants/forms/multistepForm";
import { useMultistepForm } from "@/hooks/useMultistepForm";
import {
  createMultistepFormStepRules,
  MultistepFormInputs,
} from "@/validations/schemas/forms/multistep-form.zod.schema";

import { renderStepContent } from "./stepContentRenderer";
import styles from "./styles.module.scss";

const MultistepFormContent: FC<{
  multistepForm: ReturnType<typeof useMultistepForm<MultistepFormInputs>>;
}> = ({ multistepForm }) => {
  const t = useTranslations("forms.multistepForm");
  const tValidations = useTranslations("validations");

  // Get form methods from RHF FormProvider
  const {
    handleSubmit,
    register,
    control,
    trigger,
    formState: { errors },
  } = useFormContext<MultistepFormInputs>();

  // Extract step navigation from hook
  const {
    currentStep,
    totalSteps,
    steps,
    goToStep,
    nextStep,
    prevStep,
    isFirstStep,
    isLastStep,
    completedSteps,
    isStepComplete,
    validateAllSteps,
    reset: resetFormAndSteps, // Hook's reset resets both form and steps
  } = multistepForm;

  // Create rules with translations
  const multistepFormStepRules = useMemo(
    () =>
      createMultistepFormStepRules(
        (key: string, values?: Record<string, string | number>) => {
          return tValidations(key, values);
        }
      ),
    [tValidations]
  );

  const onSubmit: SubmitHandler<MultistepFormInputs> = async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    alert(t("messages.submitSuccess") + "\n\n" + JSON.stringify(data, null, 2));

    resetFormAndSteps();
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      {/* Step Indicator */}
      <StepIndicator
        variant={STEP_INDICATOR_VARIANTS.DOTS}
        showLabels
        showDescriptions
        clickable
        currentStep={currentStep}
        totalSteps={totalSteps}
        steps={steps}
        goToStep={goToStep}
        isStepComplete={isStepComplete}
      />

      {/* Dynamic Step Content */}
      {steps.map((step, index) => (
        <StepContent key={step.id} step={index} currentStep={currentStep}>
          {renderStepContent({
            stepIndex: index,
            steps,
            t,
            register,
            control,
            trigger,
            errors,
            multistepFormStepRules,
          })}
        </StepContent>
      ))}

      {/* Navigation Buttons */}
      <StepNavigation
        nextLabel={t("navigation.next")}
        prevLabel={t("navigation.prev")}
        submitLabel={t("navigation.submit")}
        submittingLabel={t("navigation.submitting")}
        buttonVariant={BUTTON_VARIANTS.PRIMARY}
        isFirstStep={isFirstStep}
        isLastStep={isLastStep}
        nextStep={nextStep}
        prevStep={prevStep}
        validateAllSteps={validateAllSteps}
        goToStep={goToStep}
        onFormSubmit={() => handleSubmit(onSubmit)()}
      />
    </Form> 
  );
};

const MultistepForm: FC = () => {
  const t = useTranslations("forms.multistepForm");

  // Step configuration with translations
  const steps = useMemo(() => createMultistepFormSteps(t), [t]);

  const multistepForm = useMultistepForm<MultistepFormInputs>({
    steps,
    defaultValues: MULTISTEP_FORM_DEFAULT_VALUES,
    initialStep: MULTISTEP_FORM_CONFIG.INITIAL_STEP,
    formOptions: {
      mode: MULTISTEP_FORM_CONFIG.VALIDATION_MODE,
    },
  });

  const {
    // Step navigation properties to exclude
    currentStep: _currentStep,
    totalSteps: _totalSteps,
    steps: _steps,
    goToStep: _goToStep,
    nextStep: _nextStep,
    prevStep: _prevStep,
    isFirstStep: _isFirstStep,
    isLastStep: _isLastStep,
    completedSteps: _completedSteps,
    validateStep: _validateStep,
    validateAllSteps: _validateAllSteps,
    markStepComplete: _markStepComplete,
    isStepComplete: _isStepComplete,
    reset: _reset, // Exclude the overridden reset
    resetForm,
    // Keep all RHF methods including the ones we need
    ...restMethods
  } = multistepForm;

  const formMethods = {
    ...restMethods,
    reset: resetForm,
  } as ReturnType<
    typeof useMultistepForm<MultistepFormInputs>
  >["resetForm"] extends Function
    ? Omit<
        ReturnType<typeof useMultistepForm<MultistepFormInputs>>,
        | "currentStep"
        | "totalSteps"
        | "steps"
        | "goToStep"
        | "nextStep"
        | "prevStep"
        | "isFirstStep"
        | "isLastStep"
        | "completedSteps"
        | "validateStep"
        | "markStepComplete"
        | "isStepComplete"
        | "reset"
      > & { reset: typeof resetForm }
    : never;

  return (
    <Container fluid className={styles.multistepFormContainer}>
      <div className={styles.formHeader}>
        <h1 className={styles.formTitle}>{t("title")}</h1>
        <p className={styles.formDescription}>{t("description")}</p>
      </div>

      <Card className={`shadow-sm ${styles.formCard}`}>
        <FormProvider {...formMethods}>
          <MultistepFormContent multistepForm={multistepForm} />
        </FormProvider>
      </Card>
    </Container>
  );
};

export default MultistepForm;
