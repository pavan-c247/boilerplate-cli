"use client";

import classNames from "classnames";
import { FC, Fragment } from "react";

import { CheckmarkCircle } from "@/components/pure-components/Icons";
import { BUTTON_TYPES } from "@/constants";
import {
  STEP_INDICATOR_VARIANTS,
  STEP_STATUS,
} from "@/constants/forms/multistepForm";
import { StepIndicatorProps } from "@/types/forms/multistepForm";

import styles from "./styles.module.scss";

/**
 * Step Indicator - Shows progress through form steps
 */
const StepIndicator: FC<StepIndicatorProps> = ({
  variant = STEP_INDICATOR_VARIANTS.STEPPER,
  showLabels = true,
  showDescriptions = false,
  className,
  onStepClick,
  clickable = false,
  currentStep = 0,
  totalSteps = 0,
  steps = [],
  goToStep = () => {},
  isStepComplete = () => false,
}) => {
  const handleStepClick = (stepIndex: number) => {
    if (clickable && onStepClick) {
      onStepClick(stepIndex);
    } else if (clickable) {
      goToStep(stepIndex);
    }
  };

  const getStepStatus = (stepIndex: number) => {
    if (stepIndex === currentStep) return STEP_STATUS.ACTIVE;
    if (isStepComplete(stepIndex)) return STEP_STATUS.COMPLETED;
    return STEP_STATUS.UPCOMING;
  };

  const renderStepNumber = (stepIndex: number, status: string) => {
    if (status === STEP_STATUS.COMPLETED && stepIndex !== currentStep) {
      return (
        <span className={styles.stepIcon}>
          <CheckmarkCircle size={20} color="currentColor" />
        </span>
      );
    }
    return <span className={styles.stepNumber}>{stepIndex + 1}</span>;
  };

  const renderStepper = () => {
    return (
      <div
        className={classNames(styles.stepIndicator, styles.stepper, className)}
      >
        {steps.map((step, index) => {
          const status = getStepStatus(index);
          const isActive = index === currentStep;
          const isClickable =
            clickable && (isStepComplete(index) || index < currentStep);

          return (
            <Fragment key={step.id}>
              <div
                className={classNames(styles.step, styles[status], {
                  [styles.active]: isActive,
                  [styles.clickable]: isClickable,
                })}
                onClick={() => isClickable && handleStepClick(index)}
                role={isClickable ? "button" : undefined}
                tabIndex={isClickable ? 0 : undefined}
                onKeyDown={(e) => {
                  if (isClickable && (e.key === "Enter" || e.key === " ")) {
                    e.preventDefault();
                    handleStepClick(index);
                  }
                }}
              >
                <div className={styles.stepContent}>
                  {renderStepNumber(index, status)}
                  {showLabels && (
                    <div className={styles.stepLabel}>
                      <span className={styles.stepTitle}>{step.title}</span>
                      {showDescriptions && step.description && (
                        <span className={styles.stepDescription}>
                          {step.description}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
              {index < totalSteps - 1 && (
                <div
                  className={classNames(styles.stepConnector, {
                    [styles.completed]: isStepComplete(index),
                  })}
                />
              )}
            </Fragment>
          );
        })}
      </div>
    );
  };

  const renderNumbers = () => {
    return (
      <div
        className={classNames(styles.stepIndicator, styles.numbers, className)}
      >
        {steps.map((step, index) => {
          const status = getStepStatus(index);
          const isActive = index === currentStep;
          const isClickable =
            clickable && (isStepComplete(index) || index < currentStep);

          return (
            <div
              key={step.id}
              className={classNames(styles.step, styles[status], {
                [styles.active]: isActive,
                [styles.clickable]: isClickable,
              })}
              onClick={() => isClickable && handleStepClick(index)}
            >
              {renderStepNumber(index, status)}
              {showLabels && (
                <span className={styles.stepTitle}>{step.title}</span>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const renderDots = () => {
    return (
      <div className={classNames(styles.stepIndicator, styles.dots, className)}>
        {steps.map((step, index) => {
          const status = getStepStatus(index);
          const isActive = index === currentStep;
          const isClickable =
            clickable && (isStepComplete(index) || index < currentStep);

          return (
            <button
              key={step.id}
              type={BUTTON_TYPES.BUTTON}
              className={classNames(styles.dot, styles[status], {
                [styles.active]: isActive,
                [styles.clickable]: isClickable,
              })}
              onClick={() => isClickable && handleStepClick(index)}
              disabled={!isClickable}
              aria-label={`Step ${index + 1}: ${step.title}`}
            />
          );
        })}
      </div>
    );
  };

  const renderTabs = () => {
    const tabsClickable = clickable !== false;

    return (
      <div
        className={classNames(styles.stepIndicator, styles.tabs, className)}
        role="tablist"
      >
        {steps.map((step, index) => {
          const isActive = index === currentStep;

          const isClickable =
            tabsClickable || isStepComplete(index) || index < currentStep;

          return (
            <button
              key={step.id}
              type={BUTTON_TYPES.BUTTON}
              className={classNames(styles.tab, {
                [styles.tabActive]: isActive,
                [styles.tabInactive]: !isActive,
                [styles.tabClickable]: isClickable,
              })}
              onClick={() => {
                if (onStepClick) {
                  onStepClick(index);
                } else if (isClickable) {
                  goToStep(index);
                }
              }}
              disabled={!isClickable}
              aria-label={`Step ${index + 1}: ${step.title}`}
              aria-selected={isActive}
              role="tab"
              id={`tab-${step.id}`}
              aria-controls={`tabpanel-${step.id}`}
            >
              {step.title}
            </button>
          );
        })}
      </div>
    );
  };

  switch (variant) {
    case STEP_INDICATOR_VARIANTS.NUMBERS:
      return renderNumbers();
    case STEP_INDICATOR_VARIANTS.DOTS:
      return renderDots();
    case STEP_INDICATOR_VARIANTS.TABS:
      return renderTabs();
    case STEP_INDICATOR_VARIANTS.STEPPER:
    default:
      return renderStepper();
  }
};

export default StepIndicator;
