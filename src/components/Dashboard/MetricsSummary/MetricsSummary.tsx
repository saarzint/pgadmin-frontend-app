import React from 'react';
import { BookOpen, DollarSign, FileText, User } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  bgColor: string;
}

interface MetricsSummaryProps {
  savedUniversities?: number;
  scholarships?: number;
  applications?: number;
  profileComplete?: number;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon, bgColor }) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-neutral-gray text-sm md:text-base mb-2">{title}</p>
          <h3 className="text-3xl md:text-4xl font-bold text-primary-darkest">{value}</h3>
        </div>
        <div
          className={`w-20 h-20 rounded-2xl flex items-center justify-center flex-shrink-0 ${bgColor}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};

const MetricsSummary: React.FC<MetricsSummaryProps> = ({
  savedUniversities = 12,
  scholarships = 8,
  applications = 5,
  profileComplete = 75,
}) => {
  const metrics: MetricCardProps[] = [
    {
      title: 'Saved Universities',
      value: savedUniversities,
      icon: <BookOpen size={28} className="text-primary-darkest" />,
      bgColor: 'bg-gradient-cyan bg-opacity-20',
    },
    {
      title: 'Scholarships',
      value: scholarships,
      icon: <DollarSign size={28} className="text-primary-darkest" />,
      bgColor: 'bg-secondary bg-opacity-10',
    },
    {
      title: 'Applications',
      value: applications,
      icon: <FileText size={28} className="text-primary-darkest" />,
      bgColor: 'bg-primary-light bg-opacity-30',
    },
    {
      title: 'Profile Complete',
      value: `${profileComplete}%`,
      icon: <User size={28} className="text-primary-darkest" />,
      bgColor: 'bg-purple-100',
    },
  ];

  return (
    <div className="w-full h-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 h-full">
        {metrics.map((metric, index) => (
          <MetricCard
            key={index}
            title={metric.title}
            value={metric.value}
            icon={metric.icon}
            bgColor={metric.bgColor}
          />
        ))}
      </div>
    </div>
  );
};

export default MetricsSummary;
