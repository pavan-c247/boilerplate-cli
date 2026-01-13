import { ENVIRONMENTS } from "@constants/index";

import { Logger } from "@/types/logger";

// logger.ts
const isDevelopment: boolean =
  process.env.NODE_ENV === ENVIRONMENTS.DEVELOPMENT;

const logger: Logger = {
  log: (...args: unknown[]): void => {
    if (isDevelopment) {
      // eslint-disable-next-line no-console
      console.log(...args);
    }
  },

  error: (...args: unknown[]): void => {
    if (isDevelopment) {
      // eslint-disable-next-line no-console
      console.error(...args);
    }
  },

  warn: (...args: unknown[]): void => {
    if (isDevelopment) {
      // eslint-disable-next-line no-console
      console.warn(...args);
    }
  },

  info: (...args: unknown[]): void => {
    if (isDevelopment) {
      // eslint-disable-next-line no-console
      console.info(...args);
    }
  },
};

export default logger;
