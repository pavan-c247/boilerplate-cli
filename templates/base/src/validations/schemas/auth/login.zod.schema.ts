import { z } from "zod";


/**
 * Type for translation function
 */
type TranslationFunction = (
  key: string,
  values?: Record<string, any>
) => string;

/**
 * Create Login Form Zod schema with translations
 */
export const createLoginFormZodSchema = (t: TranslationFunction) => {
  return z.object({
    email: z
      .string()
      .nonempty(t('messages.auth.emailRequired'))
      .email('Please enter a valid email address'),

    password: z.string().nonempty(t('messages.auth.passwordRequired')),

    rememberMe: z.boolean().optional(),
  });
};

/**
 * Type inference from Zod schema
 */
export type LoginFormInputs = z.infer<
  ReturnType<typeof createLoginFormZodSchema>
>;
