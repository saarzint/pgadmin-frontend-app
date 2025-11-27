import React from 'react';
import { AlertTriangle, UserX, Calendar, Users, FileX, CheckCircle } from 'lucide-react';
import { AdmissionsStressFlags } from '../../../services/api/types';

interface StressFlagsCardProps {
  stressFlags: AdmissionsStressFlags;
  deadlinesCount?: number;
}

const StressFlagsCard: React.FC<StressFlagsCardProps> = ({ stressFlags, deadlinesCount = 0 }) => {
  const flags = [
    {
      key: 'incomplete_profile',
      label: 'Incomplete Profile',
      value: stressFlags.incomplete_profile,
      icon: UserX,
      description: 'Your profile has missing information',
    },
    {
      key: 'approaching_deadlines',
      label: 'Approaching Deadlines',
      value: stressFlags.approaching_deadlines,
      icon: Calendar,
      description: deadlinesCount > 0
        ? `${deadlinesCount} deadline${deadlinesCount !== 1 ? 's' : ''} approaching`
        : 'Deadlines are approaching soon',
    },
    {
      key: 'agent_conflicts',
      label: 'Agent Conflicts',
      value: stressFlags.agent_conflicts,
      icon: Users,
      description: 'Conflicting recommendations from agents',
    },
    {
      key: 'missing_documents',
      label: 'Missing Documents',
      value: stressFlags.missing_documents,
      icon: FileX,
      description: `${stressFlags.missing_documents || 0} document${(stressFlags.missing_documents || 0) !== 1 ? 's' : ''} needed`,
    },
  ];

  const activeFlags = flags.filter(flag =>
    typeof flag.value === 'boolean' ? flag.value : (flag.value ?? 0) > 0
  );

  const hasIssues = activeFlags.length > 0;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 md:p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <AlertTriangle size={20} className={hasIssues ? 'text-yellow-500' : 'text-green-500'} />
          <h2 className="text-lg font-bold text-primary-darkest">Attention Required</h2>
        </div>
        {hasIssues ? (
          <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-700 rounded-full">
            {activeFlags.length} issue{activeFlags.length !== 1 ? 's' : ''}
          </span>
        ) : (
          <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
            All clear
          </span>
        )}
      </div>

      {!hasIssues ? (
        <div className="text-center py-4">
          <CheckCircle size={32} className="text-green-500 mx-auto mb-2" />
          <p className="text-sm text-neutral-gray">No issues detected. Keep up the good work!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {flags.map((flag) => {
            const Icon = flag.icon;
            const isActive = typeof flag.value === 'boolean' ? flag.value : (flag.value ?? 0) > 0;

            return (
              <div
                key={flag.key}
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  isActive ? 'bg-red-50 border border-red-100' : 'bg-gray-50 border border-gray-100'
                }`}
              >
                <div className={`p-2 rounded-lg ${isActive ? 'bg-red-100' : 'bg-gray-200'}`}>
                  <Icon size={16} className={isActive ? 'text-red-600' : 'text-gray-400'} />
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-medium ${isActive ? 'text-red-800' : 'text-gray-400'}`}>
                    {flag.label}
                  </p>
                  <p className={`text-xs ${isActive ? 'text-red-600' : 'text-gray-400'}`}>
                    {isActive ? flag.description : 'No issues'}
                  </p>
                </div>
                {isActive && typeof flag.value === 'number' && flag.value > 0 && (
                  <span className="px-2 py-1 text-xs font-bold bg-red-100 text-red-700 rounded-full">
                    {flag.value}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default StressFlagsCard;
