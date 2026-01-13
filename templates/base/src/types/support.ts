// ============================================================================
// SUPPORT EMAIL CONFIGURATION TYPES
// ============================================================================

export interface SupportFormField {
  field: string;
  enabled: boolean;
  required: boolean;
}

export interface SupportEmailConfig {
  primaryEmail: string;
  ccEmails: string;
  supportFormEnabled: boolean;
  formFields: SupportFormField[];
  autoReplyEnabled: boolean;
  autoReplyMessage: string;
}

export interface SupportEmailConfigFormValues {
  primaryEmail: string;
  ccEmails: string;
  supportFormEnabled: boolean;
  formFields: {
    fullName: { enabled: boolean; required: boolean };
    emailAddress: { enabled: boolean; required: boolean };
    subject: { enabled: boolean; required: boolean };
    category: { enabled: boolean; required: boolean };
    message: { enabled: boolean; required: boolean };
    attachment: { enabled: boolean; required: boolean };
  };
  autoReplyEnabled: boolean;
  autoReplyMessage: string;
}

export const SUPPORT_FORM_FIELDS = [
  { key: 'fullName', label: 'Full Name' },
  { key: 'emailAddress', label: 'Email Address' },
  { key: 'subject', label: 'Subject' },
  { key: 'category', label: 'Category' },
  { key: 'message', label: 'Message / Query' },
  { key: 'attachment', label: 'Attachment Upload' },
] as const;

export const SUPPORT_CATEGORIES = [
  'General Inquiry',
  'Billing & Subscription',
  'Technical Issue',
  'PRIME AI',
  'EDGE / PULSE Tools',
  'Account & Login',
] as const;
