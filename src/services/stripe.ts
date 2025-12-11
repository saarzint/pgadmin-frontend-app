import { loadStripe, type Stripe } from '@stripe/stripe-js';

let stripePromise: Promise<Stripe | null> | null = null;

export const getStripe = () => {
  if (!stripePromise) {
    const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string | undefined;
    stripePromise = loadStripe(publishableKey || '');
  }
  return stripePromise;
};

/**
 * Helper to build absolute URLs for success/cancel redirects.
 */
export const buildReturnUrl = (path: string) => `${window.location.origin}${path.startsWith('/') ? path : `/${path}`}`;

