import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Upload, FileText, Award } from 'lucide-react';

export interface AwardHonor {
  id: string;
  title: string;
  issuer: string;
  category: string;
  level: string;
  dateReceived: string;
  description: string;
  document?: string;
}

interface AwardsHonorsProps {
  awards?: AwardHonor[];
  onAdd?: (award: Omit<AwardHonor, 'id'>) => void;
  onEdit?: (id: string, award: Omit<AwardHonor, 'id'>) => void;
  onDelete?: (id: string) => void;
}

const AwardsHonors: React.FC<AwardsHonorsProps> = ({
  awards = [],
  onAdd,
  onEdit,
  onDelete,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<AwardHonor, 'id'>>({
    title: '',
    issuer: '',
    category: '',
    level: '',
    dateReceived: '',
    description: '',
    document: '',
  });

  const categories = [
    'Academic',
    'Athletic',
    'Artistic',
    'Leadership',
    'Community Service',
    'Research',
    'Competition',
    'Scholarship',
    'Other',
  ];

  const levels = [
    'School',
    'District',
    'State/Provincial',
    'National',
    'International',
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

  const handleEdit = (award: AwardHonor) => {
    setFormData({
      title: award.title,
      issuer: award.issuer,
      category: award.category,
      level: award.level,
      dateReceived: award.dateReceived,
      description: award.description,
      document: award.document || '',
    });
    setEditingId(award.id);
    setIsAdding(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      issuer: '',
      category: '',
      level: '',
      dateReceived: '',
      description: '',
      document: '',
    });
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    resetForm();
  };

  const getLevelColor = (level: string) => {
    const colors: { [key: string]: string } = {
      School: 'bg-blue-50 text-blue-700',
      District: 'bg-green-50 text-green-700',
      'State/Provincial': 'bg-yellow-50 text-yellow-700',
      National: 'bg-purple-50 text-purple-700',
      International: 'bg-red-50 text-red-700',
    };
    return colors[level] || 'bg-gray-50 text-gray-700';
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-primary-darkest">Awards & Honors</h2>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-semibold"
          >
            <Plus size={18} />
            Add Award
          </button>
        )}
      </div>

      {/* Add/Edit Form */}
      {isAdding && (
        <div className="mb-6 p-4 border border-gray-200 rounded-xl bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Award/Honor Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., First Place Science Fair"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Issuing Organization *
              </label>
              <input
                type="text"
                value={formData.issuer}
                onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                placeholder="e.g., National Science Foundation"
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Recognition Level *
              </label>
              <select
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Select level</option>
                {levels.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date Received *
              </label>
              <input
                type="month"
                value={formData.dateReceived}
                onChange={(e) => setFormData({ ...formData, dateReceived: e.target.value })}
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
              placeholder="Describe the award, competition, or recognition..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            />
          </div>

          {/* Document Upload */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Certificate or Supporting Document
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
              {editingId ? 'Update' : 'Add'} Award
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

      {/* Awards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {awards.length === 0 ? (
          <div className="col-span-2 text-center py-8 text-gray-500">
            <p className="text-sm">No awards or honors added yet</p>
            <p className="text-xs mt-1">Click "Add Award" to get started</p>
          </div>
        ) : (
          awards.map((award) => (
            <div
              key={award.id}
              className="p-4 border border-gray-200 rounded-xl hover:shadow-sm transition-shadow"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <Award size={24} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                      {award.title}
                    </h3>
                    <div className="flex gap-1 flex-shrink-0">
                      <button
                        onClick={() => handleEdit(award)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        aria-label="Edit"
                      >
                        <Edit2 size={16} className="text-gray-600" />
                      </button>
                      <button
                        onClick={() => onDelete?.(award.id)}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                        aria-label="Delete"
                      >
                        <Trash2 size={16} className="text-red-600" />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{award.issuer}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-3">
                <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded">
                  {award.category}
                </span>
                <span className={`px-2 py-1 text-xs font-medium rounded ${getLevelColor(award.level)}`}>
                  {award.level}
                </span>
              </div>

              <p className="text-sm text-gray-700 mb-3 line-clamp-2">{award.description}</p>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Received: {award.dateReceived}</span>
                {award.document && (
                  <div className="flex items-center gap-1 text-blue-600">
                    <FileText size={14} />
                    <span>Certificate</span>
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

export default AwardsHonors;
