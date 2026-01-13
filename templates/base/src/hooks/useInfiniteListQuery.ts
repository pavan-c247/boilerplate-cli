import { useInfiniteQuery } from "@tanstack/react-query";

import { DEFAULT_PAGINATION } from "@/constants";

type InfiniteQueryParams<TResponse> = {
  queryKey: unknown[];
  queryFn: (params: { page: number }) => Promise<TResponse>;
  getNextPageParam: (lastPage: TResponse, allPages: TResponse[]) => number | undefined;
  enabled?: boolean;
};

export function useInfiniteListQuery<TResponse>({
  queryKey,
  queryFn,
  getNextPageParam,
  enabled = true,
}: InfiniteQueryParams<TResponse>) {
  return useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam = DEFAULT_PAGINATION.page }) => queryFn({ page: pageParam }),
    initialPageParam: DEFAULT_PAGINATION.page,
    getNextPageParam,
    enabled,
    refetchOnWindowFocus: false,
  });
}
