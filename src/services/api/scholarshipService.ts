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
   * Search scholarships based on user profile
   * @param request - User profile ID
   * @returns Promise with search result information
   */
  async searchScholarships(request: ScholarshipSearchRequest): Promise<ScholarshipSearchResponse> {
    return await apiClient.post<ScholarshipSearchResponse>(
      API_ENDPOINTS.SCHOLARSHIPS.SEARCH,
      request
    );
  }

  /**
   * Get saved scholarship search results by user profile ID
   * @param userProfileId - User profile ID
   * @returns Promise with scholarship results
   */
  async getResults(userProfileId: number): Promise<ScholarshipResultsResponse> {
    return await apiClient.get<ScholarshipResultsResponse>(
      API_ENDPOINTS.SCHOLARSHIPS.RESULTS(userProfileId)
    );
  }

  /**
   * Poll for scholarship search results with automatic retry
   * Polls the results endpoint until data is available or max attempts reached
   * @param userProfileId - User profile ID
   * @param options - Polling configuration
   * @returns Promise with scholarship results
   */
  async pollResults(
    userProfileId: number,
    options: {
      maxAttempts?: number;
      intervalMs?: number;
      onProgress?: (attempt: number, maxAttempts: number) => void;
    } = {}
  ): Promise<ScholarshipResultsResponse> {
    const {
      maxAttempts = 60, // Try for 5 minutes (60 attempts * 5 seconds)
      intervalMs = 5000, // Poll every 5 seconds
      onProgress,
    } = options;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        if (onProgress) {
          onProgress(attempt, maxAttempts);
        }

        const results = await this.getResults(userProfileId);

        // Check if results are available
        if (results && results.results && results.results.length > 0) {
          return results;
        }

        // If no results yet and not the last attempt, wait before next poll
        if (attempt < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, intervalMs));
        }
      } catch (error) {
        // If it's a 404, the results might not be ready yet, continue polling
        const apiError = error as { status?: number };
        if (apiError.status === 404 && attempt < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, intervalMs));
          continue;
        }
        // For other errors, throw immediately
        throw error;
      }
    }

    throw new Error('Polling timeout: Results not available after maximum attempts');
  }

  /**
   * Search scholarships and automatically poll for results
   * Convenience method that combines search and polling
   * @param request - User profile ID
   * @param pollOptions - Polling configuration
   * @returns Promise with scholarship results
   */
  async searchAndWaitForResults(
    request: ScholarshipSearchRequest,
    pollOptions?: Parameters<typeof this.pollResults>[1]
  ): Promise<ScholarshipResultsResponse> {
    // Initiate the search
    await this.searchScholarships(request);

    // Poll for results using the user profile ID
    return await this.pollResults(request.user_profile_id, pollOptions);
  }
}

// Export singleton instance
export const scholarshipService = new ScholarshipService();
export default scholarshipService;
