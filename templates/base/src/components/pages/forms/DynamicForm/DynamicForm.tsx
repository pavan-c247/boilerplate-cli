"use client";

import { useTranslations } from "next-intl";
import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import { Form } from "react-bootstrap";
import { SubmitHandler, useForm } from "react-hook-form";
import { FaPlus } from "react-icons/fa";

import { FieldEditor } from "@/components/pages/forms/DynamicForm/FieldEditor";
import { FormHeader } from "@/components/pages/forms/DynamicForm/FormHeader";
import { FormPreviewModal } from "@/components/pages/forms/DynamicForm/FormPreviewModal";
import styles from "@/components/pages/forms/DynamicForm/styles.module.scss";
import { ViewCodeModal } from "@/components/pages/forms/DynamicForm/ViewCodeModal";
import { FormGroup } from "@/components/pure-components/Form";
import Input from "@/components/pure-components/Form/Input";
import Tooltip from "@/components/pure-components/Tooltip";
import {
  createDefaultFieldConfig,
  generateFieldId,
  generateFieldName,
} from "@/config/dynamicForm.config";
import type {
  DynamicFieldConfig,
  DynamicFormBuilderFormValues,
  DynamicFormBuilderProps,
  DynamicFormConfig,
} from "@/types/forms/dynamicForm";
import { FieldType } from "@/types/forms/dynamicForm";

export const DynamicFormBuilder: FC<DynamicFormBuilderProps> = ({
  initialConfig,
  onSave,
  formId,
}) => {
  const t = useTranslations("dynamicForm");
  const tCommon = useTranslations("common");
  const [config, setConfig] = useState<DynamicFormConfig>(
    initialConfig || {
      fields: [],
      title: "",
      description: "",
      submitButtonText: tCommon("actions.submit"),
      resetButtonText: tCommon("actions.reset"),
      showResetButton: true,
    }
  );

  // React Hook Form for title validation
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<DynamicFormBuilderFormValues>({
    defaultValues: {
      title: initialConfig?.title || "",
    },
    mode: "onChange",
  });

  // Watch title field to sync with config
  const watchedTitle = watch("title");

  const [previewMode, setPreviewMode] = useState(false);
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [showCodeModal, setShowCodeModal] = useState(false);

  // Update config when initialConfig changes (from API)
  useEffect(() => {
    if (initialConfig) {
      setConfig(initialConfig);
      setValue("title", initialConfig.title || "");
      setEditingFieldId(null);
    } else if (config.fields.length === 0) {
      // No initial config, initialize with 1 default field
      const defaultField = createDefaultFieldConfig(FieldType.TEXT, []);
      const newConfig: DynamicFormConfig = {
        fields: [defaultField],
        title: "",
        description: "",
        submitButtonText: tCommon("actions.submit"),
        resetButtonText: tCommon("actions.reset"),
        showResetButton: true,
      };
      setConfig(newConfig);
      setValue("title", "");
      setEditingFieldId(defaultField.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialConfig, setValue]);

  // Sync watched title to config state
  useEffect(() => {
    if (watchedTitle !== undefined && watchedTitle !== config.title) {
      handleUpdateMetadata({ title: watchedTitle });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedTitle]);

  const existingFieldNames = useMemo(
    () => config.fields.map((field) => field.name),
    [config.fields]
  );

  // Handle adding a new field at specific index
  const handleAddField = useCallback(
    (index?: number) => {
      const newField = createDefaultFieldConfig(
        FieldType.TEXT,
        existingFieldNames
      );
      const fields = [...config.fields];
      const insertIndex = index !== undefined ? index + 1 : fields.length;
      fields.splice(insertIndex, 0, newField);

      const updatedConfig: DynamicFormConfig = {
        ...config,
        fields: fields as DynamicFieldConfig[],
      };

      setConfig(updatedConfig);
      setEditingFieldId(newField.id);
    },
    [config, existingFieldNames]
  );

  // Handle duplicating a field
  const handleDuplicateField = useCallback(
    (fieldId: string, index: number) => {
      const fieldToDuplicate = config.fields.find(({id}) => id === fieldId);
      if (!fieldToDuplicate) return;

      // Create a duplicate with new ID and name
      const duplicatedField: DynamicFieldConfig = {
        ...fieldToDuplicate,
        id: generateFieldId(),
        name: generateFieldName(fieldToDuplicate.label, existingFieldNames),
      } as DynamicFieldConfig;

      const fields = [...config.fields];
      fields.splice(index + 1, 0, duplicatedField);

      const updatedConfig: DynamicFormConfig = {
        ...config,
        fields: fields as DynamicFieldConfig[],
      };

      setConfig(updatedConfig);
      setEditingFieldId(duplicatedField.id);
    },
    [config, existingFieldNames]
  );

  // Handle removing a field
  const handleRemoveField = useCallback(
    (fieldId: string) => {
      const updatedConfig: DynamicFormConfig = {
        ...config,
        fields: config.fields.filter(
          (f) => f.id !== fieldId
        ) as DynamicFieldConfig[],
      };

      setConfig(updatedConfig);
      if (editingFieldId === fieldId) {
        setEditingFieldId(null);
      }
    },
    [config, editingFieldId]
  );

  // Handle updating a field
  const handleUpdateField = useCallback(
    (fieldId: string, updates: Partial<DynamicFieldConfig>) => {
      // Handle ID change specially - need to check uniqueness and update editing state
      if (updates.id && updates.id !== fieldId) {
        // Check if new ID already exists
        const idExists = config.fields.some(
          (f) => f.id === updates.id && f.id !== fieldId
        );
        if (idExists) {
          // ID already exists, don't update
          console.warn(
            `Field ID "${updates.id}" already exists. Please use a unique ID.`
          );
          return;
        }

        // Update editing state if this field is currently being edited
        if (editingFieldId === fieldId) {
          setEditingFieldId(updates.id);
        }
      }

      const updatedConfig: DynamicFormConfig = {
        ...config,
        fields: config.fields.map((f) =>
          f.id === fieldId ? { ...f, ...updates } : f
        ) as DynamicFieldConfig[],
      };

      setConfig(updatedConfig);
    },
    [config, editingFieldId]
  );

  // Handle drag start
  const handleDragStart = useCallback((index: number) => {
    setDraggedIndex(index);
  }, []);

  // Handle drag over
  const handleDragOver = useCallback(
    (e: React.DragEvent, index: number) => {
      e.preventDefault();
      if (draggedIndex !== null && draggedIndex !== index) {
        setDragOverIndex(index);
      }
    },
    [draggedIndex]
  );

  // Handle drop
  const handleDrop = useCallback(
    (e: React.DragEvent, dropIndex: number) => {
      e.preventDefault();
      if (draggedIndex === null || draggedIndex === dropIndex) {
        setDraggedIndex(null);
        setDragOverIndex(null);
        return;
      }

      const fields = [...config.fields];
      const draggedField = fields[draggedIndex];
      fields.splice(draggedIndex, 1);
      fields.splice(dropIndex, 0, draggedField);

      const updatedConfig: DynamicFormConfig = {
        ...config,
        fields: fields as DynamicFieldConfig[],
      };

      setConfig(updatedConfig);
      setDraggedIndex(null);
      setDragOverIndex(null);
    },
    [config, draggedIndex]
  );

  // Handle drag end
  const handleDragEnd = useCallback(() => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  }, []);

  // Handle form metadata updates
  const handleUpdateMetadata = useCallback(
    (updates: Partial<DynamicFormConfig>) => {
      const updatedConfig: DynamicFormConfig = { ...config, ...updates };
      setConfig(updatedConfig);
    },
    [config]
  );

  // Handle form submission (validates title)
  const onSubmit: SubmitHandler<DynamicFormBuilderFormValues> = useCallback(
    (data) => {
      // Title is already validated by react-hook-form
      const updatedConfig: DynamicFormConfig = {
        ...config,
        title: data.title,
      };
      onSave?.(updatedConfig);
    },
    [config, onSave]
  );

  // Handle save button click (triggers form validation)
  const handleSave = useCallback(() => {
    handleSubmit(onSubmit)();
  }, [handleSubmit, onSubmit]);

  return (
    <>
      <div className={styles.builderContainer}>
        {/* Toolbar */}
        <FormHeader
          title={t("title")}
          config={config}
          formId={formId}
          onViewCode={() => setShowCodeModal(true)}
          onPreview={() => setPreviewMode(true)}
          onSave={onSave ? handleSave : undefined}
        />

        {/* Main Content */}
        <div className={styles.contentWrapper}>
          <div className={styles.formBuilder}>
            {/* Form Header */}
            <div className={styles.formHeader}>
              <FormGroup>
                <Form.Label>
                  {t("formTitle")} <span className="text-danger">*</span>
                </Form.Label>
                <Input
                  type="text"
                  {...register("title", {
                    required: tCommon("errors.required"),
                    validate: (value) => {
                      const trimmed = value?.trim();
                      return trimmed !== "" || tCommon("errors.required");
                    },
                  })}
                  placeholder={t("formTitlePlaceholder")}
                  className={styles.formTitleInput}
                  isInvalid={!!errors.title}
                  feedback={errors.title?.message}
                />
              </FormGroup>
            </div>

            {/* Fields List with Add Buttons */}
            <div className={styles.fieldsContainer}>
              {config.fields.map((field, index) => (
                <React.Fragment key={field.id}>
                  {/* Field Card */}
                  <div
                    className={`${styles.fieldCard} ${
                      editingFieldId === field.id ? styles.editing : ""
                    } ${dragOverIndex === index ? styles.dragOver : ""}`}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDrop={(e) => handleDrop(e, index)}
                    onDragEnd={handleDragEnd}
                  >
                    {/* Drag Handle - Positioned at top center */}
                    <Tooltip title={t("dragToReorder")}>
                      <div className={styles.dragHandle}>
                        <div className={styles.dragDots}>
                          <span />
                          <span />
                          <span />
                          <span />
                          <span />
                          <span />
                        </div>
                      </div>
                    </Tooltip>

                    {/* Field Content */}
                    <div className={styles.fieldContent}>
                      <FieldEditor
                        field={field}
                        index={index}
                        isEditing={editingFieldId === field.id}
                        onEdit={() => setEditingFieldId(field.id)}
                        onUpdate={(updates) =>
                          handleUpdateField(field.id, updates)
                        }
                        onRemove={() => handleRemoveField(field.id)}
                        onDuplicate={() =>
                          handleDuplicateField(field.id, index)
                        }
                      />
                    </div>
                  </div>

                  {/* Add Field Button */}
                  <div className={styles.addFieldButtonWrapper}>
                    <Tooltip
                      title={tCommon("addButton", { entityName: t("field") })}
                    >
                      <button
                        type="button"
                        className={styles.addFieldButton}
                        onClick={() => handleAddField(index)}
                      >
                        <FaPlus />
                      </button>
                    </Tooltip>
                  </div>
                </React.Fragment>
              ))}

              {/* Add First Field Button (if no fields) */}
              {config.fields.length === 0 && (
                <div className={styles.addFieldButtonWrapper}>
                  <Tooltip
                    title={tCommon("addButton", { entityName: t("field") })}
                  >
                    <button
                      type="button"
                      className={styles.addFieldButton}
                      onClick={() => handleAddField()}
                    >
                      <FaPlus />
                    </button>
                  </Tooltip>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Full-Screen Preview Modal */}
      {previewMode && (
        <FormPreviewModal
          config={config}
          onClose={() => setPreviewMode(false)}
        />
      )}
      {/* View Code Modal */}
      <ViewCodeModal
        show={showCodeModal}
        onClose={() => setShowCodeModal(false)}
        formId={formId}
      />
    </>
  );
};

export default DynamicFormBuilder;
