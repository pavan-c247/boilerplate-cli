import { z } from "zod";

import { VALIDATION_PATTERNS } from "@/validations/common/patterns";

/**
 * Type for translation function
 */
type TranslationFunction = (
  key: string,
  values?: Record<string, any>
) => string;

/**
 * Create Zod schema with translations
 */
export const createSimpleFormZodSchema = (t: TranslationFunction) => {
  const getFieldName = (key: string) => t(`fields.${key}`);
  const getMessage = (key: string, values?: Record<string, any>) =>
    t(`messages.${key}`, values);

  return z
    .object({
      // Name field
      name: z
        .string()
        .min(1, getMessage("required", { field: getFieldName("name") }))
        .min(2, getMessage("minLength", { min: 2 }))
        .max(50, getMessage("maxLength", { max: 50 }))
        .regex(
          VALIDATION_PATTERNS.ALPHA,
          "Only letters and spaces are allowed"
        ),

      // Password field
      password: z
        .string()
        .min(1, getMessage("required", { field: getFieldName("password") }))
        .min(8, "Password must be at least 8 characters")
        .max(64, "Password must not exceed 64 characters")
        .regex(
          /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]/,
          "Password must contain at least one letter and one number"
        ),

      // Optional search field
      search: z
        .string()
        .max(100, getMessage("maxLength", { max: 100 }))
        .optional(),

      // Optional bio field
      bio: z
        .string()
        .max(300, getMessage("maxLength", { max: 300 }))
        .optional(),

      // Date of Birth
      dob: z
        .string()
        .min(1, getMessage("required", { field: getFieldName("dob") }))
        .regex(/^\d{4}-\d{2}-\d{2}$/, getMessage("invalidDate"))
        .refine(
          (value) => {
            const date = new Date(value);
            return !isNaN(date.getTime());
          },
          { message: getMessage("invalidDate") }
        )
        .refine(
          (value) => {
            const date = new Date(value);
            return date <= new Date();
          },
          { message: getMessage("futureDate") }
        )
        .refine(
          (value) => {
            const date = new Date(value);
            return date >= new Date("1900-01-01");
          },
          { message: "Date of Birth must be after 1900" }
        ),

      // Optional event datetime
      event_datetime: z
        .string()
        .regex(
          /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/,
          "Please enter a valid date and time (YYYY-MM-DDTHH:mm)"
        )
        .optional(),

      // Date range start
      date_range_start: z
        .string()
        .min(1, getMessage("required", { field: "Start Date & Time" }))
        .regex(
          /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/,
          "Please enter a valid date and time (YYYY-MM-DDTHH:mm)"
        )
        .refine(
          (value) => {
            const date = new Date(value);
            return !isNaN(date.getTime());
          },
          { message: "Please enter a valid date and time" }
        )
        .refine(
          (value) => {
            const date = new Date(value);
            const now = new Date();
            return date >= now;
          },
          { message: "Start date & time must be today or later" }
        ),

      // Date range end
      date_range_end: z
        .string()
        .min(1, getMessage("required", { field: "End Date & Time" }))
        .regex(
          /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/,
          "Please enter a valid date and time (YYYY-MM-DDTHH:mm)"
        )
        .refine(
          (value) => {
            const date = new Date(value);
            return !isNaN(date.getTime());
          },
          { message: "Please enter a valid date and time" }
        ),

      // Optional preferred time
      preferred_time_am_pm: z
        .string()
        .regex(/^\d{2}:\d{2}$/, "Please enter a valid time (HH:mm)")
        .optional(),

      // Profile image (file)
      profile_image: z
        .any()
        .refine((value) => value !== null && value !== undefined, {
          message: getMessage("required", {
            field: getFieldName("profile_image"),
          }),
        }),

      // Optional documents (array of files)
      documents: z.array(z.any()).optional(),

      // Gender (radio group)
      gender: z
        .string()
        .min(1, getMessage("required", { field: getFieldName("gender") }))
        .refine((value) => ["male", "female", "other"].includes(value), {
          message: "Please select a valid gender option",
        }),

      // Interests (checkbox group)
      interests: z
        .array(z.union([z.string(), z.number()]))
        .min(1, "Please select at least one interest"),

      // Country (single select)
      country: z
        .string()
        .min(1, getMessage("required", { field: getFieldName("country") }))
        .refine(
          (value) =>
            ["usa", "uk", "canada", "australia", "india"].includes(value),
          { message: "Please select a valid country option" }
        ),

      // Languages (multi-select)
      languages: z
        .array(z.string())
        .min(1, "Please select at least one language"),

      // Agree to terms (single checkbox)
      agreeToTerms: z.boolean().refine((value) => value === true, {
        message: getMessage("required", {
          field: getFieldName("agreeToTerms"),
        }),
      }),
    })
    .refine(
      (data) => {
        // Validate that date_range_end is after date_range_start
        if (data.date_range_start && data.date_range_end) {
          const startDate = new Date(data.date_range_start);
          const endDate = new Date(data.date_range_end);
          return endDate > startDate;
        }
        return true;
      },
      {
        message: "End date & time must be after start",
        path: ["date_range_end"],
      }
    );
};

/**
 * Type inference from Zod schema
 */
export type SimpleFormInputs = z.infer<
  ReturnType<typeof createSimpleFormZodSchema>
>;
