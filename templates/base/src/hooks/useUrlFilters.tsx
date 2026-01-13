import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { FilterConfig } from "@/types/filters";

export const useUrlFilters = <T extends object>(
  filtersConfig: FilterConfig<T>[]
) => {
  const searchParams = useSearchParams();

  const [appliedFilters, setAppliedFilters] = useState<Record<string, string[]>>({});
  const initializedRef = useRef(false);
  const prevUrlRef = useRef<string>("");

  useEffect(() => {
    const currentUrl = searchParams.toString();
    
    const urlChanged = prevUrlRef.current !== currentUrl;
    prevUrlRef.current = currentUrl;

    if (initializedRef.current && !urlChanged) return;

    const fromUrl: Record<string, string[]> = {};

    filtersConfig.forEach((f) => {
      const value = searchParams.get(f.key as string); // cast needed because URL params are always strings
      if (!value) return;

      try {
        fromUrl[f.key as string] = JSON.parse(value);
      } catch {
        fromUrl[f.key as string] = [value];
      }
    });

    initializedRef.current = true;
    setAppliedFilters(fromUrl);
  }, [searchParams.toString(), filtersConfig.length]);

  return {
    appliedFilters,
    setAppliedFilters,
  };
};
