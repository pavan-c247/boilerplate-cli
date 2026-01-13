"use client";

import { ReactNode } from "react";
import { Form as BootstrapForm } from "react-bootstrap";
import { Controller } from "react-hook-form";

import Card from "@/components/pure-components/Card";
import Checkbox from "@/components/pure-components/Checkbox";
import { FormGroup, FormLabel } from "@/components/pure-components/Form";
import Input from "@/components/pure-components/Form/Input";
import TextArea from "@/components/pure-components/Form/Input/TextArea";
import Select from "@/components/pure-components/Select";
import {
  INPUT_TYPES,
  MULTISTEP_FORM_CONFIG,
  MULTISTEP_FORM_COUNTRY_OPTIONS,
  MULTISTEP_FORM_DATE_CONSTRAINTS,
  MULTISTEP_FORM_FIELD_NAMES,
  MULTISTEP_FORM_STEP_IDS,
} from "@/constants/forms/multistepForm";
import { StepContentRendererProps } from "@/types/forms/multistepForm";

import styles from "./styles.module.scss";

export const renderStepContent = ({
  stepIndex,
  steps,
  t,
  register,
  control,
  trigger,
  errors,
  multistepFormStepRules,
}: StepContentRendererProps): ReactNode => {
  const step = steps[stepIndex];
  if (!step) return null;

  const stepId = step.id;

  switch (stepId) {
    case MULTISTEP_FORM_STEP_IDS.PERSONAL:
      return (
        <Card className={styles.stepCard}>
          <div className={styles.stepCardHeader}>
            <h3 className={styles.stepCardTitle}>
              {t("steps.personal.title")}
            </h3>
            <p className={styles.stepCardDescription}>
              {t("steps.personal.description")}
            </p>
          </div>
          <div className={styles.stepCardBody}>
            <FormGroup>
              <FormLabel>
                {t("steps.personal.fields.firstName.label")}
                {multistepFormStepRules.step1.firstName?.required && (
                  <span className="text-danger"> *</span>
                )}
              </FormLabel>
              <Input
                {...register(
                  MULTISTEP_FORM_FIELD_NAMES.FIRST_NAME,
                  multistepFormStepRules.step1.firstName
                )}
                placeholder={t("steps.personal.fields.firstName.placeholder")}
                isInvalid={!!errors.firstName}
                feedback={errors.firstName?.message as string}
              />
            </FormGroup>

            <FormGroup>
              <FormLabel>
                {t("steps.personal.fields.lastName.label")}
                {multistepFormStepRules.step1.lastName?.required && (
                  <span className="text-danger"> *</span>
                )}
              </FormLabel>
              <Input
                {...register(
                  MULTISTEP_FORM_FIELD_NAMES.LAST_NAME,
                  multistepFormStepRules.step1.lastName
                )}
                placeholder={t("steps.personal.fields.lastName.placeholder")}
                isInvalid={!!errors.lastName}
                feedback={errors.lastName?.message as string}
              />
            </FormGroup>

            <FormGroup>
              <FormLabel>
                {t("steps.personal.fields.email.label")}
                {multistepFormStepRules.step1.email?.required && (
                  <span className="text-danger"> *</span>
                )}
              </FormLabel>
              <Input
                type={INPUT_TYPES.EMAIL}
                {...register(
                  MULTISTEP_FORM_FIELD_NAMES.EMAIL,
                  multistepFormStepRules.step1.email
                )}
                placeholder={t("steps.personal.fields.email.placeholder")}
                isInvalid={!!errors.email}
                feedback={errors.email?.message as string}
              />
            </FormGroup>

            <FormGroup>
              <FormLabel>
                {t("steps.personal.fields.phone.label")}
                {multistepFormStepRules.step1.phone?.required && (
                  <span className="text-danger"> *</span>
                )}
              </FormLabel>
              <Input
                type={INPUT_TYPES.TEL}
                {...register(
                  MULTISTEP_FORM_FIELD_NAMES.PHONE,
                  multistepFormStepRules.step1.phone
                )}
                placeholder={t("steps.personal.fields.phone.placeholder")}
                isInvalid={!!errors.phone}
                feedback={errors.phone?.message as string}
              />
              {t("steps.personal.fields.phone.helpText") && (
                <BootstrapForm.Text className="text-muted">
                  {t("steps.personal.fields.phone.helpText")}
                </BootstrapForm.Text>
              )}
            </FormGroup>
          </div>
        </Card>
      );

    case MULTISTEP_FORM_STEP_IDS.ADDRESS:
      return (
        <Card className={styles.stepCard}>
          <div className={styles.stepCardHeader}>
            <h3 className={styles.stepCardTitle}>
              {t("steps.address.title")}
            </h3>
            <p className={styles.stepCardDescription}>
              {t("steps.address.description")}
            </p>
          </div>
          <div className={styles.stepCardBody}>
            <FormGroup>
              <FormLabel>
                {t("steps.address.fields.address.label")}
                {multistepFormStepRules.step2.address?.required && (
                  <span className="text-danger"> *</span>
                )}
              </FormLabel>
              <Input
                {...register(
                  MULTISTEP_FORM_FIELD_NAMES.ADDRESS,
                  multistepFormStepRules.step2.address
                )}
                placeholder={t("steps.address.fields.address.placeholder")}
                isInvalid={!!errors.address}
                feedback={errors.address?.message as string}
              />
            </FormGroup>

            <FormGroup>
              <FormLabel>
                {t("steps.address.fields.city.label")}
                {multistepFormStepRules.step2.city?.required && (
                  <span className="text-danger"> *</span>
                )}
              </FormLabel>
              <Input
                {...register(
                  MULTISTEP_FORM_FIELD_NAMES.CITY,
                  multistepFormStepRules.step2.city
                )}
                placeholder={t("steps.address.fields.city.placeholder")}
                isInvalid={!!errors.city}
                feedback={errors.city?.message as string}
              />
            </FormGroup>

            <FormGroup>
              <FormLabel>
                {t("steps.address.fields.state.label")}
                {multistepFormStepRules.step2.state?.required && (
                  <span className="text-danger"> *</span>
                )}
              </FormLabel>
              <Input
                {...register(
                  MULTISTEP_FORM_FIELD_NAMES.STATE,
                  multistepFormStepRules.step2.state
                )}
                placeholder={t("steps.address.fields.state.placeholder")}
                isInvalid={!!errors.state}
                feedback={errors.state?.message as string}
              />
            </FormGroup>

            <FormGroup>
              <FormLabel>
                {t("steps.address.fields.zipCode.label")}
                {multistepFormStepRules.step2.zipCode?.required && (
                  <span className="text-danger"> *</span>
                )}
              </FormLabel>
              <Input
                {...register(
                  MULTISTEP_FORM_FIELD_NAMES.ZIP_CODE,
                  multistepFormStepRules.step2.zipCode
                )}
                placeholder={t("steps.address.fields.zipCode.placeholder")}
                isInvalid={!!errors.zipCode}
                feedback={errors.zipCode?.message as string}
              />
            </FormGroup>

            <FormGroup>
              <FormLabel>
                {t("steps.address.fields.country.label")}
                {multistepFormStepRules.step2.country?.required && (
                  <span className="text-danger"> *</span>
                )}
              </FormLabel>
              <Select
                {...register(
                  MULTISTEP_FORM_FIELD_NAMES.COUNTRY,
                  multistepFormStepRules.step2.country
                )}
                options={[
                  {
                    value: MULTISTEP_FORM_CONFIG.EMPTY_STRING,
                    label: t("steps.address.fields.country.placeholder"),
                    disabled: true,
                  },
                  ...MULTISTEP_FORM_COUNTRY_OPTIONS.map((option) => ({
                    value: String(option.value),
                    label: option.label,
                    disabled: option.disabled,
                  })),
                ]}
                className={errors.country ? "is-invalid" : ""}
              />
              {errors.country && (
                <BootstrapForm.Control.Feedback type="invalid">
                  {errors.country.message as string}
                </BootstrapForm.Control.Feedback>
              )}
            </FormGroup>
          </div>
        </Card>
      );

    case MULTISTEP_FORM_STEP_IDS.ADDITIONAL:
      return (
        <Card className={styles.stepCard}>
          <div className={styles.stepCardHeader}>
            <h3 className={styles.stepCardTitle}>
              {t("steps.additional.title")}
            </h3>
            <p className={styles.stepCardDescription}>
              {t("steps.additional.description")}
            </p>
          </div>
          <div className={styles.stepCardBody}>
            <FormGroup>
              <FormLabel>
                {t("steps.additional.fields.dateOfBirth.label")}
                {multistepFormStepRules.step3.dateOfBirth?.required && (
                  <span className="text-danger"> *</span>
                )}
              </FormLabel>
              <Input
                type={INPUT_TYPES.DATE}
                {...register(
                  MULTISTEP_FORM_FIELD_NAMES.DATE_OF_BIRTH,
                  multistepFormStepRules.step3.dateOfBirth
                )}
                max={MULTISTEP_FORM_DATE_CONSTRAINTS.getMaxDate()}
                min={MULTISTEP_FORM_DATE_CONSTRAINTS.MIN_DATE}
                isInvalid={!!errors.dateOfBirth}
                feedback={errors.dateOfBirth?.message as string}
              />
            </FormGroup>

            <FormGroup>
              <FormLabel>
                {t("steps.additional.fields.bio.label")}
                {multistepFormStepRules.step3.bio?.required && (
                  <span className="text-danger"> *</span>
                )}
              </FormLabel>
              <TextArea
                {...register(
                  MULTISTEP_FORM_FIELD_NAMES.BIO,
                  multistepFormStepRules.step3.bio
                )}
                rows={MULTISTEP_FORM_CONFIG.TEXTAREA_ROWS}
                placeholder={t("steps.additional.fields.bio.placeholder")}
                isInvalid={!!errors.bio}
                feedback={errors.bio?.message as string}
              />
              {t("steps.additional.fields.bio.helpText") && (
                <BootstrapForm.Text className="text-muted">
                  {t("steps.additional.fields.bio.helpText")}
                </BootstrapForm.Text>
              )}
            </FormGroup>
          </div>
        </Card>
      );

    case MULTISTEP_FORM_STEP_IDS.TERMS:
      return (
        <Card className={styles.stepCard}>
          <div className={styles.stepCardHeader}>
            <h3 className={styles.stepCardTitle}>
              {t("steps.terms.title")}
            </h3>
            <p className={styles.stepCardDescription}>
              {t("steps.terms.description")}
            </p>
          </div>
          <div className={styles.stepCardBody}>
            <Controller
              name={MULTISTEP_FORM_FIELD_NAMES.AGREE_TO_TERMS}
              control={control}
              rules={multistepFormStepRules.step4.agreeToTerms}
              render={({ field }) => (
                <>
                  <Checkbox
                    checked={field.value || false}
                    onChange={async (checked) => {
                      field.onChange(checked);
                      field.onBlur();
                      await trigger(MULTISTEP_FORM_FIELD_NAMES.AGREE_TO_TERMS);
                    }}
                    name={field.name}
                    label={
                      <>
                        {t("steps.terms.fields.agreeToTerms.label")}
                        {multistepFormStepRules.step4.agreeToTerms
                          ?.required && <span className="text-danger"> *</span>}
                      </>
                    }
                    isInvalid={!!errors.agreeToTerms}
                    feedback={errors.agreeToTerms?.message as string}
                  />
                  {errors.agreeToTerms && (
                    <BootstrapForm.Control.Feedback
                      type="invalid"
                      className="d-block"
                    >
                      {errors.agreeToTerms.message as string}
                    </BootstrapForm.Control.Feedback>
                  )}
                  {t("steps.terms.fields.agreeToTerms.helpText") && (
                    <BootstrapForm.Text className="text-muted d-block mb-3">
                      {t("steps.terms.fields.agreeToTerms.helpText")}
                    </BootstrapForm.Text>
                  )}
                </>
              )}
            />

            <Controller
              name={MULTISTEP_FORM_FIELD_NAMES.AGREE_TO_PRIVACY}
              control={control}
              rules={multistepFormStepRules.step4.agreeToPrivacy}
              render={({ field }) => (
                <>
                  <Checkbox
                    checked={field.value || false}
                    onChange={async (checked) => {
                      field.onChange(checked);
                      field.onBlur();
                      await trigger(
                        MULTISTEP_FORM_FIELD_NAMES.AGREE_TO_PRIVACY
                      );
                    }}
                    name={field.name}
                    label={
                      <>
                        {t("steps.terms.fields.agreeToPrivacy.label")}
                        {multistepFormStepRules.step4.agreeToPrivacy
                          ?.required && <span className="text-danger"> *</span>}
                      </>
                    }
                    isInvalid={!!errors.agreeToPrivacy}
                    feedback={errors.agreeToPrivacy?.message as string}
                  />
                  {errors.agreeToPrivacy && (
                    <BootstrapForm.Control.Feedback
                      type="invalid"
                      className="d-block"
                    >
                      {errors.agreeToPrivacy.message as string}
                    </BootstrapForm.Control.Feedback>
                  )}
                  {t("steps.terms.fields.agreeToPrivacy.helpText") && (
                    <BootstrapForm.Text className="text-muted d-block">
                      {t("steps.terms.fields.agreeToPrivacy.helpText")}
                    </BootstrapForm.Text>
                  )}
                </>
              )}
            />
          </div>
        </Card>
      );

    default:
      return null;
  }
};
