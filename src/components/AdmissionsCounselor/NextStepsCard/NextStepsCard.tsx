import React from 'react';
import { ListTodo, Calendar, Clock, ArrowRight, AlertTriangle, CheckCircle2, ExternalLink } from 'lucide-react';
import { AdmissionsNextStep } from '../../../services/api/types';

interface NextStepsCardProps {
  nextSteps: AdmissionsNextStep[];
  onViewAll?: () => void;
}

const NextStepsCard: React.FC<NextStepsCardProps> = ({ nextSteps, onViewAll }) => {
  const getPriorityStyles = (priority: string) => {
    const normalizedPriority = priority.toLowerCase();
    switch (normalizedPriority) {
      case 'high':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          text: 'text-red-700',
          badge: 'bg-red-100 text-red-700',
        };
      case 'medium':
        return {
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
          text: 'text-yellow-700',
          badge: 'bg-yellow-100 text-yellow-700',
        };
      case 'low':
      default:
        return {
          bg: 'bg-green-50',
          border: 'border-green-200',
          text: 'text-green-700',
          badge: 'bg-green-100 text-green-700',
        };
    }
  };

  const formatDeadline = (deadline?: string) => {
    if (!deadline) return null;
    const date = new Date(deadline);
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { text: 'Overdue', urgent: true };
    } else if (diffDays === 0) {
      return { text: 'Today', urgent: true };
    } else if (diffDays === 1) {
      return { text: 'Tomorrow', urgent: true };
    } else if (diffDays <= 7) {
      return { text: `${diffDays} days left`, urgent: true };
    } else {
      return { text: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), urgent: false };
    }
  };

  // Get the deadline from either field
  const getDeadline = (step: AdmissionsNextStep) => step.deadline || step.due_date;

  // Get the agent from either field
  const getAgent = (step: AdmissionsNextStep) => step.agent || step.related_agent;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 md:p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ListTodo size={20} className="text-primary-dark" />
          <h2 className="text-lg font-bold text-primary-darkest">Next Steps</h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-neutral-gray bg-gray-100 px-2 py-1 rounded-full">
            {nextSteps.length} tasks
          </span>
          {onViewAll && nextSteps.length > 0 && (
            <button
              onClick={onViewAll}
              className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-primary-dark hover:text-primary hover:bg-primary-lightest rounded-lg transition-colors"
            >
              <ExternalLink size={12} />
              View All
            </button>
          )}
        </div>
      </div>

      {nextSteps.length === 0 ? (
        <div className="text-center py-6">
          <CheckCircle2 size={32} className="text-green-500 mx-auto mb-2" />
          <p className="text-sm text-neutral-gray">All caught up! No pending tasks.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {nextSteps.map((step, index) => {
            const styles = getPriorityStyles(step.priority);
            const deadline = formatDeadline(getDeadline(step));
            const agent = getAgent(step);

            return (
              <div
                key={index}
                className={`p-3 rounded-lg border ${styles.bg} ${styles.border}`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${styles.badge}`}>
                        {step.priority.toUpperCase()}
                      </span>
                      {step.category && (
                        <span className="px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                          {step.category}
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-medium text-primary-darkest">{step.action}</p>
                  </div>
                  <ArrowRight size={16} className="text-neutral-gray flex-shrink-0 mt-1" />
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs">
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
                    <span className="text-primary-dark">
                      via {agent}
                    </span>
                  )}
                </div>

                {step.reasoning && (
                  <div className="mt-2 pt-2 border-t border-gray-200">
                    <p className="text-xs text-neutral-gray italic">
                      {step.reasoning}
                    </p>
                  </div>
                )}

                {step.dependencies && step.dependencies.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-gray-200">
                    <p className="text-xs text-neutral-gray">
                      Dependencies: {step.dependencies.join(', ')}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default NextStepsCard;
