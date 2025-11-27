import React, { useState, useEffect } from 'react';
import { X, ListTodo, Calendar, Clock, AlertTriangle, CheckCircle2, Loader, RefreshCw } from 'lucide-react';
import { admissionsCounselorService } from '../../../services/api';
import { AdmissionsNextStep } from '../../../services/api/types';
import { ErrorHandler } from '../../../utils/errorHandler';

interface NextStepsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: number;
}

const NextStepsModal: React.FC<NextStepsModalProps> = ({ isOpen, onClose, userId }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nextSteps, setNextSteps] = useState<AdmissionsNextStep[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const fetchNextSteps = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await admissionsCounselorService.getNextSteps(userId);
      setNextSteps(response.next_steps || []);
      setTotalCount(response.total_count || 0);
      setLastUpdated(response.last_updated || new Date().toISOString());
    } catch (err) {
      ErrorHandler.log(err, 'NextStepsModal - Fetch');
      setError('Failed to load next steps. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchNextSteps();
    }
  }, [isOpen, userId]);

  const getPriorityStyles = (priority: string) => {
    const normalizedPriority = priority.toLowerCase();
    switch (normalizedPriority) {
      case 'high':
        return { bg: 'bg-red-50', border: 'border-red-200', badge: 'bg-red-100 text-red-700' };
      case 'medium':
        return { bg: 'bg-yellow-50', border: 'border-yellow-200', badge: 'bg-yellow-100 text-yellow-700' };
      default:
        return { bg: 'bg-green-50', border: 'border-green-200', badge: 'bg-green-100 text-green-700' };
    }
  };

  const formatDeadline = (deadline?: string) => {
    if (!deadline) return null;
    const date = new Date(deadline);
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { text: 'Overdue', urgent: true };
    if (diffDays === 0) return { text: 'Today', urgent: true };
    if (diffDays === 1) return { text: 'Tomorrow', urgent: true };
    if (diffDays <= 7) return { text: `${diffDays} days left`, urgent: true };
    return { text: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), urgent: false };
  };

  const getDeadline = (step: AdmissionsNextStep) => step.deadline || step.due_date;
  const getAgent = (step: AdmissionsNextStep) => step.agent || step.related_agent;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <ListTodo size={20} className="text-primary-dark" />
            <h2 className="text-lg font-bold text-primary-darkest">All Next Steps</h2>
            <span className="px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
              {totalCount} tasks
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchNextSteps}
              disabled={loading}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              title="Refresh"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto max-h-[60vh]">
          {loading && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader className="w-8 h-8 animate-spin text-primary" />
              <p className="mt-2 text-sm text-gray-500">Loading next steps...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-8">
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={fetchNextSteps}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          {!loading && !error && nextSteps.length === 0 && (
            <div className="text-center py-12">
              <CheckCircle2 size={48} className="text-green-500 mx-auto mb-3" />
              <p className="text-lg font-medium text-primary-darkest">All caught up!</p>
              <p className="text-sm text-neutral-gray">No pending tasks at the moment.</p>
            </div>
          )}

          {!loading && !error && nextSteps.length > 0 && (
            <div className="space-y-3">
              {nextSteps.map((step, index) => {
                const styles = getPriorityStyles(step.priority);
                const deadline = formatDeadline(getDeadline(step));
                const agent = getAgent(step);

                return (
                  <div
                    key={index}
                    className={`p-4 rounded-xl border ${styles.bg} ${styles.border}`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${styles.badge}`}>
                            {step.priority.toUpperCase()}
                          </span>
                          {step.category && (
                            <span className="px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                              {step.category}
                            </span>
                          )}
                        </div>
                        <p className="text-sm font-semibold text-primary-darkest">{step.action}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs mb-2">
                      {deadline && (
                        <div className={`flex items-center gap-1 ${deadline.urgent ? 'text-red-600' : 'text-neutral-gray'}`}>
                          {deadline.urgent ? <AlertTriangle size={12} /> : <Calendar size={12} />}
                          <span>{deadline.text}</span>
                        </div>
                      )}

                      {step.estimated_time && (
                        <div className="flex items-center gap-1 text-neutral-gray">
                          <Clock size={12} />
                          <span>{step.estimated_time}</span>
                        </div>
                      )}

                      {agent && (
                        <span className="text-primary-dark font-medium">
                          via {agent}
                        </span>
                      )}
                    </div>

                    {step.reasoning && (
                      <div className="mt-2 pt-2 border-t border-gray-200">
                        <p className="text-xs text-neutral-gray italic">{step.reasoning}</p>
                      </div>
                    )}

                    {step.dependencies && step.dependencies.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-gray-200">
                        <p className="text-xs text-neutral-gray">
                          <span className="font-medium">Dependencies:</span> {step.dependencies.join(', ')}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {lastUpdated && !loading && (
          <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
            <p className="text-xs text-neutral-gray text-center">
              Last updated: {new Date(lastUpdated).toLocaleString()}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NextStepsModal;
