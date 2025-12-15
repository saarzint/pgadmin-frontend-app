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
  // Visa Agent
  VISA: {
    INFO: '/visa_info',
    REPORT: (citizenship: string, destination: string) => `/visa_report/${citizenship}/${destination}`,
    ALERTS: '/visa_alerts',
    MARK_ALERTS: '/visa_alerts/mark_sent',
  },
  // Application Requirements
  APPLICATION_REQUIREMENTS: {
    FETCH: '/fetch_application_requirements',
    GET: (university: string, program: string) => `/application_requirements/${university}/${program}`,
  },
  // Admissions Counselor
  ADMISSIONS: {
    SUMMARY: (userId: number) => `/admissions/summary/${userId}`,
    NEXT_STEPS: (userId: number) => `/admissions/next_steps/${userId}`,
    UPDATE_STAGE: '/admissions/update_stage',
    LOG_AGENT_REPORT: '/admissions/log_agent_report',
  },
  // Billing / Stripe
  BILLING: {
    CREATE_PAYMENT_INTENT: '/stripe/create-payment-intent',
    CREATE_SUBSCRIPTION: '/stripe/create-subscription',
    CREATE_CHECKOUT_SESSION: '/stripe/create-checkout-session',
  },
} as const;
