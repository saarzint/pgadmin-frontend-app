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

// Scholarship Search Types
export interface ScholarshipSearchRequest {
  user_profile_id: number;
}

export interface ScholarshipSearchResponse {
  message: string;
  user_profile_id: number;
  total_scholarships_stored: number;
  results_endpoint: string;
  note: string;
  disclaimer: string;
}

export interface EligibilityAnalysis {
  strengths: string[];
  near_miss_count: number;
  eligibility_issues: string[];
}

export interface EligibilitySummary {
  why_match: string;
  highlights: string[];
  need_based: boolean;
  match_score: number;
  essay_required: boolean;
  match_category: string;
  gpa_requirement: number | null;
  near_miss_reasons: string[];
  major_restrictions: string[];
  eligibility_analysis: EligibilityAnalysis;
  scholarship_categories: string[];
  demographic_requirements: string[];
}

export interface ScholarshipResult {
  id: number;
  user_profile_id: number;
  name: string;
  category: string;
  award_amount: string | null;
  deadline: string | null;
  renewable_flag: boolean;
  eligibility_summary: EligibilitySummary;
  source_url: string;
  matched_at: string;
  days_until_deadline: number | null;
}

export interface ScholarshipGroups {
  urgent: ScholarshipResult[];
  upcoming: ScholarshipResult[];
  future: ScholarshipResult[];
  expired: ScholarshipResult[];
}

export interface ProfileChange {
  field_name: string;
  changed_at: string;
}

export interface FiltersApplied {
  active_only: boolean;
  category: string | null;
  limit: number;
}

export interface ScholarshipSummary {
  total_scholarships: number;
  active_scholarships: number;
  urgent_count: number;
  note: string;
  categories: string[];
}

export interface ScholarshipResultsResponse {
  user_profile_id: number;
  scholarships: ScholarshipGroups;
  summary: ScholarshipSummary;
  recent_profile_changes: ProfileChange[];
  filters_applied: FiltersApplied;
  disclaimer: string;
}
