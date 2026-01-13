"use client";

import debounce from "lodash/debounce";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { DEFAULT_FILTER_LENGTH, QUERY_KEYS } from "@/constants";
import { UseSearchOptions } from "@/types/search";
import { updateUrlParams } from "@/utils";

export const useSearch = ({
  queryKey = QUERY_KEYS.SEARCH,
  debounceDelay,
}: UseSearchOptions) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const urlValue = searchParams.get(queryKey) || "";
  const [value, setValue] = useState(urlValue);

  /** 🔹 Debounced URL update */
  const debouncedUpdateUrl = useMemo(
    () =>
      debounce((val: string) => {
        updateUrlParams(
          router,
          pathname,
          searchParams,
          { [queryKey]: val },
          { resetPage: true }
        );
      }, debounceDelay),
    [router, pathname, searchParams, debounceDelay, queryKey]
  );

  /** On input change */
  const handleChange = (inputValue: string) => {
    setValue(inputValue);
    const trimmed = inputValue.trim();
    debouncedUpdateUrl.cancel();
    if (trimmed.length >= DEFAULT_FILTER_LENGTH) {
      debouncedUpdateUrl(trimmed);
    } else {
      updateUrlParams(
        router,
        pathname,
        searchParams,
        { [queryKey]: "" },
        { resetPage: true }
      );
    }
  };

  /** Clear search */
  const handleClear = () => {
    debouncedUpdateUrl.cancel();
    setValue("");
    updateUrlParams(
      router,
      pathname,
      searchParams,
      { [queryKey]: "" },
      { resetPage: true }
    );
  };

  /** Sync input when URL changes (back/forward/filter reset) */
  useEffect(() => {
    setValue(urlValue);
  }, [urlValue]);

  /** Cleanup */
  useEffect(() => {
    return () => debouncedUpdateUrl.cancel();
  }, [debouncedUpdateUrl]);

  return {
    value,
    handleChange,
    handleClear,
  };
};
