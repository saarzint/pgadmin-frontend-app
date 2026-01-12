import React, { useState, useEffect } from 'react';
import { Camera, Edit2, Check, X, Loader2, Mail, Shield, CheckCircle } from 'lucide-react';
import { useAuth } from '../../../services/supabase';

interface ProfileHeaderProps {
  name?: string;
  quote?: string;
  imageUrl?: string;
  email?: string;
  emailVerified?: boolean;
  onUpdateProfile?: (name: string, quote: string) => Promise<void> | void;
  isLoading?: boolean;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  name = 'John Doe',
  quote = 'Aspiring to make a difference in the world through education',
  imageUrl,
  email,
  emailVerified = false,
  onUpdateProfile,
  isLoading = false,
}) => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(name);
  const [editQuote, setEditQuote] = useState(quote);
  const [isSaving, setIsSaving] = useState(false);

  // Sync with props when they change
  useEffect(() => {
    setEditName(name);
    setEditQuote(quote);
  }, [name, quote]);

  const displayEmail = email || user?.email || '';
  const isVerified = emailVerified || user?.emailVerified || false;
  const displayImage = imageUrl || user?.photoURL || null;

  const handleSave = async () => {
    if (!editName.trim()) return;
    setIsSaving(true);
    try {
      await onUpdateProfile?.(editName.trim(), editQuote.trim());
      setIsEditing(false);
    } catch {
      // Error handled by parent
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditName(name);
    setEditQuote(quote);
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary-dark via-primary to-primary-dark p-[1px]">
        <div className="bg-white rounded-2xl p-8">
          <div className="flex items-center gap-6 animate-pulse">
            <div className="w-28 h-28 rounded-full bg-gray-200" />
            <div className="flex-1 space-y-3">
              <div className="h-8 bg-gray-200 rounded-lg w-48" />
              <div className="h-4 bg-gray-200 rounded w-64" />
              <div className="h-4 bg-gray-200 rounded w-40" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
      <div className="flex items-start gap-4">
        {/* Profile Image */}
        <div className="relative flex-shrink-0">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-primary to-primary-dark">
            {displayImage ? (
              <img
                src={displayImage}
                alt={name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  // Hide broken image, show initials instead
                  e.currentTarget.style.display = 'none';
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-white text-lg font-bold">{initials}</span>
              </div>
            )}
          </div>
          <button
            className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary-dark text-white rounded-full flex items-center justify-center hover:bg-primary-darkest transition-all shadow-md border-2 border-white"
            aria-label="Upload photo"
          >
            <Camera size={10} />
          </button>
        </div>

        {/* Profile Info */}
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <div className="space-y-3 bg-gray-50 rounded-lg p-3 border border-gray-100">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Display Name
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Bio / Quote
                </label>
                <textarea
                  value={editQuote}
                  onChange={(e) => setEditQuote(e.target.value)}
                  placeholder="Share something about yourself..."
                  rows={2}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-gray-700 text-sm resize-none"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  disabled={isSaving || !editName.trim()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-dark text-white rounded-lg hover:bg-primary-darkest transition-all text-sm font-medium disabled:opacity-50"
                >
                  {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                  {isSaving ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={handleCancel}
                  disabled={isSaving}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-all text-sm font-medium"
                >
                  <X size={14} />
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h1 className="text-lg font-bold text-gray-900 truncate">{name}</h1>
                {quote && (
                  <p className="text-gray-500 text-sm mt-0.5 italic line-clamp-1">"{quote}"</p>
                )}
                {/* Badges */}
                <div className="flex flex-wrap items-center gap-1.5 mt-2">
                  <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-gray-100 rounded-full">
                    <Mail size={12} className="text-gray-500" />
                    <span className="text-xs text-gray-600 truncate max-w-[180px]">{displayEmail}</span>
                  </div>
                  {isVerified && (
                    <div className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 rounded-full">
                      <CheckCircle size={12} />
                      <span className="text-xs font-medium">Verified</span>
                    </div>
                  )}
                  <div className="inline-flex items-center gap-1 px-2 py-1 bg-primary-lightest text-primary-dark rounded-full">
                    <Shield size={12} />
                    <span className="text-xs font-medium">Student</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsEditing(true)}
                className="flex-shrink-0 p-2 bg-gray-100 hover:bg-primary-lightest rounded-lg transition-all"
                aria-label="Edit profile"
              >
                <Edit2 size={16} className="text-gray-500" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
