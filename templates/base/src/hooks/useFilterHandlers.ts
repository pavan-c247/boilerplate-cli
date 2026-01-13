import { useCallback } from "react";
import { MultiValue, SingleValue } from "react-select";

import { FILTER_MODE } from "@/constants";
import { FilterState, SelectOption } from "@/types/filters";

export const useFilterHandlers = (
  setAppliedFilters: React.Dispatch<React.SetStateAction<FilterState>>
) => {
  const handleSelectFilter = useCallback(
    (
      key: string,
      selected: SingleValue<SelectOption> | MultiValue<SelectOption>,
      isMulti: boolean,
      allValues?: string[]
    ) => {
      let values: string[] = [];

      if (isMulti) {
        values = (selected as MultiValue<SelectOption>).map((opt) =>
          String(opt.value)
        );

        if (values.includes(FILTER_MODE.ALL) && allValues) {
          const selectedCount = values.filter((val) =>
            allValues.includes(val)
          ).length;

          values =
            selectedCount > 0 && selectedCount < allValues.length
              ? []
              : allValues;
        }
      } else {
        values = selected ? [String((selected as SelectOption).value)] : [];
      }

      setAppliedFilters((prev) => {
        if (prev[key]?.join() === values.join()) return prev; // 🛑 NO RE-RENDER
        return { ...prev, [key]: values };
      });
    },
    [setAppliedFilters]
  );

  const handleDateFilter = useCallback(
    (key: string, values: string[]) => {
      const filtered = values.filter(Boolean);

      setAppliedFilters((prev) => {
        if (prev[key]?.join() === filtered.join()) return prev;
        return { ...prev, [key]: filtered };
      });
    },
    [setAppliedFilters]
  );

  return {
    handleSelectFilter,
    handleDateFilter,
  };
};
