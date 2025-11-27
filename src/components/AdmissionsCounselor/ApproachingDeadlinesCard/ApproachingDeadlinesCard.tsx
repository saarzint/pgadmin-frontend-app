import React from 'react';
import { Clock, AlertTriangle, GraduationCap, Award, FileText, Calendar } from 'lucide-react';
import { AdmissionsApproachingDeadline } from '../../../services/api/types';

interface ApproachingDeadlinesCardProps {
  deadlines: AdmissionsApproachingDeadline[];
}

const ApproachingDeadlinesCard: React.FC<ApproachingDeadlinesCardProps> = ({ deadlines }) => {
  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'scholarship':
        return Award;
      case 'university':
      case 'application':
        return GraduationCap;
      case 'document':
        return FileText;
      default:
        return Calendar;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'scholarship':
        return { bg: 'bg-green-50', border: 'border-green-100', text: 'text-green-700', icon: 'text-green-600' };
      case 'university':
      case 'application':
        return { bg: 'bg-blue-50', border: 'border-blue-100', text: 'text-blue-700', icon: 'text-blue-600' };
      case 'document':
        return { bg: 'bg-purple-50', border: 'border-purple-100', text: 'text-purple-700', icon: 'text-purple-600' };
      default:
        return { bg: 'bg-gray-50', border: 'border-gray-100', text: 'text-gray-700', icon: 'text-gray-600' };
    }
  };

  const getUrgencyStyle = (daysLeft: number) => {
    if (daysLeft <= 3) return { badge: 'bg-red-100 text-red-700', urgent: true };
    if (daysLeft <= 7) return { badge: 'bg-orange-100 text-orange-700', urgent: true };
    if (daysLeft <= 14) return { badge: 'bg-yellow-100 text-yellow-700', urgent: false };
    return { badge: 'bg-gray-100 text-gray-600', urgent: false };
  };

  const formatDeadline = (deadline: string) => {
    return new Date(deadline).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Sort by days left (most urgent first)
  const sortedDeadlines = [...deadlines].sort((a, b) => a.days_left - b.days_left);

  // Group deadlines: urgent (<=7 days) and upcoming
  const urgentDeadlines = sortedDeadlines.filter(d => d.days_left <= 7);
  const upcomingDeadlines = sortedDeadlines.filter(d => d.days_left > 7);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 md:p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock size={20} className="text-primary-dark" />
          <h2 className="text-lg font-bold text-primary-darkest">Approaching Deadlines</h2>
        </div>
        <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
          {deadlines.length} total
        </span>
      </div>

      {deadlines.length === 0 ? (
        <div className="text-center py-6">
          <Calendar size={32} className="text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-neutral-gray">No upcoming deadlines.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Urgent Deadlines */}
          {urgentDeadlines.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle size={14} className="text-red-500" />
                <p className="text-xs font-semibold text-red-600 uppercase tracking-wide">
                  Urgent ({urgentDeadlines.length})
                </p>
              </div>
              <div className="space-y-2">
                {urgentDeadlines.map((deadline, index) => {
                  const Icon = getTypeIcon(deadline.type);
                  const colors = getTypeColor(deadline.type);
                  const urgency = getUrgencyStyle(deadline.days_left);

                  return (
                    <div
                      key={index}
                      className={`flex items-center gap-3 p-3 rounded-lg ${colors.bg} border ${colors.border}`}
                    >
                      <div className="p-2 bg-white rounded-lg">
                        <Icon size={16} className={colors.icon} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-primary-darkest truncate">
                          {deadline.name}
                        </p>
                        <p className="text-xs text-neutral-gray">
                          {formatDeadline(deadline.deadline)}
                        </p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-bold rounded-full whitespace-nowrap ${urgency.badge}`}>
                        {deadline.days_left === 0 ? 'Today' : deadline.days_left === 1 ? '1 day' : `${deadline.days_left} days`}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Upcoming Deadlines */}
          {upcomingDeadlines.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Upcoming ({upcomingDeadlines.length})
              </p>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {upcomingDeadlines.slice(0, 5).map((deadline, index) => {
                  const Icon = getTypeIcon(deadline.type);
                  const urgency = getUrgencyStyle(deadline.days_left);

                  return (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-2 rounded-lg bg-gray-50 border border-gray-100"
                    >
                      <Icon size={14} className="text-gray-500" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-primary-darkest truncate">{deadline.name}</p>
                      </div>
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${urgency.badge}`}>
                        {deadline.days_left} days
                      </span>
                    </div>
                  );
                })}
                {upcomingDeadlines.length > 5 && (
                  <p className="text-xs text-center text-neutral-gray py-1">
                    +{upcomingDeadlines.length - 5} more deadlines
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ApproachingDeadlinesCard;
