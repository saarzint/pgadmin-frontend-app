/**
 * Admissions Counselor Service
 * API service for admissions counselor operations
 */

import apiClient from './client';
import { API_ENDPOINTS } from './config';
import {
  AdmissionsSummaryResponse,
  AdmissionsNextStepsResponse,
  AdmissionsUpdateStageRequest,
  AdmissionsUpdateStageResponse,
  AdmissionsAgentReportRequest,
  AdmissionsAgentReportResponse,
} from './types';

export class AdmissionsCounselorService {
  /**
   * Get overall admissions summary for a user
   * @param userId - User profile ID
   * @returns Promise with admissions summary
   */
  async getSummary(userId: number): Promise<AdmissionsSummaryResponse> {
    return await apiClient.get<AdmissionsSummaryResponse>(
      API_ENDPOINTS.ADMISSIONS.SUMMARY(userId)
    );
  }

  /**
   * Get prioritized next steps for a user
   * @param userId - User profile ID
   * @returns Promise with next steps
   */
  async getNextSteps(userId: number): Promise<AdmissionsNextStepsResponse> {
    return await apiClient.get<AdmissionsNextStepsResponse>(
      API_ENDPOINTS.ADMISSIONS.NEXT_STEPS(userId)
    );
  }

  /**
   * Update admissions stage, score, stress flags, or next steps
   * @param request - Update stage request
   * @returns Promise with update response
   */
  async updateStage(request: AdmissionsUpdateStageRequest): Promise<AdmissionsUpdateStageResponse> {
    return await apiClient.post<AdmissionsUpdateStageResponse>(
      API_ENDPOINTS.ADMISSIONS.UPDATE_STAGE,
      request
    );
  }

  /**
   * Log agent activity report and detect conflicts
   * @param request - Agent report request
   * @returns Promise with agent report response
   */
  async logAgentReport(request: AdmissionsAgentReportRequest): Promise<AdmissionsAgentReportResponse> {
    return await apiClient.post<AdmissionsAgentReportResponse>(
      API_ENDPOINTS.ADMISSIONS.LOG_AGENT_REPORT,
      request
    );
  }
}

// Export singleton instance
export const admissionsCounselorService = new AdmissionsCounselorService();
export default admissionsCounselorService;
