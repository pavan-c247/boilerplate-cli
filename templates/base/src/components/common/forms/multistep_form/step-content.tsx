"use client";

import classNames from "classnames";
import { FC, useEffect, useRef } from "react";

import { StepContentProps } from "@/types/forms/multistepForm";

import styles from "./styles.module.scss";

/**
 * Step Content - Conditionally renders content based on current step
 */
const StepContent: FC<StepContentProps> = ({
  step,
  children,
  className,
  animate = true,
  animationDuration = 300,
  // Required prop from hook
  currentStep = 0,
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const isActive = currentStep === step;

  useEffect(() => {
    if (isActive && contentRef.current) {
      // Focus first input when step becomes active
      const firstInput = contentRef.current.querySelector<HTMLElement>(
        "input, textarea, select, button"
      );
      if (firstInput && firstInput.focus) {
        // Delay only if animation is enabled, otherwise focus immediately
        const delay = animate ? animationDuration : 0;
        setTimeout(() => {
          firstInput.focus();
        }, delay);
      }
    }
  }, [isActive, animate, animationDuration]);

  if (!isActive) {
    return null;
  }

  return (
    <div
      ref={contentRef}
      className={classNames(
        styles.stepContent,
        {
          [styles.animate]: animate,
        },
        className
      )}
      style={
        animate
          ? {
              animationDuration: `${animationDuration}ms`,
            }
          : undefined
      }
      role="tabpanel"
      aria-labelledby={`step-${step}`}
    >
      {children}
    </div>
  );
};

export default StepContent;
