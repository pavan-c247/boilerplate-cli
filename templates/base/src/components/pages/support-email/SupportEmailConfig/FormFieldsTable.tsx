"use client";

import { useTranslations } from 'next-intl';
import React from 'react';
import { Form, Table } from 'react-bootstrap';
import { UseFormSetValue, UseFormWatch } from 'react-hook-form';

import type { SupportEmailConfigFormValues } from '@/types/support';
import { SUPPORT_FORM_FIELDS } from '@/types/support';

interface FormFieldsTableProps {
  watch: UseFormWatch<SupportEmailConfigFormValues>;
  setValue: UseFormSetValue<SupportEmailConfigFormValues>;
  supportFormEnabled: boolean;
}

const FormFieldsTable: React.FC<FormFieldsTableProps> = ({
  watch,
  setValue,
  supportFormEnabled,
}) => {
  const t = useTranslations('supportEmail');

  const handleEnabledChange = (
    fieldKey: keyof SupportEmailConfigFormValues['formFields'],
    checked: boolean
  ) => {
    setValue(`formFields.${fieldKey}.enabled` as any, checked);
    // If disabling, also uncheck required
    if (!checked) {
      setValue(`formFields.${fieldKey}.required` as any, false);
    }
  };

  return (
    <div className="table-responsive">
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>{t('supportForm.fields.table.field')}</th>
            <th>{t('supportForm.fields.table.enabled')}</th>
            <th>{t('supportForm.fields.table.required')}</th>
          </tr>
        </thead>
        <tbody>
          {SUPPORT_FORM_FIELDS.map((field) => {
            const fieldKey = field.key as keyof SupportEmailConfigFormValues['formFields'];
            const formFields = watch('formFields');
            const fieldData = formFields?.[fieldKey];
            const enabled = Boolean(fieldData?.enabled);
            const required = Boolean(fieldData?.required);

            return (
              <tr key={field.key}>
                <td>{field.label}</td>
                <td>
                  <Form.Check
                    type="checkbox"
                    checked={enabled}
                    onChange={(e) => handleEnabledChange(fieldKey, e.target.checked)}
                    disabled={!supportFormEnabled}
                  />
                </td>
                <td>
                  <Form.Check
                    type="checkbox"
                    checked={required}
                    onChange={(e) =>
                      setValue(
                        `formFields.${fieldKey}.required` as any,
                        e.target.checked
                      )
                    }
                    disabled={!supportFormEnabled || !enabled}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
};

export default FormFieldsTable;
