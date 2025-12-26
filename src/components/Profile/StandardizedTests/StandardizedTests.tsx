import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Upload, FileText } from 'lucide-react';

export interface TestScore {
  id: string;
  testType: string;
  score: string;
  maxScore?: string;
  testDate: string;
  expiryDate?: string;
  breakdown?: { section: string; score: string }[];
  document?: string;
}

interface StandardizedTestsProps {
  tests?: TestScore[];
  onAdd?: (test: Omit<TestScore, 'id'>) => void;
  onEdit?: (id: string, test: Omit<TestScore, 'id'>) => void;
  onDelete?: (id: string) => void;
}

const StandardizedTests: React.FC<StandardizedTestsProps> = ({
  tests = [],
  onAdd,
  onEdit,
  onDelete,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<TestScore, 'id'>>({
    testType: '',
    score: '',
    maxScore: '',
    testDate: '',
    expiryDate: '',
    breakdown: [],
    document: '',
  });

  const testTypes = [
    { value: 'SAT', label: 'SAT', maxScore: '1600' },
    { value: 'ACT', label: 'ACT', maxScore: '36' },
    { value: 'IELTS', label: 'IELTS', maxScore: '9.0' },
    { value: 'TOEFL', label: 'TOEFL', maxScore: '120' },
    { value: 'GRE', label: 'GRE', maxScore: '340' },
    { value: 'GMAT', label: 'GMAT', maxScore: '800' },
    { value: 'PTE', label: 'PTE Academic', maxScore: '90' },
    { value: 'Duolingo', label: 'Duolingo English Test', maxScore: '160' },
  ];

  const handleTestTypeChange = (testType: string) => {
    const selectedTest = testTypes.find((t) => t.value === testType);
    setFormData({
      ...formData,
      testType,
      maxScore: selectedTest?.maxScore || '',
    });
  };

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

  const handleEdit = (test: TestScore) => {
    setFormData({
      testType: test.testType,
      score: test.score,
      maxScore: test.maxScore || '',
      testDate: test.testDate,
      expiryDate: test.expiryDate || '',
      breakdown: test.breakdown || [],
      document: test.document || '',
    });
    setEditingId(test.id);
    setIsAdding(true);
  };

  const resetForm = () => {
    setFormData({
      testType: '',
      score: '',
      maxScore: '',
      testDate: '',
      expiryDate: '',
      breakdown: [],
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
        <h2 className="text-lg font-bold text-gray-900">Standardized Test Scores</h2>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-semibold"
          >
            <Plus size={18} />
            Add Test Score
          </button>
        )}
      </div>

      {/* Add/Edit Form */}
      {isAdding && (
        <div className="mb-4 p-3 border border-gray-200 rounded-lg bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Test Type *</label>
              <select
                value={formData.testType}
                onChange={(e) => handleTestTypeChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Select test type</option>
                {testTypes.map((test) => (
                  <option key={test.value} value={test.value}>
                    {test.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Overall Score *</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.score}
                  onChange={(e) => setFormData({ ...formData, score: e.target.value })}
                  placeholder="e.g., 1450"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                {formData.maxScore && (
                  <>
                    <span className="flex items-center text-gray-600">out of</span>
                    <input
                      type="text"
                      value={formData.maxScore}
                      onChange={(e) => setFormData({ ...formData, maxScore: e.target.value })}
                      className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Test Date *</label>
              <input
                type="date"
                value={formData.testDate}
                onChange={(e) => setFormData({ ...formData, testDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expiry Date (if applicable)
              </label>
              <input
                type="date"
                value={formData.expiryDate}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          {/* Document Upload */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Score Report
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
              {editingId ? 'Update' : 'Add'} Test Score
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

      {/* Test Scores List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tests.length === 0 ? (
          <div className="col-span-2 text-center py-8 text-gray-500">
            <p className="text-sm">No test scores added yet</p>
            <p className="text-xs mt-1">Click "Add Test Score" to get started</p>
          </div>
        ) : (
          tests.map((test) => (
            <div
              key={test.id}
              className="p-4 border border-gray-200 rounded-xl hover:shadow-sm transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{test.testType}</h3>
                  <p className="text-sm text-gray-600">Taken on {test.testDate}</p>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleEdit(test)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    aria-label="Edit"
                  >
                    <Edit2 size={16} className="text-gray-600" />
                  </button>
                  <button
                    onClick={() => onDelete?.(test.id)}
                    className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                    aria-label="Delete"
                  >
                    <Trash2 size={16} className="text-red-600" />
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Overall Score</span>
                  <span className="text-2xl font-bold text-primary-darkest">
                    {test.score}
                    {test.maxScore && <span className="text-base text-gray-500">/{test.maxScore}</span>}
                  </span>
                </div>

                {test.expiryDate && (
                  <div className="text-xs text-gray-500">
                    Valid until: {test.expiryDate}
                  </div>
                )}

                {test.breakdown && test.breakdown.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {test.breakdown.map((section, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span className="text-gray-600">{section.section}:</span>
                        <span className="font-medium text-gray-900">{section.score}</span>
                      </div>
                    ))}
                  </div>
                )}

                {test.document && (
                  <div className="flex items-center gap-1 text-sm text-blue-600 mt-2">
                    <FileText size={14} />
                    <span>Score report attached</span>
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

export default StandardizedTests;
