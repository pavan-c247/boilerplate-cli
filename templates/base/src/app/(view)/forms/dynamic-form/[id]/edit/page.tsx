"use client";

import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import React, { useEffect, useMemo } from "react";
import { Container } from "react-bootstrap";

import CommonToast from "@/components/common/toast";
import { DynamicFormBuilder } from "@/components/pages/forms/DynamicForm/DynamicForm";
import LoadingSpinner from "@/components/pure-components/LoadingSpinner";
import {
  useAddUpdateFormConfigMutation,
  useFormConfigQuery,
} from "@/hooks/dynamicForm";
import { useToast } from "@/hooks/useToast";
import {
  createFormConfigApiPayload,
  renderDynamicFormFields,
} from "@/services/dynamicForm";
import type { DynamicFormConfig } from "@/types/forms/dynamicForm";
import logger from "@/utils/logger";

export default function DynamicFormBuilderPage() {
  const t = useTranslations("dynamicForm");
  const tCommon = useTranslations("common");
  const params = useParams();

  const { toast, showSuccess, showError, hideToast } = useToast();

  // Get form ID from URL params
  const formId =
    typeof params?.id === "string" && !Array.isArray(params.id)
      ? params.id
      : "";

  // Query form config
  const {
    data: formConfigData,
    isLoading,
    error: queryError,
  } = useFormConfigQuery(formId);
  const {
    mutateAsync: addUpdateFormConfig,
    error: updateError,
    isPending: isUpdating,
  } = useAddUpdateFormConfigMutation();

  const initialConfig = useMemo(() => {
    return formConfigData
      ? renderDynamicFormFields(formConfigData)
      : undefined;
  }, [formConfigData]);

  // Handle mutation error - must be called before any conditional returns
  useEffect(() => {
    if (updateError) {
      logger.error("Update form config error:", updateError);
      showError(
        updateError instanceof Error
          ? updateError.message
          : tCommon("errors.serverError")
      );
    }
  }, [updateError, showError, tCommon]);

  const handleSave = async (config: DynamicFormConfig) => {
    try {
      const data = createFormConfigApiPayload(config);
      const response = await addUpdateFormConfig({
        id: formId,
        ...data,
      });
      showSuccess(response.message || t("formSavedSuccess"));
    } catch (error: any) {
      logger.error("Failed to edit form config:", error);
      showError(error?.message || tCommon("errors.serverError"));
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Show error state for query
  if (queryError) {
    return (
      <Container fluid>
        <div>{tCommon("errors.notFound")}</div>
      </Container>
    );
  }

  return (
    <Container fluid>
      {isUpdating && <LoadingSpinner />}
      <DynamicFormBuilder
        initialConfig={initialConfig}
        onSave={handleSave}
        formId={formId}
      />
      <CommonToast
        show={toast.show}
        message={toast.message}
        variant={toast.variant}
        onClose={hideToast}
      />
    </Container>
  );
}
