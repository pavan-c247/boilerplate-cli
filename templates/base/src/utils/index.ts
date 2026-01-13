import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { ReadonlyURLSearchParams } from "next/navigation";

import { DEFAULT_PAGINATION } from "@/constants";
import { UpdateUrlOptions } from "@/types/filters";

export const updateUrlParams = (
  router: AppRouterInstance,
  pathname: string,
  searchParams: ReadonlyURLSearchParams,
  paramsToUpdate: Record<string, unknown>,
  options: UpdateUrlOptions = {}
) => {
  const {
    resetPage = true,
    page = DEFAULT_PAGINATION.page,
    scroll = false,
  } = options;

  const params = new URLSearchParams(searchParams.toString());

  /** Remove only keys we are updating */
  Object.keys(paramsToUpdate).forEach((key) => {
    params.delete(key);
  });

  /** Add new values */
  Object.entries(paramsToUpdate).forEach(([key, value]) => {
    if (!value || (Array.isArray(value) && value.length === 0)) {
      params.delete(key);
      return;
    }

    if (Array.isArray(value)) {
      params.set(key, JSON.stringify(value));
    } else {
      params.set(key, String(value));
    }
  });

  /** Pagination – ALWAYS handle */
  params.set("page", String(resetPage ? page : params.get("page") ?? page));
  router.replace(`${pathname}?${params.toString()}`, { scroll });
};

/* Convert filter values in string */
export const getFiltersAsString = (
  filters: Record<string, (string | number)[]>
): string => {
  const base: Record<string, (string | number)[]> = {};

  Object.entries(filters).forEach(([key, value]) => {
    if (Array.isArray(value) && value.length > 0) {
      base[key] = value;
    }
  });

  return JSON.stringify(base);
};

  // Password strength logic (simple, for demo)
 export const getPasswordStrength = (pw: string ,tAuth :(key: string) => string) => {
    let score = 0;
    if (pw.length >= 8) score++;

    if (/[A-Z]/.test(pw)) score++;
    if (/[a-z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    if (score <= 2) return tAuth('signup.passwordStrength.weak');
    if (score === 3 || score === 4) return tAuth('signup.passwordStrength.medium');
    if (score === 5) return tAuth('signup.passwordStrength.strong');
    return "";
  };
// Role Management Functions
export {
  ROLE_MAPPING,
  ROLE_NAMES,
  getRoleDisplayName,
} from "./roleManager";
