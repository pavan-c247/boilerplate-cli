"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import React, { useMemo } from "react";
import {
  Card,
  Col,
  Container,
  Form as BootstrapForm,
  Row,
} from "react-bootstrap";
import {
  Controller,
  FieldError,
  FormProvider,
  SubmitHandler,
  useForm,
  useFormContext,
  useWatch,
} from "react-hook-form";

import Button from "@/components/pure-components/Button";
import Checkbox from "@/components/pure-components/Checkbox";
import { Form, FormGroup, FormLabel } from "@/components/pure-components/Form";
import Input from "@/components/pure-components/Form/Input";
import Password from "@/components/pure-components/Form/Input/Password";
import Search from "@/components/pure-components/Form/Input/Search";
import TextArea from "@/components/pure-components/Form/Input/TextArea";
import Select from "@/components/pure-components/Select";
import {
  SIMPLE_FORM_COUNTRY_OPTIONS,
  SIMPLE_FORM_DATE_CONSTRAINTS,
  SIMPLE_FORM_DEFAULT_VALUES,
  SIMPLE_FORM_FILE_CONSTRAINTS,
  SIMPLE_FORM_GENDER_OPTIONS,
  SIMPLE_FORM_INTEREST_OPTIONS,
  SIMPLE_FORM_LANGUAGE_OPTIONS,
} from "@/constants/forms/simpleForm";
import {
  createSimpleFormZodSchema,
  SimpleFormInputs,
} from "@/validations/schemas/forms/simple-form.zod.schema";

/**
 * Inner component that has access to FormProvider context
 */
const SimpleFormContent: React.FC = () => {
  const t = useTranslations("forms.simpleForm");
  const {
    formState: { isSubmitting, errors },
    handleSubmit,
    reset,
    register,
    control,
  } = useFormContext<SimpleFormInputs>();

  const dateRangeStart = useWatch<SimpleFormInputs>({
    name: "date_range_start",
  });

  // Get current datetime in format: YYYY-MM-DDTHH:mm
  const now = useMemo(() => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }, []);

  const onSubmit: SubmitHandler<SimpleFormInputs> = async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    alert(JSON.stringify(data, null, 2));
    reset();
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Col xs={12} md={6}>
        {/* TEXT FIELD */}
        <FormGroup>
          <FormLabel>
            {t("fields.name.label")}
            <span className="text-danger"> *</span>
          </FormLabel>
          <Input
            {...register("name")}
            placeholder={t("fields.name.placeholder")}
            isInvalid={!!errors.name}
            feedback={errors.name?.message as string}
          />
        </FormGroup>
      </Col>
      <Col xs={12} md={6}>
        {/* PASSWORD FIELD */}
        <FormGroup>
          <FormLabel>
            {t("fields.password.label")}
            <span className="text-danger"> *</span>
          </FormLabel>
          <Password
            {...register("password")}
            isInvalid={!!errors.password}
            feedback={errors.password?.message as string}
          />
        </FormGroup>
      </Col>
      <Col xs={12} md={12}>
        {/* TEXTAREA FIELD */}
        <FormGroup>
          <FormLabel>{t("fields.bio.label")}</FormLabel>
          <TextArea
            {...register("bio")}
            rows={4}
            isInvalid={!!errors.bio}
            feedback={errors.bio?.message as string}
          />
        </FormGroup>
      </Col>{" "}
      <Col xs={12} md={6}>
        {/* SEARCH FIELD */}
        <FormGroup>
          <FormLabel>{t("fields.search.label")}</FormLabel>
          <Search
            {...register("search")}
            isInvalid={!!errors.search}
            feedback={errors.search?.message as string}
          />
        </FormGroup>
      </Col>
      <Col xs={12} md={6}>
        {/* DATE */}
        <FormGroup>
          <FormLabel>
            {t("fields.dob.label")}
            <span className="text-danger"> *</span>
          </FormLabel>
          <Input
            type="date"
            {...register("dob")}
            max={SIMPLE_FORM_DATE_CONSTRAINTS.getMaxDate()}
            min={SIMPLE_FORM_DATE_CONSTRAINTS.MIN_DATE}
            isInvalid={!!errors.dob}
            feedback={errors.dob?.message as string}
          />
        </FormGroup>
      </Col>
      <Col xs={12} md={6}>
        {/* DATE + TIME */}
        <FormGroup>
          <FormLabel>{t("fields.event_datetime.label")}</FormLabel>
          <Input
            type="datetime-local"
            {...register("event_datetime")}
            isInvalid={!!errors.event_datetime}
            feedback={errors.event_datetime?.message as string}
          />
        </FormGroup>
      </Col>
      <Col xs={12} md={6}>
        <FormGroup>
          <FormLabel>
            Start Date & Time
            <span className="text-danger"> *</span>
          </FormLabel>
          <Input
            type="datetime-local"
            {...register("date_range_start")}
            min={now}
            isInvalid={!!errors.date_range_start}
            feedback={errors.date_range_start?.message as string}
          />
          <BootstrapForm.Text className="text-muted">
            Start date & time must be today or later
          </BootstrapForm.Text>
        </FormGroup>
      </Col>
      <Col xs={12} md={6}>
        <FormGroup>
          <FormLabel>
            End Date & Time
            <span className="text-danger"> *</span>
          </FormLabel>
          <Input
            type="datetime-local"
            {...register("date_range_end")}
            min={dateRangeStart || now}
            isInvalid={!!errors.date_range_end}
            feedback={errors.date_range_end?.message as string}
          />
          <BootstrapForm.Text className="text-muted">
            End date & time must be after start
          </BootstrapForm.Text>
        </FormGroup>
      </Col>
      <Col xs={12} md={6}>
        {" "}
        {/* TIME (24 HR) */}
        <FormGroup>
          <FormLabel>{t("fields.preferred_time_am_pm.label")}</FormLabel>
          <Input
            type="time"
            {...register("preferred_time_am_pm")}
            isInvalid={!!errors.preferred_time_am_pm}
            feedback={errors.preferred_time_am_pm?.message as string}
          />
        </FormGroup>
      </Col>
      <Col xs={12} md={6}>
        {/* SINGLE FILE UPLOAD */}
        <FormGroup>
          <FormLabel>
            {t("fields.profile_image.label")}
            <span className="text-danger"> *</span>
          </FormLabel>
          <Controller
            name="profile_image"
            control={control}
            render={({ field }) => {
              // FileUpload uses its own form internally, so we need to sync values
              return (
                <div>
                  <input
                    type="file"
                    accept={SIMPLE_FORM_FILE_CONSTRAINTS.PROFILE_IMAGE.accept}
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      field.onChange(file);
                      field.onBlur();
                    }}
                    className="form-control"
                  />
                  {errors.profile_image && (
                    <BootstrapForm.Control.Feedback
                      type="invalid"
                      className="d-block"
                    >
                      {errors.profile_image.message as string}
                    </BootstrapForm.Control.Feedback>
                  )}
                </div>
              );
            }}
          />
          {t("fields.profile_image.helpText") && (
            <BootstrapForm.Text className="text-muted">
              {t("fields.profile_image.helpText")}
            </BootstrapForm.Text>
          )}
        </FormGroup>
      </Col>
      <Col xs={12} md={6}>
        {/* MULTIPLE FILE UPLOAD */}
        <FormGroup>
          <FormLabel>{t("fields.documents.label")}</FormLabel>
          <Controller
            name="documents"
            control={control}
            render={({ field }) => {
              const files = field.value || [];
              return (
                <div>
                  <input
                    type="file"
                    accept={SIMPLE_FORM_FILE_CONSTRAINTS.DOCUMENTS.accept}
                    multiple
                    onChange={(e) => {
                      const selectedFiles = Array.from(e.target.files || []);
                      field.onChange(selectedFiles);
                      field.onBlur();
                    }}
                    className="form-control"
                  />
                  {errors.documents && (
                    <BootstrapForm.Control.Feedback
                      type="invalid"
                      className="d-block"
                    >
                      {errors.documents.message as string}
                    </BootstrapForm.Control.Feedback>
                  )}
                </div>
              );
            }}
          />
          {t("fields.documents.helpText") && (
            <BootstrapForm.Text className="text-muted">
              {t("fields.documents.helpText")}
            </BootstrapForm.Text>
          )}
        </FormGroup>
      </Col>
      <Col xs={12} md={6}>
        {/* Radio Group Field */}
        <FormGroup>
          <FormLabel className="d-block">
            {t("fields.gender.label")}
            <span className="text-danger"> *</span>
          </FormLabel>
          <Controller
            name="gender"
            control={control}
            render={({ field }) => (
              <>
                {SIMPLE_FORM_GENDER_OPTIONS.map((option) => (
                  <BootstrapForm.Check
                    key={option.value}
                    type="radio"
                    id={`gender-${option.value}`}
                    label={option.label}
                    name={field.name}
                    value={option.value}
                    checked={field.value === option.value}
                    onChange={(e) => {
                      field.onChange(e.target.value);
                      field.onBlur();
                    }}
                    isInvalid={!!errors.gender}
                    className="d-inline-block me-3"
                  />
                ))}
                {errors.gender && (
                  <BootstrapForm.Control.Feedback
                    type="invalid"
                    className="d-block"
                  >
                    {errors.gender.message as string}
                  </BootstrapForm.Control.Feedback>
                )}
              </>
            )}
          />
          {t("fields.gender.helpText") && (
            <BootstrapForm.Text className="text-muted d-block">
              {t("fields.gender.helpText")}
            </BootstrapForm.Text>
          )}
        </FormGroup>
      </Col>
      <Col xs={12} md={6}>
        {/* Checkbox Group Field */}
        <FormGroup>
          <FormLabel className="d-block">
            {t("fields.interests.label")}
            <span className="text-danger"> *</span>
          </FormLabel>
          <Controller
            name="interests"
            control={control}
            render={({ field }) => {
              const selectedValues = field.value || [];
              return (
                <>
                  {SIMPLE_FORM_INTEREST_OPTIONS.map((option) => (
                    <BootstrapForm.Check
                      key={option.value}
                      type="checkbox"
                      id={`interest-${option.value}`}
                      label={option.label}
                      checked={selectedValues.includes(option.value)}
                      onChange={(e) => {
                        const newValue = e.target.checked
                          ? [...selectedValues, option.value]
                          : selectedValues.filter((v) => v !== option.value);
                        field.onChange(newValue);
                        field.onBlur();
                      }}
                      className="d-inline-block me-3"
                    />
                  ))}
                  {errors.interests && (
                    <BootstrapForm.Control.Feedback
                      type="invalid"
                      className="d-block"
                    >
                      {errors.interests.message as string}
                    </BootstrapForm.Control.Feedback>
                  )}
                </>
              );
            }}
          />
          {t("fields.interests.helpText") && (
            <BootstrapForm.Text className="text-muted d-block">
              {t("fields.interests.helpText")}
            </BootstrapForm.Text>
          )}
        </FormGroup>
      </Col>
      <Col xs={12} md={6}>
        {/* Single Select Field */}
        <FormGroup>
          <FormLabel>
            {t("fields.country.label")}
            <span className="text-danger"> *</span>
          </FormLabel>
          <Select
            {...register("country")}
            options={[
              {
                value: "",
                label: t("fields.country.placeholder"),
                disabled: true,
              },
              ...SIMPLE_FORM_COUNTRY_OPTIONS.map((option) => ({
                value: String(option.value),
                label: option.label,
              })),
            ]}
            className={errors.country ? "is-invalid" : ""}
          />
          {errors.country && (
            <BootstrapForm.Control.Feedback type="invalid">
              {errors.country.message as string}
            </BootstrapForm.Control.Feedback>
          )}
          {t("fields.country.helpText") && (
            <BootstrapForm.Text className="text-muted">
              {t("fields.country.helpText")}
            </BootstrapForm.Text>
          )}
        </FormGroup>
      </Col>
      <Col xs={12} md={6}>
        {/* Multi-Select Field */}
        <FormGroup>
          <FormLabel>
            {t("fields.languages.label")}
            <span className="text-danger"> *</span>
          </FormLabel>
          <Controller
            name="languages"
            control={control}
            render={({ field }) => {
              const selectedValues = field.value || [];
              return (
                <>
                  <BootstrapForm.Select
                    multiple
                    value={selectedValues.map(String)}
                    onChange={(e) => {
                      const selected = Array.from(
                        e.target.selectedOptions,
                        (option) => option.value
                      );
                      field.onChange(selected);
                      field.onBlur();
                    }}
                    className={errors.languages ? "is-invalid" : ""}
                  >
                    <option value="" disabled>
                      {t("fields.languages.placeholder")}
                    </option>
                    {SIMPLE_FORM_LANGUAGE_OPTIONS.map((option) => (
                      <option key={option.value} value={String(option.value)}>
                        {option.label}
                      </option>
                    ))}
                  </BootstrapForm.Select>
                  {errors.languages && (
                    <BootstrapForm.Control.Feedback type="invalid">
                      {errors.languages.message as string}
                    </BootstrapForm.Control.Feedback>
                  )}
                </>
              );
            }}
          />
          {t("fields.languages.helpText") && (
            <BootstrapForm.Text className="text-muted">
              {t("fields.languages.helpText")}
            </BootstrapForm.Text>
          )}
        </FormGroup>
      </Col>
      <Col xs={12} md={6}>
        {/* Single Checkbox Field */}
        <FormGroup>
          <Controller
            name="agreeToTerms"
            control={control}
            render={({ field }) => (
              <>
                <Checkbox
                  checked={field.value || false}
                  onChange={(checked) => {
                    field.onChange(checked);
                    field.onBlur();
                  }}
                  name={field.name}
                  label={
                    <>
                      {t("fields.agreeToTerms.label")}
                      <span className="text-danger"> *</span>
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
                {t("fields.agreeToTerms.helpText") && (
                  <BootstrapForm.Text className="text-muted d-block">
                    {t("fields.agreeToTerms.helpText")}
                  </BootstrapForm.Text>
                )}
              </>
            )}
          />
        </FormGroup>
      </Col>
      {/* Debug: Show form errors */}
      {Object.keys(errors).length > 0 && (
        <div className="alert alert-danger mt-3">
          <strong>{t("messages.formHasErrors")}</strong>
          <ul className="mb-0 mt-2">
            {Object.entries(errors).map(([field, error]) => {
              const errorMessage =
                error && typeof error === "object" && "message" in error
                  ? (error as FieldError).message
                  : null;
              return (
                <li key={field}>
                  <strong>{field}:</strong>{" "}
                  {errorMessage || t("messages.invalidField")}
                </li>
              );
            })}
          </ul>
        </div>
      )}
      {/* ACTIONS */}
      <div className="d-flex gap-2 justify-content-end mt-4">
        <Button
          type="button"
          variant="secondary"
          onClick={() => reset()}
          disabled={isSubmitting}
        >
          {t("buttons.reset")}
        </Button>
        <Button type="submit" variant="primary" disabled={isSubmitting}>
          {isSubmitting ? t("buttons.submitting") : t("buttons.submit")}
        </Button>
      </div>
    </Form>
  );
};

const SimpleForm = () => {
  const t = useTranslations("forms.simpleForm");
  const tValidations = useTranslations("validations");

  // Create Zod schema with translations
  const schema = React.useMemo(
    () =>
      createSimpleFormZodSchema((key: string, values?: Record<string, any>) => {
        return tValidations(key, values);
      }),
    [tValidations]
  );

  const methods = useForm<SimpleFormInputs>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: SIMPLE_FORM_DEFAULT_VALUES,
  });

  return (
    <Container fluid className="py-4">
      <div className="mb-4">
        <h1 className="fs-xl fw-semibold">{t("title")}</h1>
        <p className="fs-sm fw-medium">{t("description")}</p>
      </div>
      <Row>
        <Col xs md="6" lg="6">
          <Card className="shadow-sm">
            <Card.Header>
              <h2 className="mb-0 fs-lg fw-semibold">
                {t("sections.personalInformation.title")}
              </h2>
            </Card.Header>

            <Card.Body>
              <FormProvider {...methods}>
                <SimpleFormContent />
              </FormProvider>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} md={6} lg={6}>
          <div className="sticky-wrapper">
            <Card className="shadow-sm">
              <Card.Header>
                <h3 className="mb-0 fs-lg fw-semibold">
                  {t("sections.debugValues.title")}
                </h3>
              </Card.Header>
              <Card.Body>
                <pre className="p-3 rounded fs-sm">
                  {JSON.stringify(methods.watch(), null, 2)}
                </pre>
              </Card.Body>
            </Card>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default SimpleForm;
