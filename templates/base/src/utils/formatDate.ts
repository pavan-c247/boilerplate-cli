import dayjs from "dayjs";

import { DATE_FORMATS } from "@/constants";
import { SelectMode } from "@/types/filters";

export function formatDate(
  date: string,
  format: string = DATE_FORMATS.DEFAULT_DATE_FORMAT
): string {
  return dayjs(date).format(format);
}
export const normalizeDateValues = (
  mode: SelectMode,
  values: string[]
): string[] => {
  if (mode === "single") {
    return values[0] ? [values[0]] : [];
  }

  const [from, to] = values;

  // If from is cleared → reset everything
  if (!from) return [];

  // If to < from → drop to
  if (to && to < from) {
    return [from];
  }

  return [from, to].filter(Boolean);
};

export const getMinToDate = (from?: string) => {
  return from || undefined;
};
