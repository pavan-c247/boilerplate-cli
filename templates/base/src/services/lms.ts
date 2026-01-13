
import { api } from "@/utils/api";

// Course types (minimal, expand as needed)
export interface Course {
  id: string;
  title: string;
  slug?: string;
  description?: string;
  coverImage?: string;
  isActive?: boolean;
  visibility?: string;
  category?: { id: string; title: string } | null;
  tags?: Array<{ id: string; title: string }>;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaginatedCourses {
  total: number;
  courses: Course[];
}

const BASE_PATH = "course";

export const lmsService = {

  async getCourses(
    page: number,
    limit: number,
    search: string = "",
    categoryId?: string,
    visibility?: string,
    sortBy?: string,
    orderBy?: string
  ): Promise<PaginatedCourses> {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      ...(search ? { search } : {}),
      ...(categoryId ? { categoryId } : {}),
      ...(visibility ? { visibility } : {}),
      ...(sortBy ? { sortBy } : {}),
      ...(orderBy ? { orderBy } : {}),
    });

    const res = await api.get<{
      success: boolean;
      message: string;
      data: PaginatedCourses;
    }>(`${BASE_PATH}?${params.toString()}`);

    return res.data.data;
  },
  
};
