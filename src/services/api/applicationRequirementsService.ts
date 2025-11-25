/**
 * Application Requirements Service
 * Handles API calls related to application requirements
 */

import axios from 'axios';
import { API_CONFIG, API_ENDPOINTS } from './config';
import type {
  FetchApplicationRequirementsRequest,
  FetchApplicationRequirementsResponse,
  GetApplicationRequirementsResponse,
} from './types';

const api = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
  withCredentials: API_CONFIG.withCredentials,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const applicationRequirementsService = {
  /**
   * Fetch and store application requirements for a university and program
   */
  async fetchRequirements(
    request: FetchApplicationRequirementsRequest
  ): Promise<FetchApplicationRequirementsResponse> {
    const response = await api.post<FetchApplicationRequirementsResponse>(
      API_ENDPOINTS.APPLICATION_REQUIREMENTS.FETCH,
      request
    );
    return response.data;
  },

  /**
   * Get stored application requirements for a university and program
   */
  async getRequirements(
    university: string,
    program: string,
    userProfileId: number
  ): Promise<GetApplicationRequirementsResponse> {
    const response = await api.get<GetApplicationRequirementsResponse>(
      API_ENDPOINTS.APPLICATION_REQUIREMENTS.GET(university, program),
      {
        params: {
          user_profile_id: userProfileId,
        },
      }
    );
    return response.data;
  },
};
