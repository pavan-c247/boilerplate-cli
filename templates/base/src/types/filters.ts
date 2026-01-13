import { MultiValue, SingleValue } from "react-select";

export type SelectMode = "single" | "multiple" | "range";

export interface SelectOption {
  label: string;
  value: string;
}
export type FilterType = "select" | "date";
export interface FilterConfig<T extends object> {
  key: keyof T;
  label: string;
  type: FilterType;
  options: SelectOption[];
  selectMode?: SelectMode;
  placeholder?: string;
}



export type FilterValue = string | string[];

export type FilterState = Record<string, string[]>;

export interface FilterBarProps<T extends FilterState> {
  filtersConfig: FilterConfig<T>[];
  onApply?: (filters: FilterState) => void;
}


export interface TableFilterSearchProps<
  T extends Record<string, unknown> = Record<string, unknown>
> {
  enableSearch?: boolean;
  enableFilter?: boolean;

  onSearch?: (value: string) => void;
  onFilterChange?: (filters: FilterState) => void;

  filtersConfig?: FilterConfig<T>[];
  searchPlaceholder?: string;
}


export type UpdateUrlOptions = {
  resetPage?: boolean;
  page?: number;
  limit?: number;
  scroll?: boolean;
};

export type SelectFilterProps = {
  label: string;
  isMulti: boolean;
  options: SelectOption[];
  value: SelectOption | SelectOption[] | null;
  onChange: (
    selected: SingleValue<SelectOption> | MultiValue<SelectOption>
  ) => void;
};

export type DateFilterProps = {
  label: string;
  mode: Extract<SelectMode, "single" | "range">;
  value?: string[];
  onChange: (values: string[]) => void;
};

export type HandleSelectFilter = (
  key: string,
  selected: SingleValue<SelectOption> | MultiValue<SelectOption>,
  isMulti: boolean,
  allOptionValues?: string[]
) => void;
