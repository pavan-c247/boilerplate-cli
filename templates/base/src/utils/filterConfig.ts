import { FILTER_ENTITY, FILTER_MODE } from "@/constants";
import { FilterConfig } from "@/types/filters";

export const getFiltersConfig = <T extends object>(
  entity: FILTER_ENTITY
): FilterConfig<T>[] => {
  switch (entity) {
    case FILTER_ENTITY.USER:
      return [
        {
          key: "status",
          label: "Status",
          type: FILTER_MODE.SELECT,
          options: [
            { label: "Active", value: "1" },
            { label: "Inactive", value: "0" },
          ],
          selectMode: FILTER_MODE.SINGLE,
        },
        {
          key: "createdAt",
          label: "Created Date",
          type: FILTER_MODE.DATE,
          selectMode: FILTER_MODE.SINGLE,
          options: [],
        },
        {
          key: "updatedAt",
          label: "Updated Date",
          type: FILTER_MODE.DATE,
          selectMode: FILTER_MODE.RANGE,
          options: [],
        },
      ] as FilterConfig<T>[];

    default:
      return [];
  }
};
