"use client";

import { useTranslations } from "next-intl";
import React, { FC, useCallback, useEffect, useRef, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { FaPlus, FaTrash } from "react-icons/fa";

import styles from "@/components/pages/forms/DynamicForm/styles.module.scss";
import { BUTTON_TYPES, BUTTON_VARIANTS } from "@/constants";
import type {
  AddOptionsManagerProps,
  OptionsFormData,
  SelectOption,
} from "@/types/forms/dynamicForm";

export const AddOptionsManager: FC<AddOptionsManagerProps> = ({
  options,
  onChange,
}) => {
  const t = useTranslations("dynamicForm");
  const tCommon = useTranslations("common");
  const optionCounterRef = useRef(0);
  const [isMounted, setIsMounted] = useState(false);
  const prevOptionsRef = useRef<Array<SelectOption>>(options);

  // Track client-side mount to prevent hydration mismatches
  useEffect(() => {
    setIsMounted(true);
    if (options.length > 0) {
      const maxNum = options.reduce((max, opt) => {
        const match = opt.value?.match(/option_(\d+)/);
        if (match) {
          const num = parseInt(match[1], 10);
          return Math.max(max, num);
        }
        return max;
      }, 0);
      optionCounterRef.current = maxNum;
    }
  }, []);

  // Use form with options
  const initialOptions =
    options.length > 0
      ? options
      : [
          {
            label: t("option"),
            value: `option_${++optionCounterRef.current}`,
          },
        ];

  const { control, watch, reset } = useForm<OptionsFormData>({
    defaultValues: {
      options: initialOptions,
    },
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "options",
  });

  const watchedOptions = watch("options");
  const [removingIndex, setRemovingIndex] = useState<number | null>(null);

  // Sync watchedOptions to parent, but only valid options
  useEffect(() => {
    if (!isMounted || !watchedOptions) return;
    const validOptions = watchedOptions
      .map((opt) => ({
        label: opt.label?.trim() || "",
        value: opt.value || "",
      }))
      .filter((opt) => opt.label || opt.value); // Keep if has label or value

    const hasChanged =
      validOptions.length !== prevOptionsRef.current.length ||
      validOptions.some(
        (opt, idx) =>
          opt.label !== prevOptionsRef.current[idx]?.label ||
          opt.value !== prevOptionsRef.current[idx]?.value
      );

    if (hasChanged) {
      prevOptionsRef.current = validOptions;
      onChange(validOptions);
    }
  }, [watchedOptions, onChange, isMounted]);

  useEffect(() => {
    if (!isMounted) return;

    // Check if options prop changed externally
    const externalChanged =
      options.length !== prevOptionsRef.current.length ||
      options.some(
        (opt, idx) =>
          opt.label !== prevOptionsRef.current[idx]?.label ||
          opt.value !== prevOptionsRef.current[idx]?.value
      );

    if (externalChanged) {
      const newOptions =
        options.length > 0 ? options : [{ label: "", value: "" }];
      reset({
        options: newOptions,
      });
      prevOptionsRef.current = options;
    }
  }, [options, reset, isMounted]);

  const handleAddOption = useCallback(() => {
    const newValue = `option_${++optionCounterRef.current}`;
    append({
      label: t("option"),
      value: newValue,
    });
  }, [append, t]);

  const handleRemoveOption = useCallback(
    (index: number) => {
      if (fields.length > 1) {
        setRemovingIndex(index);
        setTimeout(() => {
          remove(index);
          setRemovingIndex(null);
        }, 150);
      }
    },
    [fields.length, remove]
  );

  return (
    <div className={styles.optionsList}>
      {fields.map((field, index) => {
        const isRemoving = removingIndex === index;
        return (
          <div
            key={field.id}
            className={`${styles.optionItem} ${
              isRemoving ? styles.removing : ""
            }`}
          >
            <Row className="g-2 flex-fill">
              <Col xs={12} md={6}>
                <Controller
                  name={`options.${index}.label`}
                  control={control}
                  render={({ field: controllerField }) => (
                    <Form.Control
                      {...controllerField}
                      type="text"
                      placeholder={t("optionLabel")}
                    />
                  )}
                />
              </Col>
              <Col xs={12} md={6}>
                <Controller
                  name={`options.${index}.value`}
                  control={control}
                  render={({ field: controllerField }) => (
                    <Form.Control
                      {...controllerField}
                      type="text"
                      placeholder={t("optionValue")}
                    />
                  )}
                />
              </Col>
            </Row>
            <div className={styles.removeButtonWrapper}>
              <Button
                variant={BUTTON_VARIANTS.OUTLINE_DANGER}
                size="sm"
                type={BUTTON_TYPES.BUTTON}
                onClick={() => handleRemoveOption(index)}
                disabled={fields.length === 1}
                className="d-flex align-items-center justify-content-center"
                aria-label={t("removeOption")}
              >
                <FaTrash />
              </Button>
            </div>
          </div>
        );
      })}
      <Button
        variant={BUTTON_VARIANTS.OUTLINE_SECONDARY}
        size="sm"
        type={BUTTON_TYPES.BUTTON}
        onClick={handleAddOption}
        className={`d-flex align-items-center gap-2 ${styles.addOptionButton}`}
      >
        <FaPlus /> {tCommon("addButton", { entityName: t("option") })}
      </Button>
    </div>
  );
};
