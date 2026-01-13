type TranslationFunction = (
  key: string,
  values?: Record<string, any>
) => string;

export const createValidationMessages = (t: TranslationFunction) => {
  return {
    REQUIRED: (field: string) => t("messages.required", { field }),
    EMAIL: t("messages.email"),
    MIN_LENGTH: (min: number) => t("messages.minLength", { min }),
    MAX_LENGTH: (max: number) => t("messages.maxLength", { max }),
    MIN: (min: number) => t("messages.min", { min }),
    MAX: (max: number) => t("messages.max", { max }),
    PATTERN: t("messages.pattern"),
    PASSWORD: t("messages.password"),
    PASSWORD_MATCH: t("messages.passwordMatch"),
    INVALID_URL: t("messages.invalidUrl"),
    INVALID_PHONE: t("messages.invalidPhone"),
    INVALID_DATE: t("messages.invalidDate"),
    FUTURE_DATE: t("messages.futureDate"),
    PAST_DATE: t("messages.pastDate"),
  };
};
