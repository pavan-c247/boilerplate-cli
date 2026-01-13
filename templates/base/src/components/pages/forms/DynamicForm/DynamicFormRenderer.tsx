"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import React, { FC } from "react";
import { Col, Row } from "react-bootstrap";
import { FormProvider, useForm, UseFormProps } from "react-hook-form";

import { RenderField } from "@/components/pages/forms/DynamicForm/FieldRenderers";
import Button from "@/components/pure-components/Button";
import { Form } from "@/components/pure-components/Form";
import { BUTTON_VARIANTS } from "@/constants";
import type {
  DynamicFieldConfig,
  DynamicFormRendererProps,
  FieldValues,
  SubmitHandler,
} from "@/types/forms/dynamicForm";

/**
 * Dynamic Form Renderer Component
 * Renders a form based on the provided configuration
 */
export const DynamicFormRenderer: FC<DynamicFormRendererProps> = ({
  config,
  onSubmit,
  defaultValues = {},
  className,
  zodSchema,
  formOptions,
}) => {
  const t = useTranslations("dynamicForm");
  const tCommon = useTranslations("common");
  const tValidations = useTranslations("validations");

  const formDefaultValues = {
    ...defaultValues,
    ...config.fields.reduce((acc, field) => {
      // Check if field has defaultValue property (some field types have it)
      const fieldWithDefault = field as { defaultValue?: any };
      if (fieldWithDefault.defaultValue !== undefined) {
        acc[field.name] = fieldWithDefault.defaultValue;
      }
      return acc;
    }, {} as FieldValues),
  };

  const useFormOptions: UseFormProps<FieldValues> = {
    defaultValues: formDefaultValues,
    ...formOptions,
  };

  // Add zodResolver if zodSchema is provided
  if (zodSchema) {
    useFormOptions.resolver = zodResolver(zodSchema as any);
  }

  const methods = useForm<FieldValues>(useFormOptions);

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
    register,
    watch,
    trigger,
  } = methods;

  const handleFormSubmit: SubmitHandler<FieldValues> = async (
    data: FieldValues,
    event
  ) => {
    // Prevent default form submission
    event?.preventDefault();
    try {
      if (onSubmit) {
        await onSubmit(data);
      }
    } catch (error) {
      console.error("Form submission error:", error);
      // Re-throw error so react-hook-form can handle it
      throw error;
    }
  };

  // Pass useZodValidation flag to RenderField when zodSchema is provided
  const useZodValidation = !!zodSchema;

  return (
    <FormProvider {...methods}>
      <Form onSubmit={handleSubmit(handleFormSubmit)} className={className}>
        <Col xs={12}>
          {config.title && (
            <div className="mb-4">
              <h2>{config.title}</h2>
              {config.description && (
                <p className="text-muted">{config.description}</p>
              )}
            </div>
          )}

          {(() => {
            // Group fields into rows based on gridSize
            const rows: DynamicFieldConfig[][] = [];
            let currentRow: DynamicFieldConfig[] = [];
            let currentRowWidth = 0;

            config.fields.forEach((field) => {
              const gridSize = field.gridSize || 12; // Default to full width
              // If adding this field would exceed 12 columns, start a new row
              if (currentRowWidth + gridSize > 12 && currentRow.length > 0) {
                rows.push(currentRow);
                currentRow = [];
                currentRowWidth = 0;
              }
              currentRow.push(field);
              currentRowWidth += gridSize;
            });

            // Add the last row if it has fields
            if (currentRow.length > 0) {
              rows.push(currentRow);
            }

            return rows.map((row, rowIndex) => (
              <Row key={`row-${rowIndex}`} className="mb-3">
                {row.map((field) => {
                  const gridSize = field.gridSize || 12;
                  return (
                    <Col key={field.id} xs={12} md={gridSize}>
                      {RenderField(
                        field,
                        control,
                        errors,
                        register,
                        watch,
                        t,
                        useZodValidation,
                        tValidations,
                        trigger
                      )}
                    </Col>
                  );
                })}
              </Row>
            ));
          })()}

          <div className="d-flex gap-2 mt-4">
            {config.showResetButton && (
              <Button
                type="button"
                variant={BUTTON_VARIANTS.SECONDARY}
                onClick={() => methods.reset()}
                disabled={isSubmitting}
              >
                {config.resetButtonText || tCommon("actions.reset")}
              </Button>
            )}
            <Button
              type="submit"
              variant={BUTTON_VARIANTS.PRIMARY}
              disabled={isSubmitting}
            >
              {isSubmitting
                ? tCommon("loading.submitting")
                : config.submitButtonText || tCommon("actions.submit")}
            </Button>
          </div>
        </Col>
      </Form>
    </FormProvider>
  );
};

export default DynamicFormRenderer;
