"use client";

import { FormLabel } from "react-bootstrap";
import Select, { components, ValueContainerProps } from "react-select";

import Checkbox from "@/components/pure-components/Checkbox";
import { FILTER_MODE, MULTI_SELECT_MAX_VISIBLE_LABELS } from "@/constants";
import { SelectFilterProps, SelectOption } from "@/types/filters";

/** Checkbox option for multi select */
const CheckboxOption = (props: any) => {
  const { data, innerProps, innerRef, isSelected, selectProps } = props;

  const nonAllValues: string[] = selectProps.options
    .filter((opt: SelectOption) => opt.value !== FILTER_MODE.ALL)
    .map((opt: SelectOption) => String(opt.value));

  const selectedValues: string[] = Array.isArray(selectProps.value)
    ? selectProps.value.map((option: SelectOption) => String(option.value))
    : [];

  const selectedCount = selectedValues.filter((selectedValue) =>
    nonAllValues.includes(selectedValue)
  ).length;

  let checked = isSelected;
  if (data.value === FILTER_MODE.ALL) {
    checked = selectedCount === nonAllValues.length;
  }

  const handleCheckbox = () => {
    if (data.value === FILTER_MODE.ALL) {
      if (checked) {
        // ALL is selected → deselect all
        selectProps.onChange([]);
      } else {
        // ALL is not selected → select all
        const allOptions = selectProps.options.filter(
          (opt: SelectOption) => opt.value !== FILTER_MODE.ALL
        );
        selectProps.onChange(allOptions);
      }
    } else {
      // individual option click → default behavior
      selectProps.onChange(
        isSelected
          ? selectProps.value.filter(
              (opt: SelectOption) => opt.value !== data.value
            )
          : [...selectProps.value, data]
      );
    }
  };

  return (
    <div
      ref={innerRef}
      {...innerProps}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        handleCheckbox();
      }}
      className="d-flex align-items-center gap-2 p-2 rounded"
      style={{ cursor: "pointer" }}
    >
      <Checkbox checked={checked} />
      <span>{data.label}</span>
    </div>
  );
};

const CustomValueContainer = (
  props: ValueContainerProps<SelectOption, boolean>
) => {
  const { getValue, selectProps } = props;

  const values = getValue(); // SelectOption[]

  const visibleValues = values.slice(0, MULTI_SELECT_MAX_VISIBLE_LABELS);
  const remainingCount = values.length - MULTI_SELECT_MAX_VISIBLE_LABELS;

  return (
    <components.ValueContainer {...props}>
      {values.length === 0 ? (
        <span className="text-muted">{selectProps.placeholder}</span>
      ) : (
        <div className="d-flex align-items-center gap-1">
          <span>{visibleValues.map((opt) => opt.label).join(", ")}</span>
          {remainingCount > 0 && (
            <span className="text-muted">+{remainingCount}</span>
          )}
        </div>
      )}
    </components.ValueContainer>
  );
};

const SelectFilter = ({
  label,
  isMulti,
  options,
  value,
  onChange,
}: SelectFilterProps) => {
  return (
    <>
      <FormLabel>{label}</FormLabel>
      <Select<SelectOption, boolean>
        className="react-select"
        classNamePrefix="react-select"
        placeholder={label}
        options={options}
        value={value as any}
        isMulti={isMulti}
        closeMenuOnSelect={!isMulti}
        blurInputOnSelect
        hideSelectedOptions={false}
        isSearchable={false}
        components={{
          ...(isMulti
            ? {
                Option: CheckboxOption,
                ValueContainer: CustomValueContainer,
                MultiValue: () => null,
              }
            : {}),
        }}
        onChange={onChange}
      />
    </>
  );
};

export default SelectFilter;
