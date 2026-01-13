import { usePathname, useRouter,useSearchParams } from "next/navigation";

import { DEFAULT_PAGINATION, SORT_ORDER, SortOrder } from "@/constants";

export const useListTableController = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const page = Number(searchParams.get("page") ?? DEFAULT_PAGINATION.page);
  const pageSize = Number(
    searchParams.get("limit") ?? DEFAULT_PAGINATION.limit
  );
  const sortBy = searchParams.get("sortBy") || undefined;
  const sortOrder =
    (searchParams.get("sortOrder") as "asc" | "desc") || undefined;
  const search = searchParams.get("search") || "";

  const updateParams = (key: string, value?: string | number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, String(value));
    else params.delete(key);

    router.replace(`${pathname}?${params.toString()}`);
  };
  // 🔹 Pagination logic
  const setPage = (page: number) => {
    updateParams("page", page);
  };
  const setSearch = (value: string) => {
    updateParams("search", value);
  };

  const setSort = (column: string) => {
    const params = new URLSearchParams(searchParams.toString());

    const nextOrder: SortOrder =
      sortBy === column && sortOrder === SORT_ORDER.ASC
        ? SORT_ORDER.DESC
        : SORT_ORDER.ASC;

    params.set("sortBy", column);
    params.set("sortOrder", nextOrder);
    params.set("page", `${page}`);

    router.replace(`${pathname}?${params.toString()}`);
  };
  const setPageSize = (size: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("limit", String(size));
    params.set("page", DEFAULT_PAGINATION.page.toString()); // reset page
    router.replace(`${pathname}?${params.toString()}`);
  };
  return {
    page,
    pageSize,
    sortBy,
    sortOrder,
    search,
    setSearch,
    setPage,
    setPageSize,
    setSort,
    updatePage: (value: number) => updateParams("page", value),
    updateLimit: (value: number) => updateParams("limit", value),
    updateSortBy: (value: string | null) =>
      updateParams("sortBy", value || undefined),
    updateSortOrder: (value: "asc" | "desc" | null) =>
      updateParams("sortOrder", value || undefined),
    updateSearch: (value: string) => updateParams("search", value),
  };
};
