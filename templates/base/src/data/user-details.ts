import { UserColumn } from "@/types/table";

export const getUserDetailsColumns = (
  user: any,
  t: (key: string) => string
): UserColumn[] => [
  {
    fields: [
      {
        labelKey: "name",
        value: user.name || "-",
        type: "text",
      },
      {
        labelKey: "email",
        value: user.email || "-",
        type: "text",
      },
      {
        labelKey: "status",
        value: user.status === 0 ? t("active") : t("inactive"),
        type: "badge",
      },
    ],
  },
  {
    fields: [
      { labelKey: "contact", value: "-" },
      { labelKey: "timeExpenditure", value: "-" },
      { labelKey: "tags", value: "-", type: "badge" },
    ],
  },
  {
    fields: [
      { labelKey: "secondaryContact", value: "-" },
      { labelKey: "expensesValue", value: "-" },
      { labelKey: "dockerInfo", value: "-" },
    ],
  },
];
