/**
 * Scholarship Service
 * API service for scholarship search operations
 */

import apiClient from './client';
import { API_ENDPOINTS } from './config';
import {
  ScholarshipSearchRequest,
  ScholarshipSearchResponse,
  ScholarshipResultsResponse,
} from './types';

export class ScholarshipService {
  /**
   * Initiate scholarship search based on user profile
   * This triggers the backend to start searching for scholarships
   * @param request - User profile ID
   * @returns Promise with search initiation information including results_endpoint
   */
  async searchScholarships(request: ScholarshipSearchRequest): Promise<ScholarshipSearchResponse> {
    return await apiClient.post<ScholarshipSearchResponse>(
      API_ENDPOINTS.SCHOLARSHIPS.SEARCH,
      request
    );
  }

  /**
   * Get scholarship search results by user profile ID
   * @param userProfileId - User profile ID
   * @returns Promise with scholarship results grouped by deadline urgency
   */
  async getResults(userProfileId: number): Promise<ScholarshipResultsResponse> {
    return await apiClient.get<ScholarshipResultsResponse>(
      API_ENDPOINTS.SCHOLARSHIPS.RESULTS(userProfileId)
    );
  }

  /**
   * Search scholarships and fetch results
   * This is a convenience method that:
   * 1. Calls /search_scholarships to initiate the search
   * 2. Calls the results_endpoint returned from the search to get results
   * @param request - User profile ID
   * @returns Promise with scholarship results
   */
  async searchAndGetResults(request: ScholarshipSearchRequest): Promise<ScholarshipResultsResponse> {
    // Step 1: Initiate the search
    const searchResponse = await this.searchScholarships(request);

    // Step 2: Fetch results using the user_profile_id from search response
    const results = await this.getResults(searchResponse.user_profile_id);

    return results;
  }
}

// Export singleton instance
export const scholarshipService = new ScholarshipService();
export default scholarshipService;
