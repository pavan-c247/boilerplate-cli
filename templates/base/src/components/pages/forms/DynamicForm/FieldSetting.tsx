"use client";

import React, { FC } from "react";
import { Col, Form, Row } from "react-bootstrap";

import { AddOptionsManager } from "@/components/pages/forms/DynamicForm/AddOptionsManager";
import styles from "@/components/pages/forms/DynamicForm/styles.module.scss";
import { FormGroup, FormLabel } from "@/components/pure-components/Form";
import Select from "@/components/pure-components/Select";
import {
  DEFAULT_GRID_SIZE,
  GRID_SIZE_OPTIONS,
  PLACEHOLDER_SUPPORTED_FIELDS,
} from "@/constants/forms/dynamicForm";
import {
  FieldSettingProps,
  FieldType,
  GridSize,
  SelectOption,
} from "@/types/forms/dynamicForm";

const FieldSetting: FC<FieldSettingProps> = ({ field, t, onUpdate }) => {
  return (
    <div className={styles.fieldEditorPanel}>
      <div className={styles.editorHeader}>
        <span className={styles.fieldTypeLabel}>{t("fieldSettings")}</span>
      </div>

      <div className={styles.editorContent}>
        <Row>
          <Col xs={12} md={6}>
            <FormGroup>
              <FormLabel>{t("fieldLabel")}</FormLabel>
              <Form.Control
                type="text"
                value={field.label}
                onChange={(e) => onUpdate({ label: e.target.value })}
                placeholder={t("fieldLabel")}
                autoFocus
              />
            </FormGroup>
          </Col>
          <Col xs={12} md={6}>
            <FormGroup>
              <FormLabel>{t("fieldId")}</FormLabel>
              <Form.Control
                type="text"
                value={field.name}
                onChange={(e) => onUpdate({ name: e.target.value })}
                placeholder={t("fieldIdPlaceholder")}
              />
            </FormGroup>
          </Col>
        </Row>

        {/* Show Placeholder*/}
        {PLACEHOLDER_SUPPORTED_FIELDS.includes(field.type) && (
          <FormGroup>
            <FormLabel>{t("placeholder")}</FormLabel>
            <Form.Control
              type="text"
              value={field.placeholder || ""}
              onChange={(e) => onUpdate({ placeholder: e.target.value })}
              placeholder={t("placeholder")}
            />
          </FormGroup>
        )}

        {/* TEXT Min/Max Characters */}
        {field.type === FieldType.TEXT && (
          <Row>
            <Col xs={12} md={6}>
              <FormGroup>
                <FormLabel>
                  {t("min", { entityName: t("characters") })}
                </FormLabel>
                <Form.Control
                  type="number"
                  min={0}
                  value={
                    (field as { validation?: { minLength?: number } })
                      .validation?.minLength || ""
                  }
                  onChange={(e) =>
                    onUpdate({
                      validation: {
                        ...(field as { validation?: any }).validation,
                        minLength: e.target.value
                          ? parseInt(e.target.value, 10)
                          : undefined,
                      },
                    })
                  }
                  placeholder="0"
                />
              </FormGroup>
            </Col>
            <Col xs={12} md={6}>
              <FormGroup>
                <FormLabel>
                  {t("max", { entityName: t("characters") })}
                </FormLabel>
                <Form.Control
                  type="number"
                  min={0}
                  value={
                    (field as { validation?: { maxLength?: number } })
                      .validation?.maxLength || ""
                  }
                  onChange={(e) =>
                    onUpdate({
                      validation: {
                        ...(field as { validation?: any }).validation,
                        maxLength: e.target.value
                          ? parseInt(e.target.value, 10)
                          : undefined,
                      },
                    })
                  }
                  placeholder="0"
                />
              </FormGroup>
            </Col>
          </Row>
        )}

        {/* SELECT Options Management */}
        {(field.type === FieldType.SELECT ||
          field.type === FieldType.MULTISELECT) && (
          <FormGroup>
            <FormLabel>{t("options")}</FormLabel>
            <AddOptionsManager
              options={
                (
                  field as {
                    options?: Array<{ label: string; value: string }>;
                  }
                ).options || []
              }
              onChange={(updatedOptions: any) => {
                onUpdate({ options: updatedOptions });
              }}
            />
          </FormGroup>
        )}

        {/* TEXTAREA Rows */}
        {field.type === FieldType.TEXTAREA && (
          <FormGroup>
            <FormLabel>{t("rows")}</FormLabel>
            <Form.Control
              type="number"
              value={(field as { rows?: number }).rows || 3}
              onChange={(e) =>
                onUpdate({ rows: parseInt(e.target.value, 10) || 3 })
              }
              min={1}
              max={20}
            />
          </FormGroup>
        )}

        {/* FILE/MULTIFILE Settings */}
        {(field.type === FieldType.FILE ||
          field.type === FieldType.MULTIFILE) && (
          <Row>
            <Col xs={12} md={8}>
              <FormGroup>
                <FormLabel>{t("acceptFileTypes")}</FormLabel>
                <Form.Control
                  type="text"
                  value={(field as { accept?: string }).accept || ""}
                  onChange={(e) => onUpdate({ accept: e.target.value })}
                  placeholder=".pdf,.doc,.docx,image/*"
                />
              </FormGroup>
            </Col>
            <Col xs={12} md={4}>
              <FormGroup>
                <FormLabel>{t("maxFileSize")}</FormLabel>
                <Form.Control
                  type="number"
                  value={(field as { maxSize?: number }).maxSize || ""}
                  onChange={(e) =>
                    onUpdate({
                      maxSize: e.target.value
                        ? parseInt(e.target.value, 10)
                        : undefined,
                    })
                  }
                  placeholder="MB"
                />
              </FormGroup>
            </Col>
          </Row>
        )}

        {/* DATE/DATETIME/TIME Settings */}
        {[FieldType.DATE, FieldType.DATETIME, FieldType.TIME].includes(
          field.type
        ) && (
          <Row>
            <Col xs={12} md={6}>
              <FormGroup>
                <FormLabel>{t("min", { entityName: t("date") })}</FormLabel>
                <Form.Control
                  type="date"
                  value={(field as { minDate?: string }).minDate || ""}
                  onChange={(e) => onUpdate({ minDate: e.target.value })}
                />
              </FormGroup>
            </Col>
            <Col xs={12} md={6}>
              <FormGroup>
                <FormLabel>{t("max", { entityName: t("date") })}</FormLabel>
                <Form.Control
                  type="date"
                  value={(field as { maxDate?: string }).maxDate || ""}
                  onChange={(e) => onUpdate({ maxDate: e.target.value })}
                />
              </FormGroup>
            </Col>
          </Row>
        )}

        {/* NUMBER Settings */}
        {field.type === FieldType.NUMBER && (
          <Row>
            <Col>
              <FormGroup>
                <FormLabel>{t("min", { entityName: t("value") })}</FormLabel>
                <Form.Control
                  type="number"
                  value={(field as { min?: number }).min || ""}
                  onChange={(e) =>
                    onUpdate({
                      min: e.target.value
                        ? parseFloat(e.target.value)
                        : undefined,
                    })
                  }
                />
              </FormGroup>
            </Col>
            <Col>
              <FormGroup>
                <FormLabel>{t("max", { entityName: t("value") })}</FormLabel>
                <Form.Control
                  type="number"
                  value={(field as { max?: number }).max || ""}
                  onChange={(e) =>
                    onUpdate({
                      max: e.target.value
                        ? parseFloat(e.target.value)
                        : undefined,
                    })
                  }
                />
              </FormGroup>
            </Col>
            <Col>
              <FormGroup>
                <FormLabel>{t("step")}</FormLabel>
                <Form.Control
                  type="number"
                  value={(field as { step?: number }).step || ""}
                  onChange={(e) =>
                    onUpdate({
                      step: e.target.value
                        ? parseFloat(e.target.value)
                        : undefined,
                    })
                  }
                />
              </FormGroup>
            </Col>
          </Row>
        )}

        {/* RANGE Settings */}
        {field.type === FieldType.RANGE && (
          <Row>
            <Col>
              <FormGroup>
                <FormLabel>{t("min", { entityName: t("value") })}</FormLabel>
                <Form.Control
                  type="number"
                  value={(field as { min?: number }).min || ""}
                  onChange={(e) =>
                    onUpdate({
                      min: e.target.value
                        ? parseFloat(e.target.value)
                        : undefined,
                    })
                  }
                />
              </FormGroup>
            </Col>
            <Col>
              <FormGroup>
                <FormLabel>{t("max", { entityName: t("value") })}</FormLabel>
                <Form.Control
                  type="number"
                  value={(field as { max?: number }).max || ""}
                  onChange={(e) =>
                    onUpdate({
                      max: e.target.value
                        ? parseFloat(e.target.value)
                        : undefined,
                    })
                  }
                />
              </FormGroup>
            </Col>
            <Col>
              <FormGroup>
                <FormLabel>{t("step")}</FormLabel>
                <Form.Control
                  type="number"
                  value={(field as { step?: number }).step || ""}
                  onChange={(e) =>
                    onUpdate({
                      step: e.target.value
                        ? parseFloat(e.target.value)
                        : undefined,
                    })
                  }
                />
              </FormGroup>
            </Col>
          </Row>
        )}

        {/* CHECKBOX Settings */}
        {field.type === FieldType.CHECKBOX && (
          <FormGroup>
            <FormLabel>{t("options")}</FormLabel>
            <AddOptionsManager
              options={
                (
                  field as {
                    options?: Array<SelectOption>;
                  }
                ).options || []
              }
              onChange={(updatedOptions) => {
                onUpdate({
                  options: updatedOptions.map((opt) => ({
                    ...opt,
                    checked: opt.checked ?? false,
                  })),
                });
              }}
            />
          </FormGroup>
        )}

        {/* RADIO Settings */}
        {field.type === FieldType.RADIO && (
          <FormGroup>
            <FormLabel>{t("options")}</FormLabel>
            <AddOptionsManager
              options={
                (
                  field as {
                    options?: Array<{
                      label: string;
                      value: string;
                    }>;
                  }
                ).options || []
              }
              onChange={(updatedOptions) => {
                onUpdate({
                  options: updatedOptions.map((opt) => ({
                    ...opt,
                  })),
                });
              }}
            />
          </FormGroup>
        )}

        {/* EDITOR Settings */}
        {field.type === FieldType.EDITOR && (
          <FormGroup>
            <FormLabel>{t("minHeight")}</FormLabel>
            <Form.Control
              type="number"
              value={(field as { minHeight?: number }).minHeight || ""}
              onChange={(e) =>
                onUpdate({
                  minHeight: e.target.value
                    ? parseInt(e.target.value, 10)
                    : undefined,
                })
              }
              placeholder="px"
            />
          </FormGroup>
        )}
        {/* Grid Size Setting */}
        <FormGroup>
          <FormLabel>{t("gridSize")}</FormLabel>
          <Select
            value={
              field.gridSize &&
              GRID_SIZE_OPTIONS.some((opt) => opt.value === field.gridSize)
                ? String(field.gridSize)
                : String(DEFAULT_GRID_SIZE)
            }
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
              const newGridSize = parseInt(e.target.value, 10) as GridSize;
              onUpdate({ gridSize: newGridSize });
            }}
            options={GRID_SIZE_OPTIONS as any}
          />
        </FormGroup>
        <div className={styles.fieldOptions}>
          <div className={styles.toggleOption}>
            <label className={styles.toggleLabel}>{t("required")}</label>
            <button
              type="button"
              className={`${styles.toggleSwitch} ${
                field.required ? styles.toggleOn : styles.toggleOff
              }`}
              onClick={() => onUpdate({ required: !field.required })}
              aria-pressed={field.required}
            >
              <span className={styles.toggleSlider} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FieldSetting;
