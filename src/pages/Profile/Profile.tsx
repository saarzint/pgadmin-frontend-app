import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ProfileHeader,
  AcademicInformation,
  StandardizedTests,
  ExtracurricularActivities,
  AwardsHonors,
} from '../../components/Profile';
import { useAuth } from '../../services/firebase';
import { Settings, Trash2, AlertTriangle, X, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import type { AcademicRecord } from '../../components/Profile/AcademicInformation/AcademicInformation';
import type { TestScore } from '../../components/Profile/StandardizedTests/StandardizedTests';
import type { Activity } from '../../components/Profile/ExtracurricularActivities/ExtracurricularActivities';
import type { AwardHonor } from '../../components/Profile/AwardsHonors/AwardsHonors';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { user, deleteAccount, isGoogleUser } = useAuth();

  // Delete account state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deletePassword, setDeletePassword] = useState('');
  const [showDeletePassword, setShowDeletePassword] = useState(false);

  // Profile state
  const [profileName, setProfileName] = useState('John Doe');
  const [profileQuote, setProfileQuote] = useState(
    'Aspiring to make a difference in the world through education'
  );

  // Academic records state
  const [academicRecords, setAcademicRecords] = useState<AcademicRecord[]>([
    {
      id: '1',
      degree: 'Bachelor of Science in Computer Science',
      institution: 'University of California, Berkeley',
      gpa: '3.9',
      maxGpa: '4.0',
      startDate: '2020-09',
      endDate: '2024-05',
      grades: '95%',
    },
  ]);

  // Test scores state
  const [testScores, setTestScores] = useState<TestScore[]>([
    {
      id: '1',
      testType: 'SAT',
      score: '1520',
      maxScore: '1600',
      testDate: '2023-12-15',
    },
    {
      id: '2',
      testType: 'TOEFL',
      score: '110',
      maxScore: '120',
      testDate: '2024-01-20',
      expiryDate: '2026-01-20',
    },
  ]);

  // Activities state
  const [activities, setActivities] = useState<Activity[]>([
    {
      id: '1',
      title: 'Debate Team Captain',
      organization: 'UC Berkeley',
      role: 'Team Captain & Lead Debater',
      category: 'Leadership',
      startDate: '2021-09',
      endDate: '2024-05',
      isOngoing: false,
      description:
        'Led a team of 15 members to win regional championships. Organized weekly practice sessions and mentored junior members.',
      hoursPerWeek: '10',
      weeksPerYear: '40',
    },
  ]);

  // Awards state
  const [awards, setAwards] = useState<AwardHonor[]>([
    {
      id: '1',
      title: 'Dean\'s List',
      issuer: 'UC Berkeley',
      category: 'Academic',
      level: 'School',
      dateReceived: '2023-05',
      description: 'Recognized for maintaining a GPA above 3.75 for three consecutive semesters.',
    },
  ]);

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

  // Handlers for Academic Records
  const handleAddAcademicRecord = (record: Omit<AcademicRecord, 'id'>) => {
    const newRecord: AcademicRecord = {
      ...record,
      id: Date.now().toString(),
    };
    setAcademicRecords([...academicRecords, newRecord]);
  };

  const handleEditAcademicRecord = (id: string, record: Omit<AcademicRecord, 'id'>) => {
    setAcademicRecords(
      academicRecords.map((r) => (r.id === id ? { ...record, id } : r))
    );
  };

  const handleDeleteAcademicRecord = (id: string) => {
    setAcademicRecords(academicRecords.filter((r) => r.id !== id));
  };

  // Handlers for Test Scores
  const handleAddTestScore = (test: Omit<TestScore, 'id'>) => {
    const newTest: TestScore = {
      ...test,
      id: Date.now().toString(),
    };
    setTestScores([...testScores, newTest]);
  };

  const handleEditTestScore = (id: string, test: Omit<TestScore, 'id'>) => {
    setTestScores(testScores.map((t) => (t.id === id ? { ...test, id } : t)));
  };

  const handleDeleteTestScore = (id: string) => {
    setTestScores(testScores.filter((t) => t.id !== id));
  };

  // Handlers for Activities
  const handleAddActivity = (activity: Omit<Activity, 'id'>) => {
    const newActivity: Activity = {
      ...activity,
      id: Date.now().toString(),
    };
    setActivities([...activities, newActivity]);
  };

  const handleEditActivity = (id: string, activity: Omit<Activity, 'id'>) => {
    setActivities(activities.map((a) => (a.id === id ? { ...activity, id } : a)));
  };

  const handleDeleteActivity = (id: string) => {
    setActivities(activities.filter((a) => a.id !== id));
  };

  // Handlers for Awards
  const handleAddAward = (award: Omit<AwardHonor, 'id'>) => {
    const newAward: AwardHonor = {
      ...award,
      id: Date.now().toString(),
    };
    setAwards([...awards, newAward]);
  };

  const handleEditAward = (id: string, award: Omit<AwardHonor, 'id'>) => {
    setAwards(awards.map((a) => (a.id === id ? { ...award, id } : a)));
  };

  const handleDeleteAward = (id: string) => {
    setAwards(awards.filter((a) => a.id !== id));
  };

  // Handler for Profile Update
  const handleUpdateProfile = (name: string, quote: string) => {
    setProfileName(name);
    setProfileQuote(quote);
  };

  return (
    <>
      <div className="min-h-screen bg-white py-4">
        <div className="w-full px-6">
          <div className="space-y-6">
            {/* Profile Header */}
            <ProfileHeader
              name={profileName}
              quote={profileQuote}
              onUpdateProfile={handleUpdateProfile}
            />

            {/* Academic Information */}
            <AcademicInformation
              records={academicRecords}
              onAdd={handleAddAcademicRecord}
              onEdit={handleEditAcademicRecord}
              onDelete={handleDeleteAcademicRecord}
            />

            {/* Standardized Tests */}
            <StandardizedTests
              tests={testScores}
              onAdd={handleAddTestScore}
              onEdit={handleEditTestScore}
              onDelete={handleDeleteTestScore}
            />

            {/* Extracurricular Activities */}
            <ExtracurricularActivities
              activities={activities}
              onAdd={handleAddActivity}
              onEdit={handleEditActivity}
              onDelete={handleDeleteActivity}
            />

            {/* Awards & Honors */}
            <AwardsHonors
              awards={awards}
              onAdd={handleAddAward}
              onEdit={handleEditAward}
              onDelete={handleDeleteAward}
            />

            {/* Account Settings */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                  <Settings className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Account Settings</h2>
                  <p className="text-sm text-gray-500">Manage your account preferences</p>
                </div>
              </div>

              {/* Account Info */}
              <div className="mb-6 p-4 bg-gray-50 rounded-xl">
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

              {/* Danger Zone */}
              <div className="border border-red-200 rounded-xl p-4 bg-red-50/50">
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

      {/* Delete Account Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative">
            {/* Close Button */}
            <button
              onClick={closeDeleteModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </button>

            {/* Warning Icon */}
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>

            {/* Title */}
            <h2 className="text-xl font-bold text-gray-900 text-center mb-2">
              Delete Account?
            </h2>

            {/* Description */}
            <p className="text-gray-600 text-center mb-6">
              This action is <strong>permanent</strong> and cannot be undone. All your data will be permanently deleted.
            </p>

            {/* Password Input for Email users OR Google info */}
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter your password to confirm
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showDeletePassword ? 'text' : 'password'}
                    value={deletePassword}
                    onChange={(e) => setDeletePassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
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

            {/* Error Message */}
            {deleteError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                {deleteError}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={closeDeleteModal}
                className="flex-1 py-3 border border-gray-200 rounded-xl font-medium hover:bg-gray-50 transition-colors text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={isDeleting || (!isGoogleUser() && !deletePassword)}
                className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : isGoogleUser() ? (
                  <>
                    <Trash2 size={18} />
                    Verify & Delete
                  </>
                ) : (
                  <>
                    <Trash2 size={18} />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;
