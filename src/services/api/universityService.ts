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

  /**
   * Poll for university search results with automatic retry
   * Polls the results endpoint until data is available or max attempts reached
   * @param resultId - Result ID from previous search
   * @param options - Polling configuration
   * @returns Promise with university results
   */
  async pollResults(
    resultId: number,
    options: {
      maxAttempts?: number;
      intervalMs?: number;
      onProgress?: (attempt: number, maxAttempts: number) => void;
    } = {}
  ): Promise<UniversityResultsResponse> {
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

        const results = await this.getResults(resultId);

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
   * Search universities and automatically poll for results
   * Convenience method that combines search and polling
   * @param request - User profile ID and search query
   * @param pollOptions - Polling configuration
   * @returns Promise with university results
   */
  async searchAndWaitForResults(
    request: UniversitySearchRequest,
    pollOptions?: Parameters<typeof this.pollResults>[1]
  ): Promise<UniversityResultsResponse> {
    const searchResponse = await this.searchUniversities(request);

    // Extract the result ID from the results_endpoint (e.g., "/results/1" -> 1)
    const resultId = parseInt(searchResponse.results_endpoint.split('/').pop() || '0');

    if (!resultId) {
      throw new Error('Invalid results endpoint received from search API');
    }

    return await this.pollResults(resultId, pollOptions);
  }
}

// Export singleton instance
export const universityService = new UniversityService();
export default universityService;
