import { z } from "zod";

/**
 * Type for translation function
 */
type TranslationFunction = (
  key: string,
  values?: Record<string, any>
) => string;

/**
 * Create Profile Form Zod schema with translations
 */
export const createProfileFormZodSchema = (t: TranslationFunction) => {
  return z.object({
    // First Name field
    firstName: z
      .string()
      .min(1, t('messages.auth.firstNameRequired'))
      .min(2, t('messages.auth.firstNameMinLength'))
      .max(50, t('messages.auth.firstNameMaxLength'))
      .regex(/^[a-zA-Z\s]*$/, t('messages.auth.firstNamePattern')),

    // Last Name field
    lastName: z
      .string()
      .min(1, t('messages.profile.lastNameRequired'))
      .min(2, t('messages.profile.lastNameMinLength'))
      .max(50, t('messages.profile.lastNameMaxLength'))
      .regex(/^[a-zA-Z\s]*$/, t('messages.profile.lastNamePattern')),

    // Job Title field
    role: z
      .string()
      .min(1, t('messages.profile.roleRequired'))
      .min(2, t('messages.profile.roleMinLength'))
      .max(100, t('messages.profile.roleMaxLength'))
      .optional(),
    // Email field (read-only, but included for type safety)
    email: z
      .string()
      .min(1, t('messages.auth.emailRequired'))
      .email(t('"Invalid email address"'))
      .optional()
  });
};

/**
 * Create Password Change Zod schema with translations
 */
export const createPasswordFormZodSchema = (t: TranslationFunction) => {
  return z
    .object({
      currentPassword: z
        .string()
        .min(1, t('messages.profile.currentPasswordRequired'))
        .min(8, t('messages.profile.currentPasswordMinLength')),

      newPassword: z
        .string()
        .min(1, t('messages.auth.passwordRequired'))
        .min(8, t('messages.auth.passwordMinLength'))
        .max(64, t('messages.auth.passwordMaxLength'))
        .regex(
          /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,64}$/,
          t('messages.auth.passwordPattern')
        ),

      confirmPassword: z
        .string()
        .min(8, t('messages.profile.confirmPasswordMinLength')),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: t('messages.passwordMatch'),
      path: ["confirmPassword"],
    })
    .refine((data) => data.currentPassword !== data.newPassword, {
      message: t('messages.profile.passwordDifferent'),
      path: ["newPassword"],
    });
};


/**
 * Type inference from Zod schemas
 */
export type ProfileFormInputs = z.infer<
  ReturnType<typeof createProfileFormZodSchema>
>;

export type PasswordFormInputs = z.infer<
  ReturnType<typeof createPasswordFormZodSchema>
>;
