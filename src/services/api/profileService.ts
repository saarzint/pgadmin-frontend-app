/**
 * Profile Service
 * Handles all user profile API operations
 */

import apiClient from './client';
import { API_ENDPOINTS } from './config';

// Types based on USER_PROFILE_SCHEMA.md

export interface TestScores {
  SAT?: number;
  ACT?: number;
  GRE?: number;
  GMAT?: number;
  TOEFL?: number;
  IELTS?: number;
  Duolingo?: number;
  [key: string]: number | undefined;
}

export interface AcademicBackground {
  degree?: string;
  major?: string;
  university?: string;
  graduation_year?: number;
  subjects?: string[];
  honors?: string[];
}

export interface Preferences {
  location?: 'Urban' | 'Suburban' | 'Rural';
  campus_size?: 'Small' | 'Medium' | 'Large';
  environment?: 'Research-focused' | 'Teaching-focused' | 'Liberal Arts';
  region?: string[];
  climate?: 'Warm' | 'Moderate' | 'Cold';
  ranking_preference?: 'Top 20' | 'Top 50' | 'Top 100' | 'Any';
}

export interface UserProfile {
  id?: number;
  full_name: string;
  citizenship_country?: string;
  destination_country?: string;
  gpa?: number;
  test_scores?: TestScores;
  academic_background?: AcademicBackground;
  intended_major?: string;
  extracurriculars?: string[];
  financial_aid_eligibility?: boolean;
  budget?: number;
  preferences?: Preferences;
  created_at?: string;
  updated_at?: string;
}

export interface ProfileResponse {
  success: boolean;
  message?: string;
  profile: UserProfile;
}

export interface ProfileErrorResponse {
  error: string;
}

class ProfileService {
  /**
   * Get user profile by ID
   */
  async getProfile(profileId: number): Promise<ProfileResponse> {
    return apiClient.get<ProfileResponse>(API_ENDPOINTS.PROFILE.GET(profileId));
  }

  /**
   * Create a new user profile
   */
  async createProfile(data: Partial<UserProfile>): Promise<ProfileResponse> {
    return apiClient.post<ProfileResponse>(API_ENDPOINTS.PROFILE.CREATE, data);
  }

  /**
   * Update an existing user profile
   */
  async updateProfile(profileId: number, data: Partial<UserProfile>): Promise<ProfileResponse> {
    return apiClient.put<ProfileResponse>(API_ENDPOINTS.PROFILE.UPDATE(profileId), data);
  }

  /**
   * Delete a user profile
   */
  async deleteProfile(profileId: number): Promise<{ success: boolean; message: string }> {
    return apiClient.delete<{ success: boolean; message: string }>(
      API_ENDPOINTS.PROFILE.DELETE(profileId)
    );
  }
}

export const profileService = new ProfileService();
export default profileService;
