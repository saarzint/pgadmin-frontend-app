/**
 * Visa Agent Service
 * API service for visa information operations
 */

import apiClient from './client';
import { API_ENDPOINTS } from './config';
import {
  VisaInfoRequest,
  VisaInfoResponse,
  VisaReportResponse,
  VisaAlertsResponse,
  MarkAlertsRequest,
  MarkAlertsResponse,
} from './types';

export class VisaAgentService {
  /**
   * Get visa information for a citizenship -> destination pair
   * @param request - Visa info request with citizenship and destination
   * @returns Promise with visa information results
   */
  async getVisaInfo(request: VisaInfoRequest): Promise<VisaInfoResponse> {
    return await apiClient.post<VisaInfoResponse>(
      API_ENDPOINTS.VISA.INFO,
      request
    );
  }

  /**
   * Get visa checklist report for a citizenship -> destination pair
   * @param citizenship - Citizenship country
   * @param destination - Destination country
   * @param userProfileId - User profile ID
   * @returns Promise with visa checklist report
   */
  async getVisaReport(citizenship: string, destination: string, userProfileId: number): Promise<VisaReportResponse> {
    return await apiClient.get<VisaReportResponse>(
      `${API_ENDPOINTS.VISA.REPORT(citizenship, destination)}?user_profile_id=${userProfileId}`
    );
  }

  /**
   * Get pending visa alerts for a user
   * @param userProfileId - User profile ID
   * @param limit - Optional limit for number of alerts
   * @returns Promise with visa alerts
   */
  async getVisaAlerts(userProfileId: number, limit?: number): Promise<VisaAlertsResponse> {
    const params = new URLSearchParams({ user_profile_id: userProfileId.toString() });
    if (limit) {
      params.append('limit', limit.toString());
    }
    return await apiClient.get<VisaAlertsResponse>(
      `${API_ENDPOINTS.VISA.ALERTS}?${params.toString()}`
    );
  }

  /**
   * Mark visa alerts as sent/acknowledged
   * @param request - Mark alerts request with user profile ID and optional alert IDs
   * @returns Promise with mark alerts response
   */
  async markAlertsSent(request: MarkAlertsRequest): Promise<MarkAlertsResponse> {
    return await apiClient.post<MarkAlertsResponse>(
      API_ENDPOINTS.VISA.MARK_ALERTS,
      request
    );
  }
}

// Export singleton instance
export const visaAgentService = new VisaAgentService();
export default visaAgentService;
