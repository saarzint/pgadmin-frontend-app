/**
 * University Service
 * API service for university search operations
 */

import apiClient from './client';
import { API_ENDPOINTS } from './config';
import {
  UniversitySearchRequest,
  UniversitySearchResponse,
  UniversityResultsResponse,
} from './types';

export class UniversityService {
  /**
   * Search universities based on user profile and search request
   * @param request - User profile ID and search query
   * @returns Promise with search result ID
   */
  async searchUniversities(request: UniversitySearchRequest): Promise<UniversitySearchResponse> {
    return await apiClient.post<UniversitySearchResponse>(
      API_ENDPOINTS.UNIVERSITIES.SEARCH,
      request
    );
  }

  /**
   * Get saved university search results by ID
   * @param resultId - Result ID from previous search
   * @returns Promise with university results
   */
  async getResults(resultId: number): Promise<UniversityResultsResponse> {
    return await apiClient.get<UniversityResultsResponse>(
      API_ENDPOINTS.UNIVERSITIES.RESULTS(resultId)
    );
  }
}

// Export singleton instance
export const universityService = new UniversityService();
export default universityService;
