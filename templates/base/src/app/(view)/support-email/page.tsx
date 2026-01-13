'use client';

import { useTranslations } from 'next-intl';
import React from 'react';

import SupportEmailConfig from '@/components/pages/support-email/SupportEmailConfig';

export default function SupportEmailPage() {
  const t = useTranslations('supportEmail');

  return (
    <div className="p-4">
      <h1 className="mb-4">{t('pageTitle')}</h1>
      <SupportEmailConfig />
    </div>
  );
}
