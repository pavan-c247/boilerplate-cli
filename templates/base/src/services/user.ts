import type { User } from "@/types/auth";
import { api } from "@/utils/api";

// ============================================================================
// TYPES
// ============================================================================
export interface PaginatedResponse<T> {
  total: number;
  users: T[];
}
export interface UserBaseRequest {
  name?: string;
  email?: string;
  role?: number;
  status?: number;
  phoneNumber?: string;
  countryCode?: string;
}

export interface UserEncryptedRequest {
  encryptedData: string;
}

export type UserCreateRequest =
  | UserBaseRequest
  | UserEncryptedRequest
  | string

// ============================================================================
// ENDPOINTS
// ============================================================================
const BASE_PATH = "user";
const ENDPOINTS = {
  ADD_UPDATE: BASE_PATH,
  USER_BY_ID: (id: number | string) => `${BASE_PATH}/${id}`,
  SET_PASSWORD: `${BASE_PATH}/set-password`,
};

export const userService = {
  async getUsers(
    page: number,
    limit: number,
    search: string = "",
    filter?: string,
    sortBy?: string,
    sortOrder?: string
  ): Promise<PaginatedResponse<User>> {
    // Example: /users?page=1&limit=10&search=foo
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      ...(search ? { search } : {}),
      ...(filter ? { filter } : {}),
      ...(sortOrder ? { sortOrder } : {}),
      ...(sortBy ? { sortBy } : {}),
    });
    const res = await api.get<{
      success: boolean;
      message: string;
      data: PaginatedResponse<User>;
    }>(`${BASE_PATH}?${params.toString()}`);
    return res.data.data;
  },
  async getUser(id: number): Promise<User | undefined> {
    const res = await api.get<User>(ENDPOINTS.USER_BY_ID(id));
    return res.data;
  },
  async createUser(data: UserCreateRequest): Promise<User> {
    const res = await api.post<User>(ENDPOINTS.ADD_UPDATE, data);
    return res.data;
  },
  async updateUser(
    id: number |string,
    data: Partial<UserCreateRequest>
  ): Promise<User | undefined> {
    const res = await api.put<User>(ENDPOINTS.USER_BY_ID(id), data);
    return res.data;
  },
  async deleteUser(id: string | number): Promise<boolean> {
    await api.delete<null>(ENDPOINTS.USER_BY_ID(id));
    return true;
  },

  // Set password function (for first-time password setting)
  setPassword: async (
    password: string,
    token: string | null
  ): Promise<{ success: boolean; message: string }> => {
    try { 
      const response = await api.post<{ success: boolean; message: string }>(
        ENDPOINTS.SET_PASSWORD,
        { password, token }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
