import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, useProfile } from '../../services/supabase';
import { profileService, type UserProfile, type AcademicBackground, type Preferences } from '../../services/api/profileService';
import {
  Settings, Trash2, AlertTriangle, X, Lock, Eye, EyeOff, Loader2,
  XCircle, CreditCard, ArrowUpRight, User, GraduationCap,
  BookOpen, Award, Target, Save
} from 'lucide-react';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { user, deleteAccount, isGoogleUser } = useAuth();
  const { profileId: contextProfileId, profile: contextProfile, refreshProfile, setStoredProfileId } = useProfile();

  // Loading and error states
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Profile data state - use context profile ID
  const [profileId, setProfileId] = useState<number | null>(null);
  const [profileData, setProfileData] = useState<Partial<UserProfile>>({
    full_name: '',
    citizenship_country: '',
    destination_country: '',
    gpa: undefined,
    test_scores: {},
    academic_background: {},
    intended_major: '',
    extracurriculars: [],
    financial_aid_eligibility: false,
    budget: undefined,
    preferences: {},
  });

  // Delete account state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deletePassword, setDeletePassword] = useState('');
  const [showDeletePassword, setShowDeletePassword] = useState(false);

  // Cancel subscription state
  const [showCancelSubscriptionModal, setShowCancelSubscriptionModal] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);

  // Subscription info (stubbed until backend provides actual plan)
  const [activePlan] = useState({
    name: 'Pro',
    price: '$19/mo',
    status: 'Active',
    renewsOn: 'Renews monthly',
    priceId: 'prod_TaMzokkGtuI95E',
  });
  const [isUpgrading, setIsUpgrading] = useState(false);

  // Extracurricular input
  const [newExtracurricular, setNewExtracurricular] = useState('');

  // Sync profile data from context
  useEffect(() => {
    if (contextProfileId !== null && contextProfile) {
      setProfileId(contextProfileId);
      setProfileData(contextProfile);
      setIsLoading(false);
    } else if (contextProfileId === null) {
      // Profile doesn't exist yet - initialize with user's name from auth
      if (user?.displayName) {
        setProfileData(prev => ({ ...prev, full_name: user.displayName || '' }));
      }
      setIsLoading(false);
    }
  }, [contextProfileId, contextProfile, user?.displayName]);

  const handleSaveProfile = async () => {
    if (!profileData.full_name?.trim()) {
      setError('Full name is required');
      return;
    }

    setIsSaving(true);
    setError(null);
    setSaveSuccess(false);

    try {
      let response;
      if (profileId) {
        // Update existing profile
        response = await profileService.updateProfile(profileId, profileData);
      } else {
        // Create new profile
        response = await profileService.createProfile(profileData);
      }

      if (response.success) {
        const newProfileId = response.profile.id || null;
        setProfileId(newProfileId);
        setProfileData(response.profile);
        setSaveSuccess(true);
        // Store profile ID and refresh context so other components get the updated profile
        if (newProfileId) {
          setStoredProfileId(newProfileId);
        }
        await refreshProfile();
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        setError(response.message || 'Failed to save profile');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save profile');
    } finally {
      setIsSaving(false);
    }
  };

  // Update nested objects
  const updateTestScore = (testType: string, value: number | undefined) => {
    setProfileData(prev => ({
      ...prev,
      test_scores: {
        ...prev.test_scores,
        [testType]: value,
      },
    }));
  };

  const updateAcademicBackground = (field: keyof AcademicBackground, value: unknown) => {
    setProfileData(prev => ({
      ...prev,
      academic_background: {
        ...prev.academic_background,
        [field]: value,
      },
    }));
  };

  const updatePreferences = (field: keyof Preferences, value: unknown) => {
    setProfileData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [field]: value,
      },
    }));
  };

  const addExtracurricular = () => {
    if (newExtracurricular.trim()) {
      setProfileData(prev => ({
        ...prev,
        extracurriculars: [...(prev.extracurriculars || []), newExtracurricular.trim()],
      }));
      setNewExtracurricular('');
    }
  };

  const removeExtracurricular = (index: number) => {
    setProfileData(prev => ({
      ...prev,
      extracurriculars: prev.extracurriculars?.filter((_, i) => i !== index) || [],
    }));
  };

  // Delete account handlers
  const handleDeleteAccount = async () => {
    const isGoogle = isGoogleUser();

    if (!isGoogle && !deletePassword) {
      setDeleteError('Please enter your password');
      return;
    }

    setIsDeleting(true);
    setDeleteError(null);
    try {
      await deleteAccount(isGoogle ? undefined : deletePassword);
      navigate('/login');
    } catch (error) {
      setDeleteError(error instanceof Error ? error.message : 'Failed to delete account');
    } finally {
      setIsDeleting(false);
    }
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setDeleteError(null);
    setDeletePassword('');
    setShowDeletePassword(false);
  };

  // Cancel subscription handlers
  const handleCancelSubscription = async () => {
    setIsCanceling(true);
    setCancelError(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setShowCancelSubscriptionModal(false);
      alert('Your subscription has been canceled. You now have access to free features.');
    } catch (error) {
      setCancelError(error instanceof Error ? error.message : 'Failed to cancel subscription');
    } finally {
      setIsCanceling(false);
    }
  };

  const closeCancelSubscriptionModal = () => {
    setShowCancelSubscriptionModal(false);
    setCancelError(null);
  };

  const handleUpgrade = () => {
    setIsUpgrading(true);
    navigate('/billing');
    setIsUpgrading(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50/50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-primary-dark animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50/50 py-4">
        <div className="w-full px-4 sm:px-6">
          <div className="space-y-4">
            {/* Top actions */}
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
              <div className="flex gap-2">
                <button
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Save Profile
                </button>
                <button
                  onClick={() => navigate('/billing')}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-dark text-white text-sm font-semibold hover:bg-primary-darkest transition-colors"
                >
                  <ArrowUpRight className="w-4 h-4" />
                  Upgrade
                </button>
              </div>
            </div>

            {/* Success notification */}
            {saveSuccess && (
              <div className="fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 bg-green-50 border border-green-200 rounded-xl shadow-lg animate-in fade-in slide-in-from-top-2">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-green-800">Profile saved!</p>
                  <p className="text-xs text-green-600">Your changes have been saved.</p>
                </div>
              </div>
            )}

            {/* Error notification */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-red-600" />
                  <span className="text-red-800">{error}</span>
                </div>
                <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* Basic Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Basic Information</h2>
                  <p className="text-sm text-gray-500">Your personal details</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={profileData.full_name || ''}
                    onChange={(e) => setProfileData(prev => ({ ...prev, full_name: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Intended Major</label>
                  <input
                    type="text"
                    value={profileData.intended_major || ''}
                    onChange={(e) => setProfileData(prev => ({ ...prev, intended_major: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Computer Science"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Citizenship Country</label>
                  <input
                    type="text"
                    value={profileData.citizenship_country || ''}
                    onChange={(e) => setProfileData(prev => ({ ...prev, citizenship_country: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="USA"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Destination Country</label>
                  <input
                    type="text"
                    value={profileData.destination_country || ''}
                    onChange={(e) => setProfileData(prev => ({ ...prev, destination_country: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="UK"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">GPA (0.00 - 4.00)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="4"
                    value={profileData.gpa || ''}
                    onChange={(e) => setProfileData(prev => ({ ...prev, gpa: e.target.value ? parseFloat(e.target.value) : undefined }))}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="3.85"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Annual Budget (USD)</label>
                  <input
                    type="number"
                    value={profileData.budget || ''}
                    onChange={(e) => setProfileData(prev => ({ ...prev, budget: e.target.value ? parseInt(e.target.value) : undefined }))}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="50000"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={profileData.financial_aid_eligibility || false}
                      onChange={(e) => setProfileData(prev => ({ ...prev, financial_aid_eligibility: e.target.checked }))}
                      className="w-4 h-4 text-primary-dark border-gray-300 rounded focus:ring-primary"
                    />
                    <span className="text-sm text-gray-700">I'm interested in financial aid / scholarships</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Test Scores */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Test Scores</h2>
                  <p className="text-sm text-gray-500">Your standardized test scores</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['SAT', 'ACT', 'GRE', 'GMAT', 'TOEFL', 'IELTS', 'Duolingo'].map((test) => (
                  <div key={test}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{test}</label>
                    <input
                      type="number"
                      step={test === 'IELTS' ? '0.5' : '1'}
                      value={profileData.test_scores?.[test] || ''}
                      onChange={(e) => updateTestScore(test, e.target.value ? parseFloat(e.target.value) : undefined)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                      placeholder={test === 'SAT' ? '1450' : test === 'ACT' ? '32' : test === 'IELTS' ? '7.5' : '110'}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Academic Background */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Academic Background</h2>
                  <p className="text-sm text-gray-500">Your educational history</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Degree</label>
                  <select
                    value={profileData.academic_background?.degree || ''}
                    onChange={(e) => updateAcademicBackground('degree', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">Select degree</option>
                    <option value="High School">High School</option>
                    <option value="Bachelor's">Bachelor's</option>
                    <option value="Master's">Master's</option>
                    <option value="PhD">PhD</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Major</label>
                  <input
                    type="text"
                    value={profileData.academic_background?.major || ''}
                    onChange={(e) => updateAcademicBackground('major', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Physics"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">University/Institution</label>
                  <input
                    type="text"
                    value={profileData.academic_background?.university || ''}
                    onChange={(e) => updateAcademicBackground('university', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="State University"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Graduation Year</label>
                  <input
                    type="number"
                    value={profileData.academic_background?.graduation_year || ''}
                    onChange={(e) => updateAcademicBackground('graduation_year', e.target.value ? parseInt(e.target.value) : undefined)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="2024"
                  />
                </div>
              </div>
            </div>

            {/* Extracurriculars */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Award className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Extracurriculars & Awards</h2>
                  <p className="text-sm text-gray-500">Activities, clubs, and achievements</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newExtracurricular}
                    onChange={(e) => setNewExtracurricular(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addExtracurricular()}
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Add activity, club, or achievement..."
                  />
                  <button
                    onClick={addExtracurricular}
                    className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                  >
                    Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {profileData.extracurriculars?.map((item, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-sm"
                    >
                      {item}
                      <button
                        onClick={() => removeExtracurricular(index)}
                        className="text-orange-400 hover:text-orange-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </span>
                  ))}
                  {(!profileData.extracurriculars || profileData.extracurriculars.length === 0) && (
                    <p className="text-gray-400 text-sm">No extracurriculars added yet</p>
                  )}
                </div>
              </div>
            </div>

            {/* Preferences */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
                  <Target className="w-5 h-5 text-cyan-600" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">University Preferences</h2>
                  <p className="text-sm text-gray-500">What you're looking for in a university</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location Type</label>
                  <select
                    value={profileData.preferences?.location || ''}
                    onChange={(e) => updatePreferences('location', e.target.value as Preferences['location'])}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">Select...</option>
                    <option value="Urban">Urban</option>
                    <option value="Suburban">Suburban</option>
                    <option value="Rural">Rural</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Campus Size</label>
                  <select
                    value={profileData.preferences?.campus_size || ''}
                    onChange={(e) => updatePreferences('campus_size', e.target.value as Preferences['campus_size'])}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">Select...</option>
                    <option value="Small">Small</option>
                    <option value="Medium">Medium</option>
                    <option value="Large">Large</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Environment</label>
                  <select
                    value={profileData.preferences?.environment || ''}
                    onChange={(e) => updatePreferences('environment', e.target.value as Preferences['environment'])}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">Select...</option>
                    <option value="Research-focused">Research-focused</option>
                    <option value="Teaching-focused">Teaching-focused</option>
                    <option value="Liberal Arts">Liberal Arts</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Climate</label>
                  <select
                    value={profileData.preferences?.climate || ''}
                    onChange={(e) => updatePreferences('climate', e.target.value as Preferences['climate'])}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">Select...</option>
                    <option value="Warm">Warm</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Cold">Cold</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ranking Preference</label>
                  <select
                    value={profileData.preferences?.ranking_preference || ''}
                    onChange={(e) => updatePreferences('ranking_preference', e.target.value as Preferences['ranking_preference'])}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">Select...</option>
                    <option value="Top 20">Top 20</option>
                    <option value="Top 50">Top 50</option>
                    <option value="Top 100">Top 100</option>
                    <option value="Any">Any</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Account Settings */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Settings className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Account Settings</h2>
                  <p className="text-sm text-gray-500">Manage your account preferences</p>
                </div>
              </div>

              {/* Account Info */}
              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Signed in as</p>
                <p className="font-medium text-gray-900">{user?.email}</p>
                {isGoogleUser() && (
                  <div className="flex items-center gap-2 mt-2">
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span className="text-xs text-gray-500">Connected with Google</span>
                  </div>
                )}
              </div>

              {/* Subscription */}
              <div className="border border-orange-200 rounded-lg p-4 bg-orange-50/50 mb-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-semibold text-orange-800">Subscription</h3>
                    <p className="text-sm text-orange-700 mt-1">
                      Active plan: <span className="font-semibold">{activePlan.name}</span> ({activePlan.price})
                    </p>
                    <p className="text-xs text-orange-600 mt-1">{activePlan.renewsOn}</p>
                  </div>
                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700">
                    {activePlan.status}
                  </span>
                </div>

                <div className="mt-4 flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={handleUpgrade}
                    disabled={isUpgrading}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary-dark text-white text-sm font-semibold hover:bg-primary-darkest transition-colors disabled:opacity-60"
                  >
                    {isUpgrading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowUpRight className="w-4 h-4" />}
                    Upgrade / Manage
                  </button>
                  <button
                    onClick={() => setShowCancelSubscriptionModal(true)}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-white border border-orange-300 rounded-lg text-orange-700 hover:bg-orange-100 transition-colors text-sm font-semibold"
                  >
                    <CreditCard size={16} />
                    Cancel Subscription
                  </button>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="border border-red-200 rounded-lg p-4 bg-red-50/50">
                <h3 className="text-sm font-semibold text-red-800 mb-2">Danger Zone</h3>
                <p className="text-sm text-red-600 mb-4">
                  Once you delete your account, there is no going back. Please be certain.
                </p>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-red-300 rounded-lg text-red-600 hover:bg-red-50 transition-colors text-sm font-medium"
                >
                  <Trash2 size={16} />
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative">
            <button onClick={closeDeleteModal} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>

            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>

            <h2 className="text-xl font-bold text-gray-900 text-center mb-2">Delete Account?</h2>
            <p className="text-gray-600 text-center mb-6">
              This action is <strong>permanent</strong> and cannot be undone.
            </p>

            {isGoogleUser() ? (
              <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <div className="flex items-center gap-3">
                  <svg className="w-6 h-6" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-blue-800">Google Account</p>
                    <p className="text-xs text-blue-600">You'll be asked to verify with Google</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Enter password to confirm</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showDeletePassword ? 'text' : 'password'}
                    value={deletePassword}
                    onChange={(e) => setDeletePassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowDeletePassword(!showDeletePassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showDeletePassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            )}

            {deleteError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                {deleteError}
              </div>
            )}

            <div className="flex gap-3">
              <button onClick={closeDeleteModal} className="flex-1 py-3 border border-gray-200 rounded-xl font-medium hover:bg-gray-50 text-gray-700">
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={isDeleting || (!isGoogleUser() && !deletePassword)}
                className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isDeleting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 size={18} />}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Subscription Modal */}
      {showCancelSubscriptionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative">
            <button onClick={closeCancelSubscriptionModal} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>

            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard className="w-8 h-8 text-orange-600" />
            </div>

            <h2 className="text-xl font-bold text-gray-900 text-center mb-2">Cancel Subscription?</h2>
            <p className="text-gray-600 text-center mb-6">
              You'll be switched to a <strong>free account</strong>. You can resubscribe anytime.
            </p>

            {cancelError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                {cancelError}
              </div>
            )}

            <div className="flex gap-3">
              <button onClick={closeCancelSubscriptionModal} disabled={isCanceling} className="flex-1 py-3 border border-gray-200 rounded-xl font-medium hover:bg-gray-50 text-gray-700 disabled:opacity-50">
                Keep Subscription
              </button>
              <button
                onClick={handleCancelSubscription}
                disabled={isCanceling}
                className="flex-1 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isCanceling ? <Loader2 className="w-5 h-5 animate-spin" /> : <XCircle size={18} />}
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;
