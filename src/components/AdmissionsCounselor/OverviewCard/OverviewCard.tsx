import React from 'react';
import { GraduationCap, Award, FileText, Plane, User } from 'lucide-react';
import { AdmissionsOverview } from '../../../services/api/types';

interface OverviewCardProps {
  overview: AdmissionsOverview;
}

const OverviewCard: React.FC<OverviewCardProps> = ({ overview }) => {
  const stats = [
    {
      label: 'Universities Found',
      value: overview.universities_found,
      icon: GraduationCap,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      label: 'Scholarships Found',
      value: overview.scholarships_found,
      icon: Award,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      label: 'Application Requirements',
      value: overview.application_requirements,
      icon: FileText,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
    {
      label: 'Visa Information',
      value: overview.visa_info_count,
      icon: Plane,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 md:p-5">
      <div className="flex items-center gap-2 mb-4">
        <User size={20} className="text-primary-dark" />
        <h2 className="text-lg font-bold text-primary-darkest">
          Overview for {overview.profile_name}
        </h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className={`p-3 rounded-xl ${stat.bg} text-center`}
            >
              <Icon size={24} className={`${stat.color} mx-auto mb-2`} />
              <p className="text-2xl font-bold text-primary-darkest">{stat.value}</p>
              <p className="text-xs text-neutral-gray">{stat.label}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OverviewCard;
