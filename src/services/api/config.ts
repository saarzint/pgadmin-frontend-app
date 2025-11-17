/**
 * API Configuration
 * Centralized configuration for API settings
 */

export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://pgadmit-232251258466.europe-west1.run.app',
  timeout: 0, // No timeout - wait indefinitely for response
  withCredentials: false,
} as const;

export const API_ENDPOINTS = {
  // Universities Search
  UNIVERSITIES: {
    SEARCH: '/search_universities',
    RESULTS: (id: number) => `/results/${id}`,
  },
  // Scholarships Search
  SCHOLARSHIPS: {
    SEARCH: '/search_scholarships',
    RESULTS: (userProfileId: number) => `/results/scholarships/${userProfileId}`,
  },
} as const;
