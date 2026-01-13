import { useMutation, UseMutationResult, useQuery, useQueryClient } from "@tanstack/react-query";

import type { UserCreateRequest } from "@/services/user";
import { userService } from "@/services/user";

// ============================================================================
// USER QUERY KEYS
// ============================================================================
const USER_QUERY_KEYS = {
  USERS: "users",
  USER: "user",
} as const;

// ============================================================================
// USER CONFIGURATION
// ============================================================================
const USER_CONFIG = {
  STALE_TIME: 1000 * 60 * 5, // 5 minutes
  RETRY: {
    retries: 2,
    retryDelay: 1000,
  },
} as const;

export function useUsersQuery(
  page: number,
  limit: number,
  search: string = "",
  filter?: string,
  sortBy?: string,
  sortOrder?: string
) {
  return useQuery({
    queryKey: [
      USER_QUERY_KEYS.USERS,
      page,
      limit,
      search,
      filter,
      sortBy,
      sortOrder,
    ],
    queryFn: () =>
      userService.getUsers(page, limit, search, filter, sortBy, sortOrder),
    staleTime: USER_CONFIG.STALE_TIME,
    retry: USER_CONFIG.RETRY.retries,
    // keepPreviousData: true, // Uncomment if your React Query version supports it
  });
}

export function useUserQuery(id: number) {
  return useQuery({
    queryKey: [USER_QUERY_KEYS.USERS, id],
    queryFn: () => userService.getUser(id),
    enabled: !!id,
    staleTime: USER_CONFIG.STALE_TIME,
    retry: USER_CONFIG.RETRY.retries,
  });
}

export function useCreateUserMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UserCreateRequest) =>
      userService.createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [USER_QUERY_KEYS.USERS] });
    },
  });
}

export function useUpdateUserMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number | string;
      data: Partial<UserCreateRequest>;
    }) => userService.updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [USER_QUERY_KEYS.USERS] });
    },
  });
}

export function useDeleteUserMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string | number) => userService.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [USER_QUERY_KEYS.USERS] });
    },
  });
}

// ============================================================================
// SET PASSWORD HOOK
// ============================================================================
export const useSetPassword = (): UseMutationResult<
  { success: boolean; message: string },
  Error,
  { password: string; token: string | null }
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ password, token }) =>
      userService.setPassword(password, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [USER_QUERY_KEYS.USER] });
    },
    onError: (error) => {},
  });
};