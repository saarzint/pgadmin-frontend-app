import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Upload, FileText } from 'lucide-react';

export interface Activity {
  id: string;
  title: string;
  organization: string;
  role: string;
  category: string;
  startDate: string;
  endDate?: string;
  isOngoing: boolean;
  description: string;
  hoursPerWeek?: string;
  weeksPerYear?: string;
  document?: string;
}

interface ExtracurricularActivitiesProps {
  activities?: Activity[];
  onAdd?: (activity: Omit<Activity, 'id'>) => void;
  onEdit?: (id: string, activity: Omit<Activity, 'id'>) => void;
  onDelete?: (id: string) => void;
}

const ExtracurricularActivities: React.FC<ExtracurricularActivitiesProps> = ({
  activities = [],
  onAdd,
  onEdit,
  onDelete,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Activity, 'id'>>({
    title: '',
    organization: '',
    role: '',
    category: '',
    startDate: '',
    endDate: '',
    isOngoing: false,
    description: '',
    hoursPerWeek: '',
    weeksPerYear: '',
    document: '',
  });

  const categories = [
    'Sports',
    'Arts & Music',
    'Leadership',
    'Community Service',
    'Research',
    'Work Experience',
    'Clubs & Organizations',
    'Academic',
    'Other',
  ];

  const handleSubmit = () => {
    if (editingId) {
      onEdit?.(editingId, formData);
      setEditingId(null);
    } else {
      onAdd?.(formData);
      setIsAdding(false);
    }
    resetForm();
  };

  const handleEdit = (activity: Activity) => {
    setFormData({
      title: activity.title,
      organization: activity.organization,
      role: activity.role,
      category: activity.category,
      startDate: activity.startDate,
      endDate: activity.endDate || '',
      isOngoing: activity.isOngoing,
      description: activity.description,
      hoursPerWeek: activity.hoursPerWeek || '',
      weeksPerYear: activity.weeksPerYear || '',
      document: activity.document || '',
    });
    setEditingId(activity.id);
    setIsAdding(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      organization: '',
      role: '',
      category: '',
      startDate: '',
      endDate: '',
      isOngoing: false,
      description: '',
      hoursPerWeek: '',
      weeksPerYear: '',
      document: '',
    });
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    resetForm();
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-bold text-gray-900">Extracurricular Activities</h2>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-semibold"
          >
            <Plus size={18} />
            Add Activity
          </button>
        )}
      </div>

      {/* Add/Edit Form */}
      {isAdding && (
        <div className="mb-4 p-3 border border-gray-200 rounded-lg bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Activity Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Debate Team"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Organization *
              </label>
              <input
                type="text"
                value={formData.organization}
                onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                placeholder="e.g., School/University Name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Role *
              </label>
              <input
                type="text"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                placeholder="e.g., Team Captain"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
              <input
                type="month"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input
                type="month"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                disabled={formData.isOngoing}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100"
              />
              <label className="flex items-center gap-2 mt-2">
                <input
                  type="checkbox"
                  checked={formData.isOngoing}
                  onChange={(e) =>
                    setFormData({ ...formData, isOngoing: e.target.checked, endDate: '' })
                  }
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-700">Currently ongoing</span>
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hours per Week
              </label>
              <input
                type="text"
                value={formData.hoursPerWeek}
                onChange={(e) => setFormData({ ...formData, hoursPerWeek: e.target.value })}
                placeholder="e.g., 5"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Weeks per Year
              </label>
              <input
                type="text"
                value={formData.weeksPerYear}
                onChange={(e) => setFormData({ ...formData, weeksPerYear: e.target.value })}
                placeholder="e.g., 40"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe your role, achievements, and impact..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            />
          </div>

          {/* Document Upload */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Supporting Document (Certificate, Letter, etc.)
            </label>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                <Upload size={16} />
                Choose File
              </button>
              {formData.document && (
                <span className="text-sm text-gray-600">{formData.document}</span>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-semibold"
            >
              {editingId ? 'Update' : 'Add'} Activity
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-semibold"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Activities List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {activities.length === 0 ? (
          <div className="col-span-2 text-center py-8 text-gray-500">
            <p className="text-sm">No activities added yet</p>
            <p className="text-xs mt-1">Click "Add Activity" to get started</p>
          </div>
        ) : (
          activities.map((activity) => (
            <div
              key={activity.id}
              className="p-4 border border-gray-200 rounded-xl hover:shadow-sm transition-shadow"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-start gap-2 mb-1">
                    <span className="px-2 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded">
                      {activity.category}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{activity.title}</h3>
                  <p className="text-sm text-gray-600">{activity.organization}</p>
                  <p className="text-sm text-gray-700 font-medium mt-1">{activity.role}</p>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleEdit(activity)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    aria-label="Edit"
                  >
                    <Edit2 size={16} className="text-gray-600" />
                  </button>
                  <button
                    onClick={() => onDelete?.(activity.id)}
                    className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                    aria-label="Delete"
                  >
                    <Trash2 size={16} className="text-red-600" />
                  </button>
                </div>
              </div>

              <p className="text-sm text-gray-700 mb-3">{activity.description}</p>

              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <div>
                  <span className="font-medium">Duration:</span>{' '}
                  {activity.startDate} - {activity.isOngoing ? 'Present' : activity.endDate}
                </div>
                {activity.hoursPerWeek && (
                  <div>
                    <span className="font-medium">Time Commitment:</span> {activity.hoursPerWeek}{' '}
                    hrs/week
                    {activity.weeksPerYear && `, ${activity.weeksPerYear} weeks/year`}
                  </div>
                )}
                {activity.document && (
                  <div className="flex items-center gap-1 text-blue-600">
                    <FileText size={14} />
                    <span>Document attached</span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ExtracurricularActivities;
