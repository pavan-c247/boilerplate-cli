import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { NextIntlClientProvider } from "next-intl";
import React, { useState } from "react";

import MultiSelect from "./index";

const messages = {
  multiselect: {
    searchPlaceholder: "Type to search...",
    noOptions: "No options available",
    removeTag: "Remove {label}",
  },
};

const meta: Meta<typeof MultiSelect> = {
  title: "Common/MultiSelect",
  component: MultiSelect,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <NextIntlClientProvider locale="en" messages={messages}>
        <Story />
      </NextIntlClientProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof MultiSelect>;

const options = [
  { value: "1", label: "Option 1" },
  { value: "2", label: "Option 2" },
  { value: "3", label: "Option 3" },
  { value: "4", label: "Option 4", disabled: true },
];

const optionGroups = [
  {
    label: "Group 1",
    options: [
      { value: "1", label: "Option 1" },
      { value: "2", label: "Option 2" },
    ],
  },
  {
    label: "Group 2",
    options: [
      { value: "3", label: "Option 3" },
      { value: "4", label: "Option 4", disabled: true },
    ],
  },
];

export const Default: Story = {
  render: (args) => {
    const [value, setValue] = useState<string[]>([]);
    return (
      <MultiSelect
        {...args}
        options={options}
        value={value}
        placeholder="Type to search..."
        noOptionsMessage={() => "No options available"}
        onChange={(e) => {
          const values = e.target.value
            ? e.target.value.split(",").filter(Boolean)
            : [];
          setValue(values);
        }}
      />
    );
  },
  args: {
    options,
  },
};

export const WithOptionGroups: Story = {
  render: (args) => {
    const [value, setValue] = useState<string[]>([]);
    return (
      <MultiSelect
        {...args}
        optionGroups={optionGroups}
        value={value}
        placeholder="Type to search..."
        noOptionsMessage={() => "No options available"}
        onChange={(e) => {
          const values = e.target.value
            ? e.target.value.split(",").filter(Boolean)
            : [];
          setValue(values);
        }}
      />
    );
  },
  args: {
    optionGroups,
  },
};
