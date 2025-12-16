/**
 * API Configuration
 * Centralized configuration for API settings
 * 
 * Since frontend and backend are served from the same container,
 * we use relative paths (empty string) so API calls work with any domain.
 * Set VITE_API_BASE_URL only if you need to point to a different backend.
 */

export const API_CONFIG = {
  // Use relative paths since frontend/backend are in same container
  // This allows the app to work with any domain (Cloud Run URL or custom domain)
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
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
    GET_SUBSCRIPTION: (userProfileId: number) => `/stripe/subscription/${userProfileId}`,
    GET_PAYMENT_METHODS: (userProfileId: number) => `/stripe/payment-methods/${userProfileId}`,
    GET_PAYMENT_HISTORY: (userProfileId: number) => `/stripe/payment-history/${userProfileId}`,
    GET_BILLING_INFO: (userProfileId: number) => `/stripe/billing-info/${userProfileId}`,
    CANCEL_SUBSCRIPTION: '/stripe/cancel-subscription',
  },
} as const;
