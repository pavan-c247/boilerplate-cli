"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import React from "react";
import { Container } from "react-bootstrap";

import CommonToast from "@/components/common/toast";
import { DynamicFormBuilder } from "@/components/pages/forms/DynamicForm/DynamicForm";
import { useAddUpdateFormConfigMutation } from "@/hooks/dynamicForm";
import { useToast } from "@/hooks/useToast";
import { paths } from "@/routes";
import { createFormConfigApiPayload } from "@/services/dynamicForm";
import type { DynamicFormConfig } from "@/types/forms/dynamicForm";
import logger from "@/utils/logger";

export default function DynamicFormAddPage() {
  const t = useTranslations("dynamicForm");
  const tCommon = useTranslations("common");
  const router = useRouter();

  const { toast, showSuccess, showError, hideToast } = useToast();
  const { mutateAsync: addUpdateFormConfig } = useAddUpdateFormConfigMutation();

  const handleSave = async (config: DynamicFormConfig) => {
    try {
      // Title validation is handled by react-hook-form in DynamicFormBuilder
      const data = createFormConfigApiPayload(config);
      const response = await addUpdateFormConfig(data);
      showSuccess(response.message || t("formSavedSuccess"));
      router.push(paths.DYNAMIC_FORM_LIST);
    } catch (error: any) {
      logger.error("Failed to save form config:", error);
      showError(error?.message || tCommon("errors.serverError"));
    }
  };

  return (
    <Container fluid>
      <DynamicFormBuilder onSave={handleSave} />
      <CommonToast
        show={toast.show}
        message={toast.message}
        variant={toast.variant}
        onClose={hideToast}
      />
    </Container>
  );
}
