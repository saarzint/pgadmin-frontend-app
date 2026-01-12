/**
 * Profile Context
 * Provides user profile data (including profile ID) throughout the app
 *
 * NOTE: Profile ID is stored in localStorage after profile creation.
 * The backend uses simple integer IDs (GET /profile/<id>).
 */

import { createContext, useContext, useEffect, useState, ReactNode, useCallback, useRef } from 'react';
import { useAuth } from './AuthContext';
import { profileService, type UserProfile } from '../api/profileService';

const PROFILE_ID_KEY = 'pgadmit_profile_id';

export interface ProfileContextType {
  profile: UserProfile | null;
  profileId: number | null;
  loading: boolean;
  error: string | null;
  refreshProfile: () => Promise<void>;
  setStoredProfileId: (id: number) => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const userUid = user?.uid;
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [profileId, setProfileId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Track if we've already fetched for this user
  const hasFetchedRef = useRef(false);

  // Store profile ID in localStorage for persistence
  const setStoredProfileId = useCallback((id: number) => {
    localStorage.setItem(PROFILE_ID_KEY, id.toString());
    setProfileId(id);
  }, []);

  // Fetch profile when user changes
  useEffect(() => {
    // Reset fetch flag when user changes
    hasFetchedRef.current = false;
  }, [userUid]);

  useEffect(() => {
    // Skip if already fetched for this user
    if (hasFetchedRef.current) {
      return;
    }

    const fetchProfile = async () => {
      if (!userUid) {
        setProfile(null);
        setProfileId(null);
        setLoading(false);
        return;
      }

      // Check localStorage for stored profile ID
      const storedId = localStorage.getItem(PROFILE_ID_KEY);
      const idToFetch = storedId ? parseInt(storedId, 10) : null;

      if (!idToFetch) {
        setProfile(null);
        setProfileId(null);
        setLoading(false);
        hasFetchedRef.current = true;
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await profileService.getProfile(idToFetch);

        if (response.success && response.profile) {
          setProfile(response.profile);
          setProfileId(response.profile.id || null);
        } else {
          localStorage.removeItem(PROFILE_ID_KEY);
          setProfile(null);
          setProfileId(null);
        }
      } catch {
        localStorage.removeItem(PROFILE_ID_KEY);
        setProfile(null);
        setProfileId(null);
      } finally {
        setLoading(false);
        hasFetchedRef.current = true;
      }
    };

    fetchProfile();
  }, [userUid]);

  const refreshProfile = useCallback(async () => {
    if (!userUid) return;

    const storedId = localStorage.getItem(PROFILE_ID_KEY);
    const idToFetch = storedId ? parseInt(storedId, 10) : null;
    if (!idToFetch) return;

    setLoading(true);
    try {
      const response = await profileService.getProfile(idToFetch);
      if (response.success && response.profile) {
        setProfile(response.profile);
        setProfileId(response.profile.id || null);
      }
    } catch {
      // Profile refresh failed silently
    } finally {
      setLoading(false);
    }
  }, [userUid]);

  return (
    <ProfileContext.Provider
      value={{
        profile,
        profileId,
        loading,
        error,
        refreshProfile,
        setStoredProfileId,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = (): ProfileContextType => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within ProfileProvider');
  }
  return context;
};

export default ProfileContext;
