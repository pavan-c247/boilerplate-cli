import { RegisterOptions } from "react-hook-form";
import { z } from "zod";

import { VALIDATION_PATTERNS } from "@/validations/common/patterns";

/**
 * Type for translation function
 */
type TranslationFunction = (
  key: string,
  values?: Record<string, string | number>
) => string;

/**
 * Create Zod schema with translations
 */
export const createMultistepFormZodSchema = (t: TranslationFunction) => {
  const getFieldName = (key: string) => t(`fields.${key}`);
  const getMessage = (key: string, values?: Record<string, string | number>) =>
    t(`messages.${key}`, values);

  return z.object({
    // Step 1: Personal Information
    firstName: z
      .string()
      .min(1, getMessage("required", { field: getFieldName("firstName") }))
      .min(2, getMessage("minLength", { min: 2 }))
      .max(50, getMessage("maxLength", { max: 50 }))
      .regex(VALIDATION_PATTERNS.ALPHA, getMessage("alphaOnly")),

    lastName: z
      .string()
      .min(1, getMessage("required", { field: getFieldName("lastName") }))
      .min(2, getMessage("minLength", { min: 2 }))
      .max(50, getMessage("maxLength", { max: 50 }))
      .regex(VALIDATION_PATTERNS.ALPHA, getMessage("alphaOnly")),

    email: z
      .string()
      .min(1, getMessage("required", { field: getFieldName("email") }))
      .email(getMessage("email")),

    phone: z
      .string()
      .optional()
      .refine(
        (val) =>
          !val ||
          val === "" ||
          /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/.test(
            val
          ),
        getMessage("invalidPhone")
      ),

    // Step 2: Address Information
    address: z
      .string()
      .min(1, getMessage("required", { field: getFieldName("address") })),

    city: z
      .string()
      .min(1, getMessage("required", { field: getFieldName("city") })),

    state: z
      .string()
      .min(1, getMessage("required", { field: getFieldName("state") })),

    zipCode: z
      .string()
      .min(1, getMessage("required", { field: getFieldName("zipCode") }))
      .regex(/^\d{5}(-\d{4})?$/, getMessage("invalidZipCode")),

    country: z
      .string()
      .min(1, getMessage("required", { field: getFieldName("country") })),

    // Step 3: Additional Information
    dateOfBirth: z
      .string()
      .min(1, getMessage("required", { field: getFieldName("dateOfBirth") }))
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
        { message: getMessage("dateAfter1900") }
      ),

    bio: z
      .string()
      .max(500, getMessage("maxLength", { max: 500 }))
      .optional(),

    // Step 4: Terms & Conditions
    agreeToTerms: z.boolean().refine((value) => value === true, {
      message: getMessage("required", { field: getFieldName("agreeToTerms") }),
    }),

    agreeToPrivacy: z.boolean().refine((value) => value === true, {
      message: getMessage("required", {
        field: getFieldName("agreeToPrivacy"),
      }),
    }),
  });
};

/**
 * Type inference from Zod schema (will be set when schema is created)
 */
export type MultistepFormInputs = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  dateOfBirth: string;
  bio?: string;
  agreeToTerms: boolean;
  agreeToPrivacy: boolean;
};

/**
 * Create RHF rules with translations
 */
export const createMultistepFormStepRules = (
  t: TranslationFunction
): {
  step1: {
    firstName: RegisterOptions<MultistepFormInputs, "firstName">;
    lastName: RegisterOptions<MultistepFormInputs, "lastName">;
    email: RegisterOptions<MultistepFormInputs, "email">;
    phone: RegisterOptions<MultistepFormInputs, "phone">;
  };
  step2: {
    address: RegisterOptions<MultistepFormInputs, "address">;
    city: RegisterOptions<MultistepFormInputs, "city">;
    state: RegisterOptions<MultistepFormInputs, "state">;
    zipCode: RegisterOptions<MultistepFormInputs, "zipCode">;
    country: RegisterOptions<MultistepFormInputs, "country">;
  };
  step3: {
    dateOfBirth: RegisterOptions<MultistepFormInputs, "dateOfBirth">;
    bio: RegisterOptions<MultistepFormInputs, "bio">;
  };
  step4: {
    agreeToTerms: RegisterOptions<MultistepFormInputs, "agreeToTerms">;
    agreeToPrivacy: RegisterOptions<MultistepFormInputs, "agreeToPrivacy">;
  };
} => {
  const getFieldName = (key: string) => t(`fields.${key}`);
  const getMessage = (key: string, values?: Record<string, string | number>) =>
    t(`messages.${key}`, values);

  return {
    step1: {
      firstName: {
        required: getMessage("required", { field: getFieldName("firstName") }),
        minLength: {
          value: 2,
          message: getMessage("minLength", { min: 2 }),
        },
        maxLength: {
          value: 50,
          message: getMessage("maxLength", { max: 50 }),
        },
        pattern: {
          value: VALIDATION_PATTERNS.ALPHA,
          message: getMessage("alphaOnly"),
        },
      } satisfies RegisterOptions<MultistepFormInputs, "firstName">,
      lastName: {
        required: getMessage("required", { field: getFieldName("lastName") }),
        minLength: {
          value: 2,
          message: getMessage("minLength", { min: 2 }),
        },
        maxLength: {
          value: 50,
          message: getMessage("maxLength", { max: 50 }),
        },
        pattern: {
          value: VALIDATION_PATTERNS.ALPHA,
          message: getMessage("alphaOnly"),
        },
      } satisfies RegisterOptions<MultistepFormInputs, "lastName">,
      email: {
        required: getMessage("required", { field: getFieldName("email") }),
        pattern: {
          value: VALIDATION_PATTERNS.EMAIL,
          message: getMessage("email"),
        },
      } satisfies RegisterOptions<MultistepFormInputs, "email">,
      phone: {
        pattern: {
          value:
            /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/,
          message: getMessage("invalidPhone"),
        },
      } satisfies RegisterOptions<MultistepFormInputs, "phone">,
    },
    step2: {
      address: {
        required: getMessage("required", { field: getFieldName("address") }),
      } satisfies RegisterOptions<MultistepFormInputs, "address">,
      city: {
        required: getMessage("required", { field: getFieldName("city") }),
      } satisfies RegisterOptions<MultistepFormInputs, "city">,
      state: {
        required: getMessage("required", { field: getFieldName("state") }),
      } satisfies RegisterOptions<MultistepFormInputs, "state">,
      zipCode: {
        required: getMessage("required", { field: getFieldName("zipCode") }),
        pattern: {
          value: /^\d{5}(-\d{4})?$/,
          message: getMessage("invalidZipCode"),
        },
      } satisfies RegisterOptions<MultistepFormInputs, "zipCode">,
      country: {
        required: getMessage("required", { field: getFieldName("country") }),
      } satisfies RegisterOptions<MultistepFormInputs, "country">,
    },
    step3: {
      dateOfBirth: {
        required: getMessage("required", {
          field: getFieldName("dateOfBirth"),
        }),
        pattern: {
          value: /^\d{4}-\d{2}-\d{2}$/,
          message: getMessage("invalidDate"),
        },
        validate: {
          validDate: (value: string) => {
            if (!value) return true;
            const date = new Date(value);
            return !isNaN(date.getTime()) || getMessage("invalidDate");
          },
          notFuture: (value: string) => {
            if (!value) return true;
            return new Date(value) <= new Date() || getMessage("futureDate");
          },
          notBefore1900: (value: string) => {
            if (!value) return true;
            return (
              new Date(value) >= new Date("1900-01-01") ||
              getMessage("dateAfter1900")
            );
          },
        },
      } satisfies RegisterOptions<MultistepFormInputs, "dateOfBirth">,
      bio: {
        maxLength: {
          value: 500,
          message: getMessage("maxLength", { max: 500 }),
        },
      } satisfies RegisterOptions<MultistepFormInputs, "bio">,
    },
    step4: {
      agreeToTerms: {
        required: getMessage("required", {
          field: getFieldName("agreeToTerms"),
        }),
        validate: {
          mustBeTrue: (value: boolean) =>
            value === true ||
            getMessage("required", { field: getFieldName("agreeToTerms") }),
        },
      } satisfies RegisterOptions<MultistepFormInputs, "agreeToTerms">,
      agreeToPrivacy: {
        required: getMessage("required", {
          field: getFieldName("agreeToPrivacy"),
        }),
        validate: {
          mustBeTrue: (value: boolean) =>
            value === true ||
            getMessage("required", { field: getFieldName("agreeToPrivacy") }),
        },
      } satisfies RegisterOptions<MultistepFormInputs, "agreeToPrivacy">,
    },
  };
};
