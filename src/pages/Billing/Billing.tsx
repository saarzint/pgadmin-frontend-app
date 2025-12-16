import React, { useState, useEffect } from 'react';
import { CheckCircle2, AlertCircle, Loader2, CreditCard, Calendar, DollarSign, FileText, X } from 'lucide-react';
import { buildReturnUrl } from '../../services/stripe';
import apiClient from '../../services/api/client';
import { API_ENDPOINTS } from '../../services/api/config';
import { billingService, type BillingInfo, type Subscription, type PaymentMethod, type PaymentHistory } from '../../services/api/billingService';

type Plan = {
  id: string;
  name: string;
  price: string;
  priceId: string;
  cadence: string;
  description: string;
  features: string[];
  cta: string; 
};

const plans: Plan[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: '$9',
    priceId: 'price_1SdCFCGMytl1afSZfOnYJPj0'.replace(' ', ''), // starter price
    cadence: 'per month',
    description: 'Great for getting started with the essentials.',
    features: ['Up to 3 applications', 'AI chat limited', 'Email support'],
    cta: 'Choose Starter',
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$19',
    priceId: 'price_1SdCFdGMytl1afSZCgtVvtzF'.replace(' ', ''), // pro price
    cadence: 'per month',
    description: 'Most popular choice for active applicants.',
    features: ['Unlimited applications', 'Full AI chat', 'Priority support'],
    cta: 'Choose Pro',
  },
  {
    id: 'team',
    name: 'Team',
    price: '$49',
    priceId: 'price_1SdCFwGMytl1afSZtpoRPzhd'.replace(' ', ''), // team price
    cadence: 'per month',
    description: 'For counselors or teams managing multiple students.',
    features: ['Team workspaces', 'Shared notes', 'Dedicated success manager'],
    cta: 'Contact Sales',
  },
];

const Billing: React.FC = () => {
  const [activePlan, setActivePlan] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [billingInfo, setBillingInfo] = useState<BillingInfo | null>(null);
  
  // NOTE: Currently uses a hard-coded user_profile_id=1 for demo purposes.
  // In production, get this from auth/profile state or Firebase UID mapping.
  const userProfileId = 1;

  useEffect(() => {
    loadBillingInfo();
    
    // Check for success/cancel status in URL
    const params = new URLSearchParams(window.location.search);
    const status = params.get('status');
    if (status === 'success') {
      // Try to sync subscription from Stripe after successful checkout
      syncSubscription();
      // Reload billing info after sync
      setTimeout(() => {
        loadBillingInfo();
      }, 3000);
    }
  }, []);

  const syncSubscription = async () => {
    try {
      // Call the sync endpoint to pull subscription from Stripe
      await apiClient.post('/stripe/sync-subscription', {
        user_profile_id: userProfileId,
      });
      console.log('Subscription synced successfully');
    } catch (err) {
      console.warn('Could not sync subscription (this is okay if tables are not created yet):', err);
    }
  };

  const loadBillingInfo = async () => {
    try {
      setLoading(true);
      const info = await billingService.getBillingInfo(userProfileId);
      setBillingInfo(info);
    } catch (err) {
      console.error('Failed to load billing info:', err);
      // Don't show error for users without subscriptions yet
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: number, currency: string = 'usd') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  };

  const handleCheckout = async (plan: Plan) => {
    setActivePlan(plan.id);
    setError(null);
    try {
      const successUrl = buildReturnUrl('/billing?status=success');
      const cancelUrl = buildReturnUrl('/billing?status=cancel');

      // Create Stripe Checkout Session via backend

      const data = await apiClient.post<{
        url: string;
        session_id: string;
      }>(API_ENDPOINTS.BILLING.CREATE_CHECKOUT_SESSION, {
        price_id: plan.priceId,
        user_profile_id: userProfileId,
        success_url: successUrl,
        cancel_url: cancelUrl,
      });

      if (data?.url) {
        window.location.href = data.url;
        return;
      }

      throw new Error('No checkout URL returned. Please check the backend integration.');
    } catch (err) {
      // Fallback notice for when backend is not wired yet
      const msg =
        err instanceof Error ? err.message : 'Could not start checkout. Please try again.';
      setError(msg);
      console.error('Stripe checkout failed', err);
    } finally {
      setActivePlan(null);
    }
  };

  const currentSubscription = billingInfo?.subscription;
  const isCurrentPlan = (planId: string) => currentSubscription?.plan_id === planId;

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-5xl mx-auto px-4">
        <div className="mb-8">
          <p className="text-xs font-semibold text-orange-600 uppercase mb-2">Billing</p>
          <h1 className="text-2xl font-bold text-gray-900">Billing & Subscription</h1>
          <p className="text-sm text-gray-600 mt-2">
            Manage your subscription, payment methods, and view payment history.
          </p>
        </div>

        {/* Current Plan Section */}
        {loading ? (
          <div className="mb-8 flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
          </div>
        ) : currentSubscription ? (
          <div className="mb-8 border border-gray-200 rounded-2xl p-6 bg-gradient-to-br from-blue-50 to-indigo-50">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Current Plan</h2>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl font-bold text-gray-900">{currentSubscription.plan_name}</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    currentSubscription.status === 'active' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {currentSubscription.status}
                  </span>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>
                      Renews on {formatDate(currentSubscription.current_period_end)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    <span>
                      {formatCurrency(currentSubscription.amount, currentSubscription.currency)} / {currentSubscription.interval}
                    </span>
                  </div>
                  {currentSubscription.cancel_at_period_end && (
                    <div className="flex items-center gap-2 text-yellow-700">
                      <AlertCircle className="w-4 h-4" />
                      <span>Subscription will cancel at period end</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-8 border border-gray-200 rounded-2xl p-6 bg-gray-50">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">No active subscription. Choose a plan below to get started.</p>
              <button
                onClick={syncSubscription}
                className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                Sync Subscription
              </button>
            </div>
            {error && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  {error.includes('table not found') 
                    ? 'Database tables not created yet. Run the SQL migration in Supabase first.'
                    : error}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Payment Methods Section */}
        {billingInfo?.payment_methods && billingInfo.payment_methods.length > 0 && (
          <div className="mb-8 border border-gray-200 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Methods</h2>
            <div className="space-y-3">
              {billingInfo.payment_methods.map((pm) => (
                <div
                  key={pm.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-xl"
                >
                  <div className="flex items-center gap-4">
                    <CreditCard className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">
                          {pm.card_brand?.toUpperCase() || 'Card'} •••• {pm.card_last4}
                        </span>
                        {pm.is_default && (
                          <span className="px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">
                        Expires {pm.card_exp_month}/{pm.card_exp_year}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Payment History Section */}
        {billingInfo?.recent_payments && billingInfo.recent_payments.length > 0 && (
          <div className="mb-8 border border-gray-200 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Payments</h2>
            <div className="space-y-3">
              {billingInfo.recent_payments.map((payment) => (
                <div
                  key={payment.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-xl"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${
                      payment.status === 'succeeded' 
                        ? 'bg-green-100' 
                        : payment.status === 'failed'
                        ? 'bg-red-100'
                        : 'bg-yellow-100'
                    }`}>
                      <FileText className={`w-4 h-4 ${
                        payment.status === 'succeeded' 
                          ? 'text-green-600' 
                          : payment.status === 'failed'
                          ? 'text-red-600'
                          : 'text-yellow-600'
                      }`} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {payment.description || 'Subscription payment'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatDate(payment.created_at)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${
                      payment.status === 'succeeded' 
                        ? 'text-gray-900' 
                        : 'text-red-600'
                    }`}>
                      {formatCurrency(payment.amount, payment.currency)}
                    </p>
                    <p className={`text-xs ${
                      payment.status === 'succeeded' 
                        ? 'text-green-600' 
                        : 'text-red-600'
                    }`}>
                      {payment.status}
                    </p>
                    {payment.receipt_url && (
                      <a
                        href={payment.receipt_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:underline mt-1 block"
                      >
                        View Receipt
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Plans Section */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Available Plans</h2>
          <p className="text-sm text-gray-600 mb-4">
            Test mode enabled. Use Stripe test cards (e.g., 4242 4242 4242 4242) to simulate payments.
          </p>

          {error && (
            <div className="mb-6 p-4 border border-red-200 bg-red-50 rounded-xl text-red-700 text-sm flex items-start gap-2">
              <AlertCircle className="w-5 h-5 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium">Checkout could not start</p>
                <p>{error}</p>
              </div>
              <button onClick={() => setError(null)}>
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow ${
                  isCurrentPlan(plan.id)
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200'
                }`}
              >
                {isCurrentPlan(plan.id) && (
                  <div className="mb-3">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
                      Current Plan
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                  <span className="text-sm text-gray-500">{plan.cadence}</span>
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-2">{plan.price}</p>
                <p className="text-sm text-gray-600 mb-4">{plan.description}</p>

                <ul className="space-y-2 mb-6 text-sm text-gray-700">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleCheckout(plan)}
                  disabled={activePlan === plan.id || isCurrentPlan(plan.id)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary-dark text-white hover:bg-primary-darkest transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {activePlan === plan.id ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Redirecting...
                    </>
                  ) : isCurrentPlan(plan.id) ? (
                    'Current Plan'
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5" />
                      {plan.cta}
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 border border-gray-200 rounded-2xl p-4 bg-gray-50">
          <p className="text-sm text-gray-700 font-semibold mb-2">Test card details</p>
          <p className="text-sm text-gray-600 mb-1">Number: 4242 4242 4242 4242</p>
          <p className="text-sm text-gray-600">Any future expiry, any CVC, any ZIP.</p>
        </div>
      </div>
    </div>
  );
};

export default Billing;

