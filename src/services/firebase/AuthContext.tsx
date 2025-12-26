import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import {
  User as FirebaseUser,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  deleteUser,
  reauthenticateWithCredential,
  reauthenticateWithPopup,
  EmailAuthProvider,
} from 'firebase/auth';
import { auth } from './config';

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

const formatUser = (user: FirebaseUser): User => ({
  uid: user.uid,
  email: user.email,
  displayName: user.displayName,
  photoURL: user.photoURL,
  emailVerified: user.emailVerified,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser ? formatUser(firebaseUser) : null);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, displayName?: string) => {
    try {
      setError(null);
      const result = await createUserWithEmailAndPassword(auth, email, password);
      if (result.user) {
        if (displayName) {
          await updateProfile(result.user, { displayName });
        }
        // Send verification email
        try {
          await sendEmailVerification(result.user);
          console.log('Verification email sent successfully to:', result.user.email);
        } catch (emailErr) {
          console.error('Failed to send verification email:', emailErr);
          // Don't block signup if email fails, user can resend from verify page
        }
        setUser(formatUser(result.user));
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
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      const msg = getErrorMessage(err);
      setError(msg);
      throw new Error(msg);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setError(null);
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err) {
      const msg = getErrorMessage(err);
      setError(msg);
      throw new Error(msg);
    }
  };

  const logout = async () => {
    try {
      setError(null);
      await signOut(auth);
    } catch (err) {
      const msg = getErrorMessage(err);
      setError(msg);
      throw new Error(msg);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setError(null);
      await sendPasswordResetEmail(auth, email);
    } catch (err) {
      const msg = getErrorMessage(err);
      setError(msg);
      throw new Error(msg);
    }
  };

  const resendVerificationEmail = async () => {
    try {
      setError(null);
      if (auth.currentUser) {
        await sendEmailVerification(auth.currentUser);
        console.log('Verification email resent to:', auth.currentUser.email);
      } else {
        throw new Error('No user logged in');
      }
    } catch (err) {
      console.error('Failed to resend verification email:', err);
      const msg = getErrorMessage(err);
      setError(msg);
      throw new Error(msg);
    }
  };

  const reloadUser = useCallback(async () => {
    try {
      if (auth.currentUser) {
        await auth.currentUser.reload();
        setUser(formatUser(auth.currentUser));
      }
    } catch (err) {
      console.error('Failed to reload user:', err);
    }
  }, []);

  const updateUserProfile = async (displayName: string, photoURL?: string) => {
    try {
      setError(null);
      if (!auth.currentUser) {
        throw new Error('No user logged in');
      }

      const updateData: { displayName?: string; photoURL?: string } = {};
      if (displayName) {
        updateData.displayName = displayName;
      }
      if (photoURL !== undefined) {
        updateData.photoURL = photoURL;
      }

      await updateProfile(auth.currentUser, updateData);

      // Reload and update local state
      await auth.currentUser.reload();
      setUser(formatUser(auth.currentUser));
    } catch (err) {
      const msg = getErrorMessage(err);
      setError(msg);
      throw new Error(msg);
    }
  };

  const isGoogleUser = (): boolean => {
    if (auth.currentUser) {
      return auth.currentUser.providerData.some(
        (provider) => provider.providerId === 'google.com'
      );
    }
    return false;
  };

  const deleteAccount = async (password?: string) => {
    try {
      setError(null);
      if (!auth.currentUser) {
        throw new Error('No user logged in');
      }

      // Check if user signed in with Google
      const isGoogle = isGoogleUser();

      if (isGoogle) {
        // Re-authenticate with Google
        const provider = new GoogleAuthProvider();
        await reauthenticateWithPopup(auth.currentUser, provider);
      } else {
        // Re-authenticate with email/password
        if (!password) {
          throw new Error('Password is required');
        }
        if (!auth.currentUser.email) {
          throw new Error('No email associated with account');
        }
        const credential = EmailAuthProvider.credential(auth.currentUser.email, password);
        await reauthenticateWithCredential(auth.currentUser, credential);
      }
      
      // Now delete the user
      await deleteUser(auth.currentUser);
      setUser(null);
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
  if (error instanceof Error) {
    const code = (error as { code?: string }).code;
    const messages: Record<string, string> = {
      'auth/email-already-in-use': 'This email is already registered.',
      'auth/invalid-email': 'Please enter a valid email address.',
      'auth/weak-password': 'Password should be at least 6 characters.',
      'auth/user-not-found': 'No account found with this email.',
      'auth/wrong-password': 'Incorrect password.',
      'auth/invalid-credential': 'Invalid email or password.',
      'auth/too-many-requests': 'Too many attempts. Try again later.',
      'auth/popup-closed-by-user': 'Sign-in was cancelled.',
      'auth/requires-recent-login': 'Please log out and log in again before deleting your account.',
      'auth/unauthorized-domain': `This domain is not authorized for Firebase Authentication. Please add "${typeof window !== 'undefined' ? window.location.hostname : 'your-domain'}" to your Firebase project's authorized domains in the Firebase Console.`,
    };
    return messages[code || ''] || error.message || 'An unexpected error occurred.';
  }
  return 'An unexpected error occurred.';
};

export default AuthContext;
