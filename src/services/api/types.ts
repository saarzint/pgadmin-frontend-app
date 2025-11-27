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

// Visa Agent Types
export interface VisaInfoRequest {
  user_profile_id: number;
  citizenship: string;
  destination: string;
  refresh?: boolean;
}

export interface VisaChange {
  field: string;
  new_value: string | string[];
  old_value: string | string[];
  change_type: string;
}

export interface VisaChangeSummary {
  is_new: boolean;
  alert_needed: boolean;
  changes: VisaChange[];
  has_changes?: boolean;
  previous_version_id?: number;
}

export interface VisaInfoResult {
  id: number;
  user_profile_id: number;
  citizenship_country: string;
  destination_country: string;
  visa_type: string;
  documents: string[];
  process_steps: string[];
  fees: string;
  timelines: string;
  interview: boolean;
  post_graduation: string[];
  source_url: string;
  disclaimer: string;
  notes: string;
  fetched_at: string;
  last_updated: string;
  alert_sent: boolean;
  change_summary: VisaChangeSummary;
}

export interface VisaInfoResponse {
  citizenship: string;
  destination: string;
  count: number;
  agent_refresh_attempted: boolean;
  results: VisaInfoResult[];
}

// Visa Report Types
export interface VisaChecklistItem {
  item: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'completed';
}

export interface VisaChecklistCategory {
  category: string;
  items: VisaChecklistItem[];
}

export interface VisaReportResponse {
  title: string;
  visa_type: string;
  citizenship: string;
  destination: string;
  checklist: VisaChecklistCategory[];
  fees: string;
  timeline: string;
  source_url: string;
  last_updated: string;
  disclaimer: string;
  notes: string;
  post_graduation_options: string[];
  special_conditions: string[];
}

// Visa Alerts Types
export interface VisaAlertChange {
  change_type: string;
  field: string;
  new_value: string | string[] | boolean | null;
  old_value: string | string[] | boolean | null;
}

export interface VisaAlert {
  id: number;
  citizenship: string;
  destination: string;
  visa_type: string;
  last_updated: string;
  source_url: string;
  changes: VisaAlertChange[];
  is_new: boolean;
  alert_message: string;
}

export interface VisaAlertsResponse {
  user_profile_id: number;
  alerts_count: number;
  alerts: VisaAlert[];
  message: string;
}

export interface MarkAlertsRequest {
  user_profile_id: number;
  alert_ids?: number[];
}

export interface MarkAlertsResponse {
  message: string;
  user_profile_id: number;
  updated_count: number;
}

// Application Requirements Types
export interface FetchApplicationRequirementsRequest {
  user_profile_id: number;
  university: string;
  program: string;
}

export interface ApplicationDeadlines {
  regular_decision?: string | null;
  early_action?: string | null;
  early_decision?: string | null;
  priority?: string | null;
  rolling?: boolean;
}

export interface ApplicationDocument {
  name: string;
  required: boolean;
  details?: string | null;
}

export interface ApplicationPortfolio {
  required: boolean;
  details?: string | null;
}

export interface ApplicationInterview {
  required: boolean;
  policy?: string;
}

export interface ApplicationFeeInfo {
  amount?: string | null;
  currency?: string;
  waiver_available?: boolean;
  waiver_details?: string | null;
}

export interface ApplicationTestPolicy {
  type?: string;
  details?: string | null;
}

export interface ApplicationEssayPrompt {
  type?: string;
  prompt: string;
  word_limit?: number | null;
}

export interface ApplicationLabels {
  rolling_admission?: boolean;
  test_label?: string;
}

export interface ApplicationRequirements {
  university: string;
  program: string;
  application_platform?: string;
  deadlines?: ApplicationDeadlines;
  required_documents?: ApplicationDocument[];
  essay_prompts?: ApplicationEssayPrompt[];
  portfolio?: ApplicationPortfolio;
  interview?: ApplicationInterview;
  fee_info?: ApplicationFeeInfo;
  test_policy?: ApplicationTestPolicy;
  source_url?: string;
  fetched_at?: string;
  is_ambiguous?: boolean;
  ambiguity_details?: string;
  labels?: ApplicationLabels;
}

export interface ApplicationRequirementsData {
  id: number;
  user_profile_id: number;
  university: string;
  program: string;
  application_platform?: string;
  deadlines?: ApplicationDeadlines;
  required_documents?: ApplicationDocument[];
  essay_prompts?: ApplicationEssayPrompt[];
  portfolio?: ApplicationPortfolio;
  interview?: ApplicationInterview;
  fee_info?: ApplicationFeeInfo;
  test_policy?: ApplicationTestPolicy;
  source_url?: string;
  fetched_at: string;
  is_ambiguous?: boolean;
  ambiguity_details?: string;
  reviewed_by?: string | null;
}

export interface FetchApplicationRequirementsResponse {
  message: string;
  user_profile_id: number;
  search_type: string;
  formatted_json: ApplicationRequirements;
  formatted_markdown: string;
  disclaimer: string;
}

export interface GetApplicationRequirementsResponse {
  user_profile_id: number;
  university: string;
  program: string;
  requirements: ApplicationRequirementsData;
  refreshed: boolean;
}

// Admissions Counselor Types
export interface AdmissionsStressFlags {
  incomplete_profile: boolean;
  approaching_deadlines: boolean;
  agent_conflicts: boolean;
  missing_documents?: number;
}

export interface AdmissionsApproachingDeadline {
  type: string;
  name: string;
  deadline: string;
  days_left: number;
}

export interface AdmissionsNextStep {
  action: string;
  priority: 'high' | 'medium' | 'low' | 'High' | 'Medium' | 'Low';
  deadline?: string;
  due_date?: string;
  agent?: string;
  related_agent?: string;
  category?: string;
  estimated_time?: string;
  dependencies?: string[];
  reasoning?: string;
}

export interface AdmissionsOverview {
  universities_found: number;
  scholarships_found: number;
  application_requirements: number;
  visa_info_count: number;
  profile_name: string;
}

export interface AdmissionsSummaryResponse {
  current_stage: string;
  progress_score: number;
  active_agents: string[];
  stress_flags: AdmissionsStressFlags;
  next_steps: AdmissionsNextStep[];
  overview: AdmissionsOverview;
  advice: string;
  last_updated?: string;
  missing_profile_fields?: string[];
  approaching_deadlines_details?: AdmissionsApproachingDeadline[];
}

export interface AdmissionsNextStepsResponse {
  user_id: number;
  next_steps: AdmissionsNextStep[];
  total_count: number;
  last_updated: string;
}

export interface AdmissionsUpdateStageRequest {
  user_id: number;
  current_stage?: string;
  progress_score?: number;
  stress_flags?: Partial<AdmissionsStressFlags>;
  next_steps?: AdmissionsNextStep[];
}

export interface AdmissionsUpdateStageResponse {
  message: string;
  user_id: number;
  updated_data?: {
    id: number;
    user_id: number;
    current_stage: string;
    progress_score: number;
    stress_flags: AdmissionsStressFlags;
    next_steps: AdmissionsNextStep[];
    last_updated: string;
  };
  summary_data?: {
    id: number;
    user_id: number;
    current_stage: string;
    progress_score: number;
    stress_flags: AdmissionsStressFlags;
    next_steps: AdmissionsNextStep[];
    last_updated: string;
  };
}

export interface AdmissionsAgentReportRequest {
  agent_name: string;
  user_id: number;
  payload: Record<string, unknown>;
  timestamp?: string;
}

export interface AdmissionsAgentReportResponse {
  message: string;
  agent_name: string;
  user_id: number;
  conflict_detected: boolean;
  report_id: number;
}
