import { Form } from "react-bootstrap";

import { FILTER_MODE } from "@/constants";
import {
  FilterConfig,
  FilterState,
  HandleSelectFilter,
  SelectMode,
  SelectOption,
} from "@/types/filters";

import DateFilter from "./DateFilter";
import SelectFilter from "./SelectFilter";

export const createFilterRenderers = <T extends FilterState>(
  filters: FilterState,
  handleDateFilter: (key: keyof T, values: string[]) => void,
  handleSelectFilter: HandleSelectFilter
) => ({
  [FILTER_MODE.DATE]: (config: FilterConfig<T>) => (
    <Form.Group>
      <DateFilter
        label={config.label}
        mode={
          (config.selectMode ?? FILTER_MODE.SINGLE) as Extract<
            SelectMode,
            "single" | "range"
          >
        }
        value={(filters[String(config.key)] ?? []).map(String)}
        onChange={(values) =>
          handleDateFilter(config.key, values)
        }
      />
    </Form.Group>
  ),

  [FILTER_MODE.SELECT]: (config: FilterConfig<T>) => {
    const isMultiSelect = config.selectMode === FILTER_MODE.MULTIPLE;

    const selectOptions: SelectOption[] = isMultiSelect
      ? [
          {
            value: FILTER_MODE.ALL,
            label: `${FILTER_MODE.ALL} ${config.label}`,
          },
          ...config.options,
        ]
      : config.options;

    const selectedValues = (filters[String(config.key)] ?? []).map(String);

    const selectedOption = isMultiSelect
      ? selectOptions.filter((option) =>
          selectedValues.includes(String(option.value))
        )
      : selectOptions.find((option) =>
          selectedValues.includes(String(option.value))
        ) ?? null;

    return (
      <Form.Group>
        <SelectFilter
          label={config.label}
          isMulti={isMultiSelect}
          options={selectOptions}
          value={selectedOption}
          onChange={(selected) =>
            handleSelectFilter(
              String(config.key),
              selected,
              isMultiSelect,
              isMultiSelect
                ? config.options.map((option) => String(option.value))
                : undefined
            )
          }
        />
      </Form.Group>
    );
  },
});

