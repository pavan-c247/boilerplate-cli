import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { formConfigService } from "@/services/dynamicForm";

const FORM_CONFIG_KEYS = {
  FORM_CONFIGS: "form-configs",
  FORM_CONFIG: "form-config",
} as const;

const FORM_CONFIG_CONFIG = {
  STALE_TIME: 1000 * 60 * 5, // 5 minutes
  RETRY: {
    retries: 2,
    retryDelay: 1000,
  },
} as const;

export const useFormConfigsQuery = () => {
  return useQuery({
    queryKey: [FORM_CONFIG_KEYS.FORM_CONFIGS],
    queryFn: () => formConfigService.getAllFormConfigs(),
    staleTime: FORM_CONFIG_CONFIG.STALE_TIME,
    retry: FORM_CONFIG_CONFIG.RETRY.retries,
  });
}

export const useFormConfigQuery = (id: string) => {
  return useQuery({
    queryKey: [FORM_CONFIG_KEYS.FORM_CONFIG, id],
    queryFn: () => formConfigService.getFormConfig(id),
    enabled: !!id,
    staleTime: FORM_CONFIG_CONFIG.STALE_TIME,
    retry: FORM_CONFIG_CONFIG.RETRY.retries,
  });
}

export const useAddUpdateFormConfigMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: formConfigService.addUpdateFormConfig,
    onSuccess: () => {
      [
        FORM_CONFIG_KEYS.FORM_CONFIG,
        FORM_CONFIG_KEYS.FORM_CONFIGS
      ].forEach((key) => queryClient.invalidateQueries({ queryKey: [key] }));
    },
  });
}

export const useDeleteFormConfigMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => formConfigService.deleteFormConfig(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [FORM_CONFIG_KEYS.FORM_CONFIGS],
      });
    },
  });
}
