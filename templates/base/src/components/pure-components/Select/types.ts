import type { FormSelectProps } from "react-bootstrap";

export interface SelectProps extends Omit<FormSelectProps, "children"> {
  className?: string;
  options?: Array<{ value: string; label: string; disabled?: boolean }>;
  optionGroups?: Array<{
    label: string;
    options: Array<{ value: string; label: string; disabled?: boolean }>;
  }>;
}
