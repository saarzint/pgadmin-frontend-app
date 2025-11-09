import React, { useState } from 'react';
import { Camera, Edit2 } from 'lucide-react';

interface ProfileHeaderProps {
  name?: string;
  quote?: string;
  imageUrl?: string;
  onUpdateProfile?: (name: string, quote: string) => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  name = 'John Doe',
  quote = 'Aspiring to make a difference in the world through education',
  imageUrl,
  onUpdateProfile,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(name);
  const [editQuote, setEditQuote] = useState(quote);

  const handleSave = () => {
    onUpdateProfile?.(editName, editQuote);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditName(name);
    setEditQuote(quote);
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-start gap-6">
        {/* Profile Image */}
        <div className="relative flex-shrink-0">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold">
            {imageUrl ? (
              <img src={imageUrl} alt={name} className="w-full h-full rounded-full object-cover" />
            ) : (
              name.charAt(0).toUpperCase()
            )}
          </div>
          <button
            className="absolute bottom-0 right-0 w-10 h-10 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors shadow-lg"
            aria-label="Upload photo"
          >
            <Camera size={18} />
          </button>
        </div>

        {/* Profile Info */}
        <div className="flex-1">
          {isEditing ? (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quote</label>
                <textarea
                  value={editQuote}
                  onChange={(e) => setEditQuote(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-semibold"
                >
                  Save Changes
                </button>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-start justify-between mb-2">
                <h1 className="text-3xl font-bold text-primary-darkest">{name}</h1>
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Edit profile"
                >
                  <Edit2 size={18} className="text-gray-600" />
                </button>
              </div>
              <p className="text-gray-600 text-base italic">"{quote}"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
