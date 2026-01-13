import { z } from "zod";

/**
 * Type for translation function
 */
type TranslationFunction = (key: string, values?: Record<string, any>) => string;

/**
 * Create Set Password Form Zod schema with translations
 */
export const createSetPasswordFormZodSchema = (t: TranslationFunction) => {
  return z
    .object({
      password: z
        .string()
        .min(1, t("messages.auth.passwordRequired"))
        .min(8, t("messages.auth.passwordMinLength"))
        .max(64, t("messages.auth.passwordMaxLength"))
        .regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).+$/,
          t("messages.auth.passwordPattern"),
        ),

      confirmPassword: z.string().min(1, t("messages.auth.confirmPasswordRequired")),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("messages.passwordMatch"),
      path: ["confirmPassword"],
    });
};

/**
 * Type inference from Zod schema
 */
export type SetPasswordInputs = z.infer<ReturnType<typeof createSetPasswordFormZodSchema>>;
