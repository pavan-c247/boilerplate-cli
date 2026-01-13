"use client";

import { useTranslations } from "next-intl";
import React, { FC } from "react";
import { FaTimes } from "react-icons/fa";

import { DynamicFormRenderer } from "@/components/pages/forms/DynamicForm/DynamicFormRenderer";
import styles from "@/components/pages/forms/DynamicForm/styles.module.scss";
import type { FormPreviewModalProps } from "@/types/forms/dynamicForm";

export const FormPreviewModal: FC<FormPreviewModalProps> = ({
  config,
  onClose,
}) => {
  const t = useTranslations("dynamicForm");
  const tCommon = useTranslations("common");

  return (
    <div
      className={styles.previewOverlay}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className={styles.previewModal}>
        <div className={styles.previewHeader}>
          <h3>{t("formPreview")}</h3>
          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            aria-label={t("backToBuilder")}
          >
            <FaTimes />
          </button>
        </div>
        <div className={styles.previewBody}>
          <DynamicFormRenderer
            config={config}
            onSubmit={async () => {
              if (typeof window !== "undefined") {
                // eslint-disable-next-line no-alert
                alert(tCommon("success.submitSuccess"));
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default FormPreviewModal;
