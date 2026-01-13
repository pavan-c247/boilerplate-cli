"use client";

import { useTranslations } from "next-intl";
import React, { useMemo } from "react";
import { Form } from "react-bootstrap";
import Select, { GroupBase, OptionsOrGroups } from "react-select";

import styles from "./styles.module.scss";
import type { MultiSelectProps } from "./types";

type SelectOption = { value: string; label: string; isDisabled?: boolean };

const MultiSelect: React.FC<React.PropsWithChildren<MultiSelectProps>> = ({
  className,
  options = [],
  optionGroups,
  children,
  value = [],
  onChange,
  disabled,
  placeholder,
  noOptionsMessage,
  ...props
}) => {
  const t = useTranslations("common");
  
  // Use props if provided, otherwise fallback to translations
  const placeholderText = placeholder ?? t("multiselect.searchPlaceholder");
  const noOptionsText = noOptionsMessage ?? (() => t("multiselect.noOptions"));

  // Convert options/optionGroups to react-select format
  const selectOptions: OptionsOrGroups<SelectOption, GroupBase<SelectOption>> = useMemo(() => {
    if (optionGroups) {
      return optionGroups.map((group) => ({
        label: group.label,
        options: group.options.map((opt) => ({
          value: opt.value,
          label: opt.label,
          isDisabled: opt.disabled,
        })),
      }));
    }
    return options.map((opt) => ({
      value: opt.value,
      label: opt.label,
      isDisabled: opt.disabled,
    }));
  }, [options, optionGroups]);

  // Convert value (string[]) to react-select format
  const selectValue = useMemo(() => {
    const allOptions = optionGroups
      ? optionGroups.flatMap((group) => group.options)
      : options;

    return value
      .map((val) => {
        const option = allOptions.find((opt) => opt.value === val);
        return option
          ? { value: option.value, label: option.label }
          : null;
      })
      .filter((item): item is SelectOption => item !== null);
  }, [value, options, optionGroups]);

  // Handle react-select onChange and convert to our format
  const handleChange = (selectedOptions: readonly SelectOption[] | null) => {
    if (onChange) {
      const values = selectedOptions ? selectedOptions.map((opt) => opt.value) : [];
      const syntheticEvent = {
        target: { value: values.join(",") },
      } as React.ChangeEvent<HTMLSelectElement>;
      onChange(syntheticEvent);
    }
  };

  return (
    <div className={className}>
      <Select<SelectOption, true>
        isMulti
        isDisabled={disabled}
        options={selectOptions}
        value={selectValue}
        onChange={handleChange}
        className={styles.reactSelect}
        classNamePrefix="react-select"
        placeholder={placeholderText}
        noOptionsMessage={noOptionsText}
        closeMenuOnSelect={false}
        hideSelectedOptions={true}
        blurInputOnSelect={false}
        isSearchable
        isClearable={false}
        name={props.name}
        required={props.required}
      />
      {/* Hidden select for form compatibility */}
      <Form.Select
        {...props}
        multiple
        className={styles.hiddenSelect}
        value={value}
        onChange={onChange}
        disabled={disabled}
        tabIndex={-1}
        aria-hidden="true"
        style={{ display: "none" }}
      >
        {optionGroups
          ? optionGroups.map((group, index) => (
              <optgroup key={index} label={group.label}>
                {group.options.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                    disabled={option.disabled}
                  >
                    {option.label}
                  </option>
                ))}
              </optgroup>
            ))
          : options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
        {children}
      </Form.Select>
    </div>
  );
};

export default MultiSelect;
