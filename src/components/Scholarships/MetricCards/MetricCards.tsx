import React from 'react';
import { Award, CheckCircle, DollarSign, TrendingUp } from 'lucide-react';

interface MetricCardData {
  label: string;
  value: string | number;
  icon: React.ReactNode;
}

interface MetricCardsProps {
  availableScholarships?: number;
  myApplications?: number;
  appliedFunding?: string;
  potentialFunding?: string;
}

const MetricCards: React.FC<MetricCardsProps> = ({
  availableScholarships = 6,
  myApplications = 2,
  appliedFunding = '$33K',
  potentialFunding = '$76K',
}) => {
  const metrics: MetricCardData[] = [
    {
      label: 'Available Scholarships',
      value: availableScholarships,
      icon: <Award size={24} className="text-primary-darkest" />,
    },
    {
      label: 'My Applications',
      value: myApplications,
      icon: <CheckCircle size={24} className="text-primary-darkest" />,
    },
    {
      label: 'Applied Funding',
      value: appliedFunding,
      icon: <DollarSign size={24} className="text-primary-darkest" />,
    },
    {
      label: 'Potential Funding',
      value: potentialFunding,
      icon: <TrendingUp size={24} className="text-primary-darkest" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {metrics.map((metric, index) => (
        <div
          key={index}
          className="bg-white rounded-xl border border-gray-200 p-6 flex items-center justify-between hover:shadow-md transition-shadow"
        >
          <div className="flex-1 min-w-0">
            <p className="text-sm text-neutral-gray mb-2">{metric.label}</p>
            <p className="text-3xl font-bold text-primary-darkest">{metric.value}</p>
          </div>
          <div className="flex-shrink-0 ml-4">
            {metric.icon}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MetricCards;
