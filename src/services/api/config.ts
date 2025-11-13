/**
 * API Configuration
 * Centralized configuration for API settings
 */

export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://pgadmit-232251258466.europe-west1.run.app',
  timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '30000'),
  withCredentials: false,
} as const;

export const API_ENDPOINTS = {
  // Universities Search
  UNIVERSITIES: {
    SEARCH: '/search_universities',
    RESULTS: (id: number) => `/results/${id}`,
  },
} as const;
