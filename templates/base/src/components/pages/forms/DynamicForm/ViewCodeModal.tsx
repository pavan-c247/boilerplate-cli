"use client";

import { useTranslations } from "next-intl";
import React, { FC, useCallback, useMemo, useState } from "react";
import { FaCopy } from "react-icons/fa";

import Button from "@/components/pure-components/Button";
import Modal from "@/components/pure-components/Modal";
import { BUTTON_VARIANTS } from "@/constants";
import type { ViewCodeModalProps } from "@/types/forms/dynamicForm";

import styles from "./styles.module.scss";

export const ViewCodeModal: FC<ViewCodeModalProps> = ({
  show,
  onClose,
  formId,
}) => {
  const t = useTranslations("dynamicForm");
  const tCommon = useTranslations("common");
  const [copied, setCopied] = useState(false);

  // Generate formatted React/TypeScript code from config
  // Only generates code when formId is provided (edit mode)
  const generatedCode = useMemo(() => {
    if (!formId) {
      return "";
    }

    return `"use client";

import { useTranslations } from "next-intl";
import React, { FC, useMemo } from "react";
import { Container } from "react-bootstrap";

import CommonToast from "@/components/common/toast";
import DynamicFormRenderer from "@/components/pages/forms/DynamicForm/DynamicFormRenderer";
import LoadingSpinner from "@/components/pure-components/LoadingSpinner";
import { useFormConfigQuery } from "@/hooks/dynamicForm";
import { useToast } from "@/hooks/useToast";
import { renderDynamicFormFields } from "@/services/dynamicForm";

const FORM_ID = "${formId}";

const Form: FC = () => {
  const tCommon = useTranslations("common");
  
    const { toast, showSuccess, showError, hideToast } = useToast();
  
  // Fetch form configuration from database
  const {
    data: formConfigData,
    isLoading,
    error,
  } = useFormConfigQuery(FORM_ID);

  // Convert API response to DynamicFormConfig
  const formConfig = useMemo(() => {
    if (!formConfigData) return undefined;
    return renderDynamicFormFields(formConfigData);
  }, [formConfigData]);

  const handleSubmit = async (data: Record<string, any>) => {
    try {
      // Add your form submission logic here
      console.log("Form submitted:", data);
      
      // Example: API call
      // const response = await fetch('/api/submit-form', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data),
      // });
      // 
      // if (!response.ok) {
      //   throw new Error('Submission failed');
      // }
      
      // Show success toast
      showSuccess(tCommon("success.submitSuccess"));
    } catch (error: any) {
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
      <Container fluid className="d-flex justify-content-center align-items-center">
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

export default Form;`;
  }, [formId]);

  // Handle copy to clipboard
  const handleCopyCode = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(generatedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy code:", error);
      // Fallback for older browsers - using global class for utility element
      const textArea = document.createElement("textarea");
      textArea.value = generatedCode;
      textArea.className = "view-code-fallback-textarea";
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand("copy");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Fallback copy failed:", err);
      }
      document.body.removeChild(textArea);
    }
  }, [generatedCode]);

  return (
    <Modal
      show={show}
      onClose={onClose}
      title={t("viewCode")}
      size="lg"
      footer={
        <div className={styles.footer}>
          <Button variant={BUTTON_VARIANTS.PRIMARY} onClick={onClose}>
            {tCommon("actions.cancel")}
          </Button>
        </div>
      }
    >
      <div className={styles.container}>
        <pre className={styles.codeBlock}>
          <code>{generatedCode}</code>
        </pre>
        <div className={styles.copyButtonWrapper}>
          <Button
            variant={BUTTON_VARIANTS.SECONDARY}
            onClick={handleCopyCode}
            icon={<FaCopy />}
          >
            {copied ? t("copied") : t("copy")}
          </Button>
        </div>
      </div>
      <div className={styles.description}>{t("viewCodeDescription")}</div>
    </Modal>
  );
};

export default ViewCodeModal;
