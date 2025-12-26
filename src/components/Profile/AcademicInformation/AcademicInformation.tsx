import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Upload, FileText } from 'lucide-react';

export interface AcademicRecord {
  id: string;
  degree: string;
  institution: string;
  gpa: string;
  maxGpa: string;
  startDate: string;
  endDate: string;
  grades?: string;
  document?: string;
}

interface AcademicInformationProps {
  records?: AcademicRecord[];
  onAdd?: (record: Omit<AcademicRecord, 'id'>) => void;
  onEdit?: (id: string, record: Omit<AcademicRecord, 'id'>) => void;
  onDelete?: (id: string) => void;
}

const AcademicInformation: React.FC<AcademicInformationProps> = ({
  records = [],
  onAdd,
  onEdit,
  onDelete,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<AcademicRecord, 'id'>>({
    degree: '',
    institution: '',
    gpa: '',
    maxGpa: '4.0',
    startDate: '',
    endDate: '',
    grades: '',
    document: '',
  });

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

  const handleEdit = (record: AcademicRecord) => {
    setFormData({
      degree: record.degree,
      institution: record.institution,
      gpa: record.gpa,
      maxGpa: record.maxGpa,
      startDate: record.startDate,
      endDate: record.endDate,
      grades: record.grades || '',
      document: record.document || '',
    });
    setEditingId(record.id);
    setIsAdding(true);
  };

  const resetForm = () => {
    setFormData({
      degree: '',
      institution: '',
      gpa: '',
      maxGpa: '4.0',
      startDate: '',
      endDate: '',
      grades: '',
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
        <h2 className="text-lg font-bold text-gray-900">Academic Information</h2>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-semibold"
          >
            <Plus size={18} />
            Add Record
          </button>
        )}
      </div>

      {/* Add/Edit Form */}
      {isAdding && (
        <div className="mb-4 p-3 border border-gray-200 rounded-lg bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Degree/Program *
              </label>
              <input
                type="text"
                value={formData.degree}
                onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                placeholder="e.g., Bachelor of Science"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Institution *
              </label>
              <input
                type="text"
                value={formData.institution}
                onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                placeholder="e.g., University of ABC"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">GPA *</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.gpa}
                  onChange={(e) => setFormData({ ...formData, gpa: e.target.value })}
                  placeholder="3.8"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <span className="flex items-center text-gray-600">out of</span>
                <input
                  type="text"
                  value={formData.maxGpa}
                  onChange={(e) => setFormData({ ...formData, maxGpa: e.target.value })}
                  placeholder="4.0"
                  className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Grades/Percentage
              </label>
              <input
                type="text"
                value={formData.grades}
                onChange={(e) => setFormData({ ...formData, grades: e.target.value })}
                placeholder="e.g., 95%"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date (or Expected)
              </label>
              <input
                type="month"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          {/* Document Upload */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Document (Transcript, Certificate)
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
              {editingId ? 'Update' : 'Add'} Record
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

      {/* Records List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {records.length === 0 ? (
          <div className="col-span-2 text-center py-8 text-gray-500">
            <p className="text-sm">No academic records added yet</p>
            <p className="text-xs mt-1">Click "Add Record" to get started</p>
          </div>
        ) : (
          records.map((record) => (
            <div
              key={record.id}
              className="p-4 border border-gray-200 rounded-xl hover:shadow-sm transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-start gap-3 mb-2">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{record.degree}</h3>
                      <p className="text-sm text-gray-600">{record.institution}</p>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleEdit(record)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        aria-label="Edit"
                      >
                        <Edit2 size={16} className="text-gray-600" />
                      </button>
                      <button
                        onClick={() => onDelete?.(record.id)}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                        aria-label="Delete"
                      >
                        <Trash2 size={16} className="text-red-600" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <div>
                      <span className="text-gray-500">GPA:</span>
                      <span className="ml-1 font-medium text-gray-900">
                        {record.gpa}/{record.maxGpa}
                      </span>
                    </div>
                    {record.grades && (
                      <div>
                        <span className="text-gray-500">Grades:</span>
                        <span className="ml-1 font-medium text-gray-900">{record.grades}</span>
                      </div>
                    )}
                    <div>
                      <span className="text-gray-500">Duration:</span>
                      <span className="ml-1 font-medium text-gray-900">
                        {record.startDate} - {record.endDate || 'Present'}
                      </span>
                    </div>
                    {record.document && (
                      <div className="flex items-center gap-1 text-blue-600">
                        <FileText size={14} />
                        <span>Document attached</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AcademicInformation;
