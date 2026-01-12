import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { User as SupabaseUser, AuthError, Provider } from '@supabase/supabase-js';
import { supabase } from './config';

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  signUp: (email: string, password: string, displayName?: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  resendVerificationEmail: () => Promise<void>;
  reloadUser: () => Promise<void>;
  updateUserProfile: (displayName: string, photoURL?: string) => Promise<void>;
  deleteAccount: (password?: string) => Promise<void>;
  isGoogleUser: () => boolean;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const formatUser = (user: SupabaseUser): User => ({
  uid: user.id,
  email: user.email ?? null,
  displayName: user.user_metadata?.full_name || user.user_metadata?.name || null,
  photoURL: user.user_metadata?.avatar_url || user.user_metadata?.picture || null,
  emailVerified: user.email_confirmed_at !== null,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [providerType, setProviderType] = useState<string | null>(null);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(formatUser(session.user));
          setProviderType(session.user.app_metadata?.provider || null);
          // Store the access token for API calls
          localStorage.setItem('auth_token', session.access_token);
        }
      } catch (err) {
        console.error('Error getting session:', err);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(formatUser(session.user));
          setProviderType(session.user.app_metadata?.provider || null);
          localStorage.setItem('auth_token', session.access_token);
        } else {
          setUser(null);
          setProviderType(null);
          localStorage.removeItem('auth_token');
        }
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, displayName?: string) => {
    try {
      setError(null);
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: displayName,
          },
          emailRedirectTo: `${window.location.origin}/verify-email`,
        },
      });

      if (signUpError) throw signUpError;

      if (data.user) {
        setUser(formatUser(data.user));
      }
    } catch (err) {
      const msg = getErrorMessage(err);
      setError(msg);
      throw new Error(msg);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;
    } catch (err) {
      const msg = getErrorMessage(err);
      setError(msg);
      throw new Error(msg);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setError(null);
      const { error: googleError } = await supabase.auth.signInWithOAuth({
        provider: 'google' as Provider,
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (googleError) throw googleError;
    } catch (err) {
      const msg = getErrorMessage(err);
      setError(msg);
      throw new Error(msg);
    }
  };

  const logout = async () => {
    try {
      setError(null);
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) throw signOutError;
      localStorage.removeItem('auth_token');
    } catch (err) {
      const msg = getErrorMessage(err);
      setError(msg);
      throw new Error(msg);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setError(null);
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/login`,
      });

      if (resetError) throw resetError;
    } catch (err) {
      const msg = getErrorMessage(err);
      setError(msg);
      throw new Error(msg);
    }
  };

  const resendVerificationEmail = async () => {
    try {
      setError(null);
      const { data: { user: currentUser } } = await supabase.auth.getUser();

      if (!currentUser?.email) {
        throw new Error('No user logged in');
      }

      const { error: resendError } = await supabase.auth.resend({
        type: 'signup',
        email: currentUser.email,
        options: {
          emailRedirectTo: `${window.location.origin}/verify-email`,
        },
      });

      if (resendError) throw resendError;
      console.log('Verification email resent to:', currentUser.email);
    } catch (err) {
      console.error('Failed to resend verification email:', err);
      const msg = getErrorMessage(err);
      setError(msg);
      throw new Error(msg);
    }
  };

  const reloadUser = useCallback(async () => {
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (currentUser) {
        setUser(formatUser(currentUser));
      }
    } catch (err) {
      console.error('Failed to reload user:', err);
    }
  }, []);

  const updateUserProfile = async (displayName: string, photoURL?: string) => {
    try {
      setError(null);
      const updateData: { full_name?: string; avatar_url?: string } = {};

      if (displayName) {
        updateData.full_name = displayName;
      }
      if (photoURL !== undefined) {
        updateData.avatar_url = photoURL;
      }

      const { data, error: updateError } = await supabase.auth.updateUser({
        data: updateData,
      });

      if (updateError) throw updateError;

      if (data.user) {
        setUser(formatUser(data.user));
      }
    } catch (err) {
      const msg = getErrorMessage(err);
      setError(msg);
      throw new Error(msg);
    }
  };

  const isGoogleUser = (): boolean => {
    return providerType === 'google';
  };

  const deleteAccount = async (password?: string) => {
    try {
      setError(null);
      const { data: { user: currentUser } } = await supabase.auth.getUser();

      if (!currentUser) {
        throw new Error('No user logged in');
      }

      // For Google users, we need to verify through re-authentication
      // For email users, verify password first
      if (!isGoogleUser() && password) {
        // Re-authenticate with password
        const { error: verifyError } = await supabase.auth.signInWithPassword({
          email: currentUser.email!,
          password,
        });
        if (verifyError) throw verifyError;
      }

      // Note: Supabase doesn't have a direct client-side delete user method
      // You'll need to either:
      // 1. Call a server-side function/edge function to delete the user
      // 2. Use the Supabase admin API on your backend
      // For now, we'll sign out the user and you should implement server-side deletion

      // Call your backend endpoint to delete the user
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}api/auth/delete-account`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to delete account');
      }

      await supabase.auth.signOut();
      setUser(null);
      localStorage.removeItem('auth_token');
    } catch (err) {
      const msg = getErrorMessage(err);
      setError(msg);
      throw new Error(msg);
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      error,
      signUp,
      signIn,
      signInWithGoogle,
      logout,
      resetPassword,
      resendVerificationEmail,
      reloadUser,
      updateUserProfile,
      deleteAccount,
      isGoogleUser,
      clearError
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

const getErrorMessage = (error: unknown): string => {
  if (error instanceof AuthError) {
    const messages: Record<string, string> = {
      'Invalid login credentials': 'Invalid email or password.',
      'Email not confirmed': 'Please verify your email before signing in.',
      'User already registered': 'This email is already registered.',
      'Password should be at least 6 characters': 'Password should be at least 6 characters.',
      'Unable to validate email address: invalid format': 'Please enter a valid email address.',
      'Email rate limit exceeded': 'Too many attempts. Try again later.',
      'User not found': 'No account found with this email.',
    };

    // Check for partial matches
    for (const [key, value] of Object.entries(messages)) {
      if (error.message.includes(key)) {
        return value;
      }
    }

    return error.message || 'An unexpected error occurred.';
  }

  if (error instanceof Error) {
    return error.message || 'An unexpected error occurred.';
  }

  return 'An unexpected error occurred.';
};

export default AuthContext;
