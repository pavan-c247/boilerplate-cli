import { useMutation, UseMutationResult, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { authService } from "@/services/auth";
import { IApiResponse, IRegisterResponse, IResetPasswordResponse, IVerifyEmailResponse, LoginCredentials, SignupCredentials, User } from "@/types/auth";
import {
  clearUnauthorizedHandler,
  setUnauthorizedHandler,
} from "@/utils/api";

// ============================================================================
// AUTH QUERY KEYS
// ============================================================================
const AUTH_QUERY_KEYS = {
  USER: "user",
} as const;

// ============================================================================
// AUTH CONFIGURATION
// ============================================================================
const AUTH_CONFIG = {
  STALE_TIME: 1000 * 60 * 5, // 5 minutes
  RETRY: {
    retries: 1, // Lower retries for auth to fail fast
    retryDelay: 1000,
  },
} as const;

export const useAuth = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Set up the global 401 handler
  useEffect(() => {
    const handleUnauthorized = () => {
      // Clear all auth-related queries
      queryClient.removeQueries({ queryKey: [AUTH_QUERY_KEYS.USER] });
      queryClient.clear();

      // Redirect to login
      router.replace("/login");
    };

    setUnauthorizedHandler(handleUnauthorized);

    // Cleanup on unmount
    return () => {
      clearUnauthorizedHandler();
    };
  }, [router, queryClient]);

  // Login mutation
  const login = useMutation({
    mutationFn: (credentials: LoginCredentials) =>
      authService.login(credentials),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [AUTH_QUERY_KEYS.USER] });
      router.replace("/dashboard");
    },
  });

  // Logout mutation
  const logout = useMutation({
    mutationFn: async () => {
      // Clear cache first to ensure immediate state update
      queryClient.clear();
      // Then make the API call
      await authService.logout();
    },
    onSuccess: () => {
      // Remove the user query from cache to prevent refetch
      queryClient.removeQueries({ queryKey: [AUTH_QUERY_KEYS.USER] });
      router.replace("/login");
    },
  });

  // Get current user query with 401 handling
  const {
    data: user,
    isLoading: isLoadingUser,
    error,
  } = useQuery({
    queryKey: [AUTH_QUERY_KEYS.USER],
    queryFn: authService.getCurrentUser,
    retry: (failureCount, error: any) => {
      // Don't retry on 401 errors
      if (error?.status === 401) {
        return false;
      }
      // Retry up to 1 time for other errors
      return failureCount < AUTH_CONFIG.RETRY.retries;
    },
    staleTime: AUTH_CONFIG.STALE_TIME,
    enabled: authService.isAuthenticated(), // Only fetch if authenticated
  });

  // Handle 401 errors from the user query
  useEffect(() => {
    if (error && (error as any)?.status === 401) {
      // Clear user queries when we get a 401
      queryClient.removeQueries({ queryKey: [AUTH_QUERY_KEYS.USER] });
    }
  }, [error, queryClient]);

  // Check if user is authenticated
  const isAuthenticated = authService.isAuthenticated();

  return {
    user,
    isLoadingUser,
    isAuthenticated,
    login: login.mutate,
    logout: logout.mutate,
    isLoggingIn: login.isPending,
    isLoggingOut: logout.isPending,
    loginError: login.error,
    userError: error,
  };
};
// ============================================================================
// REGISTRATION HOOK
// ============================================================================
export const useRegistrationMutation = (): UseMutationResult<
  IRegisterResponse,
  Error,
  SignupCredentials
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SignupCredentials) =>
      authService.register(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [AUTH_QUERY_KEYS.USER] });
    },
    onError: (error) => {
      console.error("Registration error:", error);
    },
  });
};

// ============================================================================
// RESET PASSWORD HOOK
// ============================================================================
export const useResetPassword = (): UseMutationResult<
  IApiResponse<IResetPasswordResponse>,
  Error,
  {token :string , password:string}
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ token, password }) =>
      authService.resetPassword(token, password),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [AUTH_QUERY_KEYS.USER] });
    },
    onError: (error) => {
      console.error("Reset password failed:", error);
    },
  });
};

// ============================================================================
// VERIFY EMAIL HOOK
// ============================================================================
export const useVerifyEmailMutation = (): UseMutationResult<
  IApiResponse<IVerifyEmailResponse>,
  Error,
  { token: string }
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ token }) =>
      authService.verifyEmail(token),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [AUTH_QUERY_KEYS.USER] });
    },
    onError: (error) => {
      console.error("Verify email failed:", error);
    },
  });
};

// ============================================================================
// FORGOT PASSWORD HOOK
// ============================================================================
export const useForgotPassword = (): UseMutationResult<
  IApiResponse,
  Error,
  { email: string }
> => {
  return useMutation({
    mutationFn: ({ email }) =>
      authService.forgotPassword(email),
    onSuccess: () => {
      // Optionally invalidate queries if needed
    },
    onError: (error) => {
      console.error("Forgot password failed:", error);
    },
  });
};

// ============================================================================
// UPDATE PROFILE HOOK
// ============================================================================
export const useUpdateProfile = (): UseMutationResult<
  { success: boolean; message: string; data: User },
  Error,
  Partial<User>
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (profileData: Partial<User>) =>
      authService.updateProfile(profileData),
    onSuccess: (data) => {
      // Update the user query cache with the new profile data
      queryClient.setQueryData([AUTH_QUERY_KEYS.USER], data.data);
      queryClient.invalidateQueries({ queryKey: [AUTH_QUERY_KEYS.USER] });
    },
    onError: (error) => {
      console.error("Update profile failed:", error);
    },
  });
};

// ============================================================================
// CHANGE PASSWORD HOOK
// ============================================================================
export const useChangePassword = (): UseMutationResult<
  { success: boolean; message: string },
  Error,
  { currentPassword: string; newPassword: string }
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ currentPassword, newPassword }) =>
      authService.changePassword(currentPassword, newPassword),
    onSuccess: (data) => {
      // Optionally invalidate queries if needed
    },
    onError: (error) => {
      console.error("Change password failed:", error);
    },
  });
};
