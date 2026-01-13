import { z } from "zod";


/**
 * Type for translation function
 */
type TranslationFunction = (
  key: string,
  values?: Record<string, any>
) => string;

/**
 * Create User Form Zod schema with translations
 */
export const createUserFormZodSchema = (t: TranslationFunction) => {
  return z.object({
    firstName: z
      .string()
      .min(1, "First name is required")
      .min(2, "First name must be at least 2 characters")
      .max(50, "First name must be at most 50 characters")
      .regex(/^[A-Za-z\s]+$/, "Only letters and spaces are allowed"),

    lastName: z
      .string()
      .max(50, "Last name must be at most 50 characters")
      .regex(/^[A-Za-z\s]+$/, "Only letters and spaces are allowed")
      .optional()
      .or(z.literal("")),

    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email address")
      .max(100, "Email must be at most 100 characters"),

    status: z
      .number()
      .transform((val) => Number(val))
      .pipe(
        z.number().int().refine((val) => val === 0 || val === 1, {
          message: "Invalid status value",
        })
      ),
  });
};

/**
 * Type inference from Zod schema
 */
export type UserFormInputs = z.infer<
  ReturnType<typeof createUserFormZodSchema>
>;
