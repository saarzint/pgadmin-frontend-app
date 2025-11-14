/**
 * API Types
 * TypeScript types for API requests and responses
 */

// Base API Response
export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  success?: boolean;
}

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  details?: unknown;
}

// University Search Types
export interface UniversitySearchRequest {
  user_profile_id: number;
  search_request: string;
}

export interface UniversitySearchResponse {
  search_id: number;
  message: string;
  results_endpoint: string;
  universities_found: number;
  universities_stored: number;
}

export interface UniversityResult {
  id: number;
  university_name: string;
  location: string;
  tuition: number;
  acceptance_rate: number;
  programs: string[];
  rank_category: string;
  why_fit: string;
  search_id: number;
  user_profile_id: number;
  created_at: string;
  recommendation_metadata: {
    data_completeness: string;
    recommendation_confidence: string;
    preference_conflicts: string | null;
    search_broadened: boolean;
    missing_criteria: string | null;
  };
  source: {
    agent_output: string;
    stored_at: string;
  };
}

export interface UniversityResultsResponse {
  latest_search: {
    search_id: number;
    timestamp: string;
    has_profile_snapshot: boolean;
  };
  results: UniversityResult[];
}
