import { ApiError } from "@/types";
import type { AuthResponse, LoginCredentials, SignupCredentials, User } from "@/types/auth";
import { api } from "@/utils/api";
import { cookieService } from "@/utils/cookieService";

// ============================================================================
// ENDPOINTS
// ============================================================================
const ENDPOINTS = {
  LOGIN: "auth/login",
  REGISTER: "auth/register",
  LOGOUT: "auth/logout",
  ME: "auth/me",
  VERIFY_EMAIL: "auth/verify-email",
  RESET_PASSWORD: "auth/reset-password",
  FORGOT_PASSWORD: "auth/forgot-password",
  UPDATE_PROFILE: "auth/update-profile",
  CHANGE_PASSWORD: "auth/change-password",
  USERS: "/users",
};

// Auth service functions
export const authService = {
  // Login function
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>(
        ENDPOINTS.LOGIN,
        credentials
      );
      const { token, role } = response.data.data;
      // Store token in cookies
      cookieService.set(
        "auth_token",
        { token },
        {
          expires: 7, // 7 days
          path: "/",
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        }
      );

      // Store role in plain cookie for middleware access
      if (role !== undefined) {
        cookieService.setPlain("user_role_id", String(role), {
          expires: 7, // 7 days
          path: "/",
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        });
      }

      return response.data;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },

  // Logout function
  logout: async (): Promise<void> => {
    try {
      await api.post(ENDPOINTS.LOGOUT, {});
    } finally {
      // Clear auth cookies
      cookieService.remove("auth_token");
      cookieService.remove("user_data");
      // Clear plain role cookie
      cookieService.removePlain("user_role_id");
    }
  },

  // Get current user
  getCurrentUser: async (): Promise<User> => {
    try {
      const token = cookieService.get<string>("auth_token");
      if (!token) {
        throw new Error("No token found");
      }
      const response = await api.get<{ success: boolean; data: User }>(
        ENDPOINTS.ME
      );

            const userData = response.data.data;

      // Store user data in encrypted cookie for fallback
      cookieService.set("user_data", userData, {
        expires: 7,
        path: "/",
      });

      // Store role in plain cookie for middleware access
      if (userData.role !== undefined) {
        cookieService.setPlain("user_role_id", String(userData.role), {
          expires: 7, // 7 days
          path: "/",
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        });
      }

      return userData;
    } catch (error) {
      console.error("Get current user error:", error);

      // If it's a 401 error, don't fall back to cached data - the user is truly unauthorized
      if ((error as ApiError)?.status === 401) {
        // Clear any cached user data since it's no longer valid
        cookieService.remove("user_data");
        throw error;
      }

      // For other errors (network issues, etc.), try to get user data from cookie as fallback
      const userData = cookieService.get<User>("user_data");
      if (userData) {
        // Update role cookie from fallback data
        if (userData.role !== undefined) {
          cookieService.setPlain("user_role_id", String(userData.role), {
            expires: 7,
            path: "/",
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
          });
        }
        return userData;
      }
      throw error;
    }
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    const token = cookieService.get<string>("auth_token");
    return !!token;
  },

  // Get auth token
  getToken: (): string | null => {
    return cookieService.get<string>("auth_token");
  },

  // Register function
  register: async (data: SignupCredentials): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>(ENDPOINTS.REGISTER, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Verify email function
  verifyEmail: async (
    token: string
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await api.post<{ success: boolean; message: string }>(
        ENDPOINTS.VERIFY_EMAIL,
        { token }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Forgot password function
  forgotPassword: async (
    email: string
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await api.post<{ success: boolean; message: string }>(
        ENDPOINTS.FORGOT_PASSWORD,
        { email }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Reset password function
  resetPassword: async (
    token: string,
    password: string
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await api.post<{ success: boolean; message: string }>(
        ENDPOINTS.RESET_PASSWORD,
        { token, password }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update profile function
  updateProfile: async (
    profileData: Partial<User>
  ): Promise<{ success: boolean; message: string; data: User }> => {
    try {
      const response = await api.put<{ success: boolean; message: string; data: User }>(
        ENDPOINTS.UPDATE_PROFILE,
        profileData
      );
      
      // Update cached user data
      if (response.data.data) {
        cookieService.set("user_data", response.data.data, {
          expires: 7, // 7 days
          path: "/",
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        });
      }
      
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Change password function
  changePassword: async (
    currentPassword: string,
    newPassword: string
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await api.post<{ success: boolean; message: string }>(
        ENDPOINTS.CHANGE_PASSWORD,
        {
          currentPassword,
          newPassword,
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
