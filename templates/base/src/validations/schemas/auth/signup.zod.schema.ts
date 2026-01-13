import { z } from "zod";


/**
 * Type for translation function
 */
type TranslationFunction = (
  key: string,
  values?: Record<string, any>
) => string;

/**
 * Create Signup Form Zod schema with translations
 */
export const createSignupFormZodSchema = (t: TranslationFunction) => {
  return z
    .object({
      firstName: z
        .string()
        .min(1, t('messages.auth.firstNameRequired'))
        .min(2, t('messages.auth.firstNameMinLength'))
        .max(50, t('messages.auth.firstNameMaxLength'))
        .regex(/^[A-Za-z\s]+$/, t('messages.auth.firstNamePattern')),

      lastName: z
        .string()
        .max(50, "Last name must be at most 50 characters")
        .regex(/^[A-Za-z\s]+$/, "Only letters and spaces are allowed")
        .optional()
        .or(z.literal("")),

      email: z
        .string()
        .min(1, t('messages.auth.emailRequired'))
        .email(t('messages.email'))
        .max(100, t('messages.auth.emailMaxLength')),

      password: z
        .string()
        .min(1, t('messages.auth.passwordRequired'))
        .min(8, t('messages.auth.passwordMinLength'))
        .max(64, t('messages.auth.passwordMaxLength'))
        .regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).+$/,
          t('messages.auth.passwordPattern')
        ),
        hasAcceptedTerms: z
        .boolean()
        .refine((val) => val === true, {
          message: t('messages.auth.termsRequired'),
        }),

      confirmPassword: z.string().min(1, t('messages.auth.confirmPasswordRequired')),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t('messages.passwordMatch'),
      path: ["confirmPassword"],
    });
};

/**
 * Type inference from Zod schema
 */
export type SignupFormInputs = z.infer<
  ReturnType<typeof createSignupFormZodSchema>
>;
