"use client";

import { useTranslations } from "next-intl";
import React, { FC, memo, useState } from "react";
import { FaChevronDown, FaChevronUp, FaCopy, FaTrash } from "react-icons/fa";

import FieldPreview from "@/components/pages/forms/DynamicForm/FieldPreview";
import FieldSetting from "@/components/pages/forms/DynamicForm/FieldSetting";
import styles from "@/components/pages/forms/DynamicForm/styles.module.scss";
import Select from "@/components/pure-components/Select";
import Tooltip from "@/components/pure-components/Tooltip";
import {
  createDefaultFieldConfig,
  FIELD_TYPE_METADATA,
} from "@/config/dynamicForm.config";
import { FieldEditorProps, FieldType } from "@/types/forms/dynamicForm";

/**
 * Field Editor Component
 */
export const FieldEditor: FC<FieldEditorProps> = memo(
  ({ field, index, isEditing, onEdit, onUpdate, onRemove, onDuplicate }) => {
    const t = useTranslations("dynamicForm");
    const metadata = FIELD_TYPE_METADATA[field.type];
    const [isExpanded, setIsExpanded] = useState(isEditing);

    // Sync expanded state with editing state
    React.useEffect(() => {
      setIsExpanded(isEditing);
    }, [isEditing]);

    const handleFieldClick = () => {
      if (!isEditing) {
        onEdit();
        setIsExpanded(true);
      }
    };

    const handleFieldTypeChange = (newType: FieldType) => {
      const newField = createDefaultFieldConfig(newType, []);
      onUpdate({
        type: newType,
        label: newField.label,
        placeholder: newField.placeholder,
      });
    };

    const handleDuplicate = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (onDuplicate) {
        onDuplicate();
      }
    };

    const handleDelete = (e: React.MouseEvent) => {
      e.stopPropagation();
      onRemove();
    };

    return (
      <div className={styles.fieldEditor}>
        {/* Field Header with Number Badge and Type Selector */}
        <div className={styles.fieldHeaderRow}>
          <div className={styles.fieldHeaderLeft}>
            {/* Serial Number Badge */}
            <div className={styles.fieldNumberBadge}>{index + 1}</div>

            {/* Field Type Selector */}
            <div className={styles.fieldTypeSelector}>
              <Select
                value={field.type}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  handleFieldTypeChange(e.target.value as FieldType)
                }
                className={styles.typeSelect}
                options={Object.values(FIELD_TYPE_METADATA).map((meta) => ({
                  value: meta.type,
                  label: meta.label,
                }))}
              />
            </div>
          </div>

          <div className={styles.fieldActions}>
            <Tooltip title={isExpanded ? t("collapse") : t("expand")}>
              <button
                type="button"
                className={styles.actionButton}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsExpanded(!isExpanded);
                  if (!isExpanded && !isEditing) {
                    onEdit();
                  }
                }}
              >
                {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
              </button>
            </Tooltip>
            <Tooltip title={t("duplicate")}>
              <button
                type="button"
                className={styles.actionButton}
                onClick={handleDuplicate}
              >
                <FaCopy />
              </button>
            </Tooltip>
            <Tooltip title={t("removeField")}>
              <button
                type="button"
                className={`${styles.actionButton} ${styles.deleteAction}`}
                onClick={handleDelete}
              >
                <FaTrash />
              </button>
            </Tooltip>
          </div>
        </div>

        {/* Field Preview */}
        <FieldPreview
          field={field}
          metadata={metadata}
          t={t}
          onClick={handleFieldClick}
        />

        {/* Field Editor (Expanded) */}
        {isExpanded && <FieldSetting field={field} t={t} onUpdate={onUpdate} />}
      </div>
    );
  }
);

FieldEditor.displayName = "FieldEditor";
