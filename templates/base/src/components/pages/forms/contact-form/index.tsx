"use client";

import { useTranslations } from "next-intl";
import React, { FC, useMemo } from "react";
import { Container } from "react-bootstrap";

import CommonToast from "@/components/common/toast";
import DynamicFormRenderer from "@/components/pages/forms/DynamicForm/DynamicFormRenderer";
import LoadingSpinner from "@/components/pure-components/LoadingSpinner";
import { CONTACT_FORM_ID } from "@/constants/forms/contactForm";
import { useFormConfigQuery } from "@/hooks/dynamicForm";
import { useToast } from "@/hooks/useToast";
import { renderDynamicFormFields } from "@/services/dynamicForm";

const ContactForm: FC = () => {
  const tCommon = useTranslations("common");
  const { toast, showSuccess, showError, hideToast } = useToast();

  // Fetch form configuration from database
  const {
    data: apiResponse,
    isLoading,
    error,
  } = useFormConfigQuery(CONTACT_FORM_ID);

  // Convert API response to DynamicFormConfig
  const formConfig = useMemo(() => {
    if (!apiResponse) return undefined;
    return renderDynamicFormFields(apiResponse);
  }, [apiResponse]);

  const handleSubmit = async (data: Record<string, any>) => {
    try {
      showSuccess(tCommon("success.submitSuccess"));
    } catch (error: any) {
      console.error("Form submission error:", error);
      showError(error?.message || tCommon("errors.serverError"));
    }
  };

  // Show loading state
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Show error state
  if (error || !formConfig) {
    return (
      <Container
        fluid
        className="d-flex justify-content-center align-items-center"
      >
        <div>{tCommon("errors.notFoundPage")}</div>
      </Container>
    );
  }

  return (
    <>
      <Container fluid>
        <DynamicFormRenderer
          config={formConfig}
          onSubmit={handleSubmit}
          formOptions={{
            mode: "onSubmit",
            reValidateMode: "onChange",
            shouldFocusError: true,
          }}
        />
      </Container>
      <CommonToast
        show={toast.show}
        message={toast.message}
        variant={toast.variant}
        onClose={hideToast}
      />
    </>
  );
};

export default ContactForm;
