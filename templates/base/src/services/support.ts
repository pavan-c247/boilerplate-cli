import type { SupportEmailConfig } from '@/types/support';
import { api } from '@/utils/api';

// ============================================================================
// ENDPOINTS
// ============================================================================
const BASE_PATH = 'support';
const ENDPOINTS = {
  CONFIG: BASE_PATH,
  CONFIG_BY_ID: (id: string) => `${BASE_PATH}/${id}`,
};

// ============================================================================
// SERVICE
// ============================================================================
export const supportService = {
  async getConfig(): Promise<SupportEmailConfig | undefined> {
    const res = await api.get<{
      success: boolean;
      message: string;
      data: SupportEmailConfig;
    }>(ENDPOINTS.CONFIG);
    return res.data.data;
  },

  async updateConfig(
    data: Partial<SupportEmailConfig>
  ): Promise<SupportEmailConfig | undefined> {
    const res = await api.put<{
      success: boolean;
      message: string;
      data: SupportEmailConfig;
    }>(ENDPOINTS.CONFIG, data);
    return res.data.data;
  },
};
