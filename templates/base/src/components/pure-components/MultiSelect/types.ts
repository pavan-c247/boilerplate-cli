import type { FormSelectProps } from "react-bootstrap";

export interface MultiSelectProps extends Omit<FormSelectProps, "children"> {
  className?: string;
  options?: Array<{ value: string; label: string; disabled?: boolean }>;
  optionGroups?: Array<{
    label: string;
    options: Array<{ value: string; label: string; disabled?: boolean }>;
  }>;
  value?: string[];
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  placeholder?: string;
  noOptionsMessage?: () => string;
}

