import { useQuery } from "@tanstack/react-query";

import { lmsService, PaginatedCourses } from "@/services/lms";

// ============================================================================
// LMS QUERY KEYS
// ============================================================================
const LMS_QUERY_KEYS = {
  COURSES: "courses",
} as const;

// ============================================================================
// LMS CONFIGURATION
// ============================================================================
const LMS_CONFIG = {
  STALE_TIME: 1000 * 60 * 5, // 5 minutes
  RETRY: {
    retries: 2,
    retryDelay: 1000,
  },
} as const;

export function useCoursesQuery(
  page: number,
  limit: number,
  search: string = "",
  categoryId?: string,
  visibility?: string,
  sortBy?: string,
  orderBy?: string
) {
  return useQuery<PaginatedCourses>({
    queryKey: [
      LMS_QUERY_KEYS.COURSES,
      page,
      limit,
      search,
      categoryId,
      visibility,
      sortBy,
      orderBy,
    ],
    queryFn: () =>
      lmsService.getCourses(page, limit, search, categoryId, visibility, sortBy, orderBy),
    staleTime: LMS_CONFIG.STALE_TIME,
    retry: LMS_CONFIG.RETRY.retries,
  });
}
