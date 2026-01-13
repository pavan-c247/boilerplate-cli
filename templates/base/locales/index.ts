import auth from './en/auth/index.json';
import cms from './en/cms/index.json';
import common from './en/common/index.json';
import dashboard from './en/dashboard/index.json';
import faq from './en/faq/index.json';
import dynamicForm from './en/forms/dynamicForm.json';
import forms from './en/forms/index.json';
import header from './en/header/header.json'
import listing from "./en/listing/index.json";
import lms from './en/lms/index.json';
import sidebar from './en/sidebar/index.json'
import supportEmail from './en/support-email/index.json';
import users from './en/users/index.json';
import validations from './en/validations/index.json';
import verify from './en/verify/index.json';

export const messages = {
  en: {
    common,
    auth,
    dashboard,
    users,
    faq,
    cms,
    forms,
    validations,
    sidebar,
    header,
    listing,
    verify,
    supportEmail,
    lms,
    dynamicForm
  },
};

export type Messages = typeof messages;
export type Locale = keyof Messages;
