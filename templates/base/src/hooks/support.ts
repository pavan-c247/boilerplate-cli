import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { supportService } from '@/services/support';
import type { SupportEmailConfig } from '@/types/support';

// ============================================================================
// QUERY KEYS
// ============================================================================
const SUPPORT_QUERY_KEYS = {
  CONFIG: 'support-config',
} as const;

// ============================================================================
// CONFIGURATION
// ============================================================================
const SUPPORT_CONFIG = {
  STALE_TIME: 1000 * 60 * 5, // 5 minutes
  RETRY: {
    retries: 2,
    retryDelay: 1000,
  },
} as const;

// ============================================================================
// QUERIES
// ============================================================================
export function useSupportConfigQuery() {
  return useQuery({
    queryKey: [SUPPORT_QUERY_KEYS.CONFIG],
    queryFn: () => supportService.getConfig(),
    staleTime: SUPPORT_CONFIG.STALE_TIME,
    retry: SUPPORT_CONFIG.RETRY.retries,
  });
}

// ============================================================================
// MUTATIONS
// ============================================================================
export function useUpdateSupportConfigMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<SupportEmailConfig>) =>
      supportService.updateConfig(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [SUPPORT_QUERY_KEYS.CONFIG],
      });
    },
  });
}
