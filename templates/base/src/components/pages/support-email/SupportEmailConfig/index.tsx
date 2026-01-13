"use client";

import { Info } from 'lucide-react';
import { useTranslations } from 'next-intl';
import React, { useEffect, useMemo, useState } from 'react';
import { Button, Card, Col, Form, Row, Toast, ToastContainer } from 'react-bootstrap';
import { SubmitHandler,useForm } from 'react-hook-form';

import Input from '@/components/pure-components/Form/Input';
import TextArea from '@/components/pure-components/Form/Input/TextArea';
import LoadingSpinner from '@/components/pure-components/LoadingSpinner';
import {
  useSupportConfigQuery,
  useUpdateSupportConfigMutation,
} from '@/hooks/support';
import type { SupportEmailConfigFormValues } from '@/types/support';
import { SUPPORT_FORM_FIELDS } from '@/types/support';
import { getEmailValidationPattern, validateCommaSeparatedEmails } from '@/utils/form';
import { isValidJsonString, setFormValues, watchFieldValues } from '@/utils/useSyncFormValues';

import FormFieldsTable from './FormFieldsTable';
import styles from './styles.module.scss';

interface SupportEmailConfigProps {
  onCancel?: () => void;
}

const initialValues: Partial<SupportEmailConfigFormValues> = {
  primaryEmail: '',
  ccEmails: '',
  supportFormEnabled: true,
  formFields: {
    fullName: { enabled: false, required: false },
    emailAddress: { enabled: false, required: false },
    subject: { enabled: false, required: false },
    category: { enabled: false, required: false },
    message: { enabled: false, required: false },
    attachment: { enabled: false, required: false },
  },
  autoReplyEnabled: true,
  autoReplyMessage: '',
};

const SupportEmailConfig: React.FC<SupportEmailConfigProps> = ({
  onCancel,
}) => {
  const t = useTranslations('supportEmail');
  const { data: config, isLoading } = useSupportConfigQuery();
  const updateConfig = useUpdateSupportConfigMutation();
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    variant: 'success' | 'danger';
  }>({ show: false, message: '', variant: 'success' });

  // Transform API data to form values
  const defaultValues = useMemo<SupportEmailConfigFormValues>(() => {
    const initialFormFields: SupportEmailConfigFormValues['formFields'] = {
      fullName: { enabled: false, required: false },
      emailAddress: { enabled: false, required: false },
      subject: { enabled: false, required: false },
      category: { enabled: false, required: false },
      message: { enabled: false, required: false },
      attachment: { enabled: false, required: false },
    };

    if (!config) {
      return {
        primaryEmail: '',
        ccEmails: '',
        supportFormEnabled: true,
        formFields: initialFormFields,
        autoReplyEnabled: true,
        autoReplyMessage: '',
      };
    }

    // Map form fields from API response
    const formFieldsMap: SupportEmailConfigFormValues['formFields'] = {
      ...initialFormFields,
    };

    // Field name mapping from API to form keys
    const fieldNameMap: Record<string, keyof SupportEmailConfigFormValues['formFields']> = {
      'fullname': 'fullName',
      'full name': 'fullName',
      'emailaddress': 'emailAddress',
      'email address': 'emailAddress',
      'subject': 'subject',
      'category': 'category',
      'message': 'message',
      'message / query': 'message',
      'message/query': 'message',
      'attachment': 'attachment',
      'attachmentupload': 'attachment',
      'attachment upload': 'attachment',
    };

    config.formFields?.forEach((field) => {
      const normalizedFieldName = field.field
        .toLowerCase()
        .trim()
        .replace(/\s+/g, ' ')
        .replace(/[\/]/g, '/');
      
      const mappedKey = fieldNameMap[normalizedFieldName] || 
        fieldNameMap[normalizedFieldName.replace(/\s+/g, '')] ||
        fieldNameMap[normalizedFieldName.replace(/\s+/g, '').replace(/\//g, '')];
      
      if (mappedKey) {
        formFieldsMap[mappedKey] = {
          enabled: field.enabled,
          required: field.required,
        };
      }
    });

    // Format autoReplyMessage if it's JSON
    let formattedAutoReplyMessage = config.autoReplyMessage || '';
    if (formattedAutoReplyMessage && isValidJsonString(formattedAutoReplyMessage)) {
      try {
        const parsed = JSON.parse(formattedAutoReplyMessage);
        formattedAutoReplyMessage = JSON.stringify(parsed, null, 2);
      } catch (e) {
        // If parsing fails, use original value
        formattedAutoReplyMessage = config.autoReplyMessage || '';
      }
    }

    return {
      primaryEmail: config.primaryEmail || '',
      ccEmails: config.ccEmails || '',
      supportFormEnabled: config.supportFormEnabled ?? true,
      formFields: formFieldsMap,
      autoReplyEnabled: config.autoReplyEnabled ?? true,
      autoReplyMessage: formattedAutoReplyMessage,
    };
  }, [config]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm<SupportEmailConfigFormValues>({
    defaultValues,
  });

  // Update form when config loads
  useEffect(() => {
    if (defaultValues) {
      setFormValues<SupportEmailConfigFormValues>(defaultValues, initialValues, setValue);
    }
  }, [defaultValues, setValue]);

  // Watch multiple fields at once
  const { supportFormEnabled, autoReplyEnabled, autoReplyMessage } = watchFieldValues(
    watch,
    ['supportFormEnabled', 'autoReplyEnabled', 'autoReplyMessage']
  );
  
  // Check if autoReplyMessage contains JSON
  const isJsonMessage = autoReplyMessage && isValidJsonString(autoReplyMessage);

  const onSubmit: SubmitHandler<SupportEmailConfigFormValues> = async (
    data
  ) => {
    try {
      // Transform form data to API format
      const formFields = SUPPORT_FORM_FIELDS.map((field) => {
        const fieldData =
          data.formFields[field.key as keyof typeof data.formFields];
        return {
          field: field.label,
          enabled: fieldData?.enabled || false,
          required: fieldData?.required || false,
        };
      });

      await updateConfig.mutateAsync({
        primaryEmail: data.primaryEmail,
        ccEmails: data.ccEmails,
        supportFormEnabled: data.supportFormEnabled,
        formFields,
        autoReplyEnabled: data.autoReplyEnabled,
        autoReplyMessage: data.autoReplyMessage,
      });

      setToast({
        show: true,
        message: t('messages.saveSuccess'),
        variant: 'success',
      });
    } catch (error: any) {
      setToast({
        show: true,
        message: error.message || t('messages.saveError'),
        variant: 'danger',
      });
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className={styles.supportEmailConfig}>
      <Form onSubmit={handleSubmit(onSubmit)}>
        {/* Support Email Configuration Section */}
        <Card className="mb-4">
          <Card.Header>
            <h5 className="mb-0">{t('emailConfig.title')}</h5>
          </Card.Header>
          <Card.Body>
            <p className="text-muted mb-4">{t('emailConfig.description')}</p>

            <Row>
              <Col md={6}> 
                <Form.Group className="mb-3">
                  <Form.Label className="d-flex align-items-center gap-2">
                    {t('emailConfig.primaryEmail.label')}
                    <span className="text-danger">*</span>
                    <Info size={16} className="text-muted" />
                  </Form.Label>
                  <Input
                    type="email"
                    placeholder={t('emailConfig.primaryEmail.placeholder')}
                    {...register('primaryEmail', {
                      required: t('emailConfig.primaryEmail.required'),
                      ...getEmailValidationPattern(t('emailConfig.primaryEmail.invalid')),
                    })}
                    isInvalid={!!errors.primaryEmail}
                    feedback={errors.primaryEmail?.message}
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="d-flex align-items-center gap-2">
                    {t('emailConfig.ccEmails.label')}
                    <Info size={16} className="text-muted" />
                  </Form.Label>
                  <Input
                    type="text"
                    placeholder={t('emailConfig.ccEmails.placeholder')}
                    {...register('ccEmails', {
                      validate: (value) =>
                        validateCommaSeparatedEmails(
                          value,
                          t('emailConfig.ccEmails.invalid')
                        ),
                    })}
                    isInvalid={!!errors.ccEmails}
                    feedback={errors.ccEmails?.message}
                  />
                  <Form.Text className="text-muted">
                    {t('emailConfig.ccEmails.help')}
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Support Form Section */}
        <Card className="mb-4">
          <Card.Header>
            <h5 className="mb-0">{t('supportForm.title')}</h5>
          </Card.Header>
          <Card.Body>
            <Form.Group className="mb-4">
              <Form.Label>{t('supportForm.status.label')}</Form.Label>
              <Form.Text className="d-block mb-2 text-muted">
                {t('supportForm.status.description')}
              </Form.Text>
              <Form.Check
                type="switch"
                id="supportFormEnabled"
                label={t('supportForm.status.toggleLabel')}
                {...register('supportFormEnabled')}
                checked={supportFormEnabled}
                onChange={(e) => setValue('supportFormEnabled', e.target.checked)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>{t('supportForm.fields.label')}</Form.Label>
              <Form.Text className="d-block mb-3 text-muted">
                {t('supportForm.fields.description')}
              </Form.Text>

              <FormFieldsTable
                watch={watch}
                setValue={setValue}
                supportFormEnabled={Boolean(supportFormEnabled)}
              />

              <div className="d-flex align-items-start gap-2 mt-3">
                <Info size={16} className="text-primary mt-1" />
                <Form.Text className="text-muted">
                  {t('supportForm.fields.info')}
                </Form.Text>
              </div>
            </Form.Group>
          </Card.Body>
        </Card>

        {/* Auto-Reply Configuration Section */}
        <Card className="mb-4">
          <Card.Header>
            <h5 className="mb-0">{t('autoReply.title')}</h5>
          </Card.Header>
          <Card.Body>
            <Form.Group className="mb-4">
              <Form.Label>{t('autoReply.enabled.label')}</Form.Label>
              <Form.Text className="d-block mb-2 text-muted">
                {t('autoReply.enabled.description')}
              </Form.Text>
              <Form.Check
                type="switch"
                id="autoReplyEnabled"
                label={t('autoReply.enabled.toggleLabel')}
                {...register('autoReplyEnabled')}
                checked={autoReplyEnabled}
                onChange={(e) => setValue('autoReplyEnabled', e.target.checked)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>{t('autoReply.message.label')}</Form.Label>
              {isJsonMessage && (
                <Form.Text className="d-block mb-2 text-muted">
                  {t('autoReply.message.jsonHint')}
                </Form.Text>
              )}
              <TextArea
                placeholder={t('autoReply.message.placeholder')}
                rows={8}
                style={{
                  fontFamily: isJsonMessage ? 'monospace' : 'inherit',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                }}
                {...register('autoReplyMessage', {
                  required: autoReplyEnabled
                    ? t('autoReply.message.required')
                    : false,
                })}
                isInvalid={!!errors.autoReplyMessage}
                feedback={errors.autoReplyMessage?.message}
                disabled={!autoReplyEnabled}
              />
            </Form.Group>
          </Card.Body>
        </Card>

        {/* Action Buttons */}
        <div className="d-flex justify-content-end gap-2 mt-4">
          {onCancel && (
            <Button
              variant="secondary"
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              {t('actions.cancel')}
            </Button>
          )}
          <Button
            variant="primary"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                />
                {t('actions.saving')}
              </>
            ) : (
              t('actions.save')
            )}
          </Button>
        </div>
      </Form>

      <ToastContainer
        position="top-end"
        className="p-3"
        style={{ zIndex: 9999 }}
      >
        <Toast
          bg={toast.variant}
          onClose={() => setToast({ ...toast, show: false })}
          show={toast.show}
          delay={3000}
          autohide
        >
          <Toast.Body
            style={{ color: toast.variant === "danger" ? "#fff" : undefined }}
          >
            {toast.message}
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
};

export default SupportEmailConfig;
