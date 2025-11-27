import React, { useState } from 'react';
import { X, Settings, Loader, CheckCircle, AlertCircle } from 'lucide-react';
import { admissionsCounselorService } from '../../../services/api';
import { AdmissionsUpdateStageRequest } from '../../../services/api/types';
import { ErrorHandler } from '../../../utils/errorHandler';

interface UpdateStageModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: number;
  currentStage: string;
  currentScore: number;
  onUpdate: () => void;
}

const STAGE_OPTIONS = [
  'Not Started',
  'Profile Building',
  'Research & Discovery',
  'University Shortlisting',
  'Application Preparation',
  'Document Collection',
  'Essays & SOPs',
  'Application Submission',
  'Interview Preparation',
  'Awaiting Decisions',
  'Visa Processing',
  'Pre-Departure',
  'Completed',
];

const UpdateStageModal: React.FC<UpdateStageModalProps> = ({
  isOpen,
  onClose,
  userId,
  currentStage,
  currentScore,
  onUpdate,
}) => {
  const [stage, setStage] = useState(currentStage);
  const [progressScore, setProgressScore] = useState(currentScore);
  const [incompleteProfile, setIncompleteProfile] = useState(false);
  const [approachingDeadlines, setApproachingDeadlines] = useState(false);
  const [agentConflicts, setAgentConflicts] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const request: AdmissionsUpdateStageRequest = {
        user_id: userId,
        current_stage: stage,
        progress_score: progressScore,
        stress_flags: {
          incomplete_profile: incompleteProfile,
          approaching_deadlines: approachingDeadlines,
          agent_conflicts: agentConflicts,
        },
      };

      await admissionsCounselorService.updateStage(request);
      setSuccess(true);
      setTimeout(() => {
        onUpdate();
        onClose();
      }, 1500);
    } catch (err) {
      ErrorHandler.log(err, 'UpdateStageModal - Submit');
      setError('Failed to update stage. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStage(currentStage);
    setProgressScore(currentScore);
    setIncompleteProfile(false);
    setApproachingDeadlines(false);
    setAgentConflicts(false);
    setError(null);
    setSuccess(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={handleClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Settings size={20} className="text-primary-dark" />
            <h2 className="text-lg font-bold text-primary-darkest">Update Admissions Stage</h2>
          </div>
          <button
            onClick={handleClose}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Stage Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Current Stage
            </label>
            <select
              value={stage}
              onChange={(e) => setStage(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm"
              disabled={loading}
            >
              {STAGE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          {/* Progress Score */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Progress Score: {progressScore}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={progressScore}
              onChange={(e) => setProgressScore(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
              disabled={loading}
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Stress Flags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Stress Flags
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={incompleteProfile}
                  onChange={(e) => setIncompleteProfile(e.target.checked)}
                  className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                  disabled={loading}
                />
                <span className="text-sm text-gray-700">Incomplete Profile</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={approachingDeadlines}
                  onChange={(e) => setApproachingDeadlines(e.target.checked)}
                  className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                  disabled={loading}
                />
                <span className="text-sm text-gray-700">Approaching Deadlines</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agentConflicts}
                  onChange={(e) => setAgentConflicts(e.target.checked)}
                  className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                  disabled={loading}
                />
                <span className="text-sm text-gray-700">Agent Conflicts</span>
              </label>
            </div>
          </div>

          {/* Success Message */}
          {success && (
            <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle size={18} className="text-green-600" />
              <p className="text-sm text-green-700">Stage updated successfully!</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle size={18} className="text-red-600" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
              disabled={loading || success}
            >
              {loading ? (
                <>
                  <Loader size={16} className="animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Stage'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateStageModal;
