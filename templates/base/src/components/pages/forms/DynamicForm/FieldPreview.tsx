"use client";

import React, { FC } from "react";
import { Form } from "react-bootstrap";

import styles from "@/components/pages/forms/DynamicForm/styles.module.scss";
import Checkbox from "@/components/pure-components/Checkbox";
import Input from "@/components/pure-components/Form/Input";
import TextArea from "@/components/pure-components/Form/Input/TextArea";
import Radio from "@/components/pure-components/Radio";
import { FieldPreviewProps, FieldType } from "@/types/forms/dynamicForm";

const FieldPreview: FC<FieldPreviewProps> = ({
  field,
  metadata,
  t,
  onClick,
}) => {
  const renderPreview = () => {
    switch (field.type) {
      case FieldType.TEXTAREA:
        return (
          <TextArea
            placeholder={field.placeholder || t("placeholder")}
            rows={4}
            disabled
            readOnly
          />
        );

      case FieldType.SELECT:
        return (
          <Form.Select disabled size="sm">
            <option>{field.placeholder || t("placeholder")}</option>
          </Form.Select>
        );

      case FieldType.MULTISELECT:
        return (
          <Form.Select disabled size="sm" multiple>
            <option>{t("selectMultipleOptions")}</option>
          </Form.Select>
        );

      case FieldType.CHECKBOX:
        return <Checkbox label={t("options")} disabled />;

      case FieldType.RADIO:
        return (
          <Radio
            key={t("options")}
            label={t("options")}
            name={field.name}
            disabled
          />
        );

      default:
        return (
          <Input
            type={field.type}
            placeholder={field.placeholder || t("placeholder")}
            disabled
            readOnly
          />
        );
    }
  };

  return (
    <div
      className={styles.fieldDisplay}
      onClick={onClick}
      role="button"
      tabIndex={0}
    >
      <div className={styles.fieldQuestion}>
        <div className={styles.questionContent}>
          {field.label ? (
            <span>{field.label}</span>
          ) : (
            <span className={styles.placeholder}>
              {t("fieldLabel")} ({metadata.label})
            </span>
          )}
          {field.required && <span className={styles.requiredBadge}>*</span>}
        </div>
      </div>
      <div className={styles.fieldPreview}>{renderPreview()}</div>
    </div>
  );
};

export default FieldPreview;
