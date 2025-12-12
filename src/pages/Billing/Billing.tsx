import React, { useState } from 'react';
import axios from 'axios';
import { CheckCircle2, AlertCircle, Loader2, CreditCard } from 'lucide-react';
import { getStripe, buildReturnUrl } from '../../services/stripe';

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
    priceId: 'prod_TaMz8VPAS4gbed',
    cadence: 'per month',
    description: 'Great for getting started with the essentials.',
    features: ['Up to 3 applications', 'AI chat limited', 'Email support'],
    cta: 'Choose Starter',
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$19',
    priceId: 'prod_TaMzokkGtuI95E',
    cadence: 'per month',
    description: 'Most popular choice for active applicants.',
    features: ['Unlimited applications', 'Full AI chat', 'Priority support'],
    cta: 'Choose Pro',
  },
  {
    id: 'team',
    name: 'Team',
    price: '$49',
    priceId: 'prod_TaMzNw0fxEsuqf',
    cadence: 'per month',
    description: 'For counselors or teams managing multiple students.',
    features: ['Team workspaces', 'Shared notes', 'Dedicated success manager'],
    cta: 'Contact Sales',
  },
];

const Billing: React.FC = () => {
  const [activePlan, setActivePlan] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async (plan: Plan) => {
    setActivePlan(plan.id);
    setError(null);
    try {
      const successUrl = buildReturnUrl('/billing?status=success');
      const cancelUrl = buildReturnUrl('/billing?status=cancel');

      // Expect a backend endpoint to create a session and return { url } or { sessionId }
      const { data } = await axios.post('/api/stripe/create-checkout-session', {
        priceId: plan.priceId,
        successUrl,
        cancelUrl,
        metadata: { plan: plan.id },
      });

      if (data?.url) {
        window.location.href = data.url;
        return;
      }

      if (data?.sessionId) {
        const stripe = await getStripe();
        await stripe?.redirectToCheckout({ sessionId: data.sessionId });
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

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-5xl mx-auto px-4">
        <div className="mb-8">
          <p className="text-xs font-semibold text-orange-600 uppercase mb-2">Billing</p>
          <h1 className="text-2xl font-bold text-gray-900">Choose a plan</h1>
          <p className="text-sm text-gray-600 mt-2">
            Test mode enabled. Use Stripe test cards (e.g., 4242 4242 4242 4242) to simulate payments.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 border border-red-200 bg-red-50 rounded-xl text-red-700 text-sm flex items-start gap-2">
            <AlertCircle className="w-5 h-5 mt-0.5" />
            <div>
              <p className="font-medium">Checkout could not start</p>
              <p>{error}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-semibold text-gray-900">{plan.name}</h2>
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
                disabled={activePlan === plan.id}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary-dark text-white hover:bg-primary-darkest transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {activePlan === plan.id ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Redirecting...
                  </>
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

