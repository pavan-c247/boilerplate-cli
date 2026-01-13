export type LoggerMethod = (...args: unknown[]) => void;

export interface Logger {
  log: LoggerMethod;
  error: LoggerMethod;
  warn: LoggerMethod;
  info: LoggerMethod;
}
