import apiClient from './client';
import { API_ENDPOINTS } from './config';

export interface Subscription {
  subscription_id: string;
  plan_id: string;
  plan_name: string;
  status: string;
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  amount: number;
  currency: string;
  interval: string;
  price_id: string;
}

export interface PaymentMethod {
  id: number;
  stripe_payment_method_id: string;
  type: string;
  card_brand: string;
  card_last4: string;
  card_exp_month: number;
  card_exp_year: number;
  is_default: boolean;
  billing_details: Record<string, any>;
}

export interface PaymentHistory {
  id: number;
  amount: number;
  currency: string;
  status: string;
  description: string;
  created_at: string;
  receipt_url?: string;
  failure_reason?: string;
}

export interface BillingInfo {
  subscription: Subscription | null;
  payment_methods: PaymentMethod[];
  recent_payments: PaymentHistory[];
}

export const billingService = {
  /**
   * Get subscription details for a user
   */
  getSubscription: async (userProfileId: number): Promise<Subscription | null> => {
    const response = await apiClient.get<{ subscription: Subscription | null; message?: string }>(
      API_ENDPOINTS.BILLING.GET_SUBSCRIPTION(userProfileId)
    );
    return response.subscription;
  },

  /**
   * Get payment methods for a user
   */
  getPaymentMethods: async (userProfileId: number): Promise<PaymentMethod[]> => {
    const response = await apiClient.get<{ payment_methods: PaymentMethod[] }>(
      API_ENDPOINTS.BILLING.GET_PAYMENT_METHODS(userProfileId)
    );
    return response.payment_methods;
  },

  /**
   * Get payment history for a user
   */
  getPaymentHistory: async (userProfileId: number): Promise<PaymentHistory[]> => {
    const response = await apiClient.get<{ payments: PaymentHistory[] }>(
      API_ENDPOINTS.BILLING.GET_PAYMENT_HISTORY(userProfileId)
    );
    return response.payments;
  },

  /**
   * Get complete billing information (subscription, payment methods, recent payments)
   */
  getBillingInfo: async (userProfileId: number): Promise<BillingInfo> => {
    const response = await apiClient.get<BillingInfo>(
      API_ENDPOINTS.BILLING.GET_BILLING_INFO(userProfileId)
    );
    return response;
  },

  /**
   * Cancel a subscription
   */
  cancelSubscription: async (userProfileId: number, immediately: boolean = false): Promise<void> => {
    await apiClient.post(API_ENDPOINTS.BILLING.CANCEL_SUBSCRIPTION, {
      user_profile_id: userProfileId,
      immediately,
    });
  },
};

