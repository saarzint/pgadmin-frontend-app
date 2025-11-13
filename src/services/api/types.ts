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
  result_id: number;
  message: string;
}

export interface UniversityResult {
  id: number;
  name: string;
  location: string;
  ranking?: number;
  programs?: string[];
  requirements?: {
    gpa?: number;
    testScores?: {
      gre?: number;
      toefl?: number;
      ielts?: number;
    };
  };
  [key: string]: unknown;
}

export interface UniversityResultsResponse {
  user_profile_id: number;
  search_request: string;
  results: UniversityResult[];
  timestamp?: string;
}
