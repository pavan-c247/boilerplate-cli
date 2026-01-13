"use client";

import { useTranslations } from "next-intl";
import React, { FC } from "react";
import { FaCode, FaEye } from "react-icons/fa";

import styles from "@/components/pages/forms/DynamicForm/styles.module.scss";
import Button from "@/components/pure-components/Button";
import { BUTTON_VARIANTS } from "@/constants";
import type { FormHeaderProps } from "@/types/forms/dynamicForm";

export const FormHeader: FC<FormHeaderProps> = ({
  title,
  config,
  formId,
  onViewCode,
  onPreview,
  onSave,
}) => {
  const t = useTranslations("dynamicForm");

  return (
    <div className={styles.toolbar}>
      <div className={styles.toolbarLeft}>
        <h1>{title}</h1>
      </div>

      <div className={styles.toolbarRight}>
        {config.fields.length > 0 && formId && (
          <Button
            variant={BUTTON_VARIANTS.TERTIARY}
            onClick={onViewCode}
            icon={<FaCode />}
            className={styles.previewButton}
          >
            {t("viewCode")}
          </Button>
        )}

        <Button
          variant={BUTTON_VARIANTS.TERTIARY}
          onClick={onPreview}
          icon={<FaEye />}
          className={styles.previewButton}
        >
          {t("preview")}
        </Button>

        {config.fields.length > 0 && onSave && (
          <Button variant={BUTTON_VARIANTS.PRIMARY} onClick={onSave}>
            {t("saveFormConfiguration")}
          </Button>
        )}
      </div>
    </div>
  );
};

export default FormHeader;
