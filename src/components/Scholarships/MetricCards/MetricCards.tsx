import React from 'react';
import { Award, CheckCircle, Rocket, TrendingUp } from 'lucide-react';

interface MetricCardData {
  label: string;
  value: string | number;
  icon: React.ReactNode;
}

interface MetricCardsProps {
  availableScholarships?: number;
  myApplications?: number;
  potentialFunding?: string;
  onActivateAutoApply?: () => void;
}

const MetricCards: React.FC<MetricCardsProps> = ({
  availableScholarships = 6,
  myApplications = 2,
  potentialFunding = '$76K',
  onActivateAutoApply,
}) => {
  const metrics: MetricCardData[] = [
    {
      label: 'Available Scholarships',
      value: availableScholarships,
      icon: <Award size={20} className="text-primary-darkest" />,
    },
    {
      label: 'My Applications',
      value: myApplications,
      icon: <CheckCircle size={20} className="text-primary-darkest" />,
    },
    {
      label: 'Potential Funding',
      value: potentialFunding,
      icon: <TrendingUp size={20} className="text-primary-darkest" />,
    },
  ];

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
        {metrics.map((metric, index) => (
          <div
            key={index}
            className="bg-white rounded-lg border border-gray-200 p-4 flex items-center justify-between hover:shadow-md transition-shadow"
          >
            <div className="flex-1 min-w-0">
              <p className="text-xs text-neutral-gray mb-0.5">{metric.label}</p>
              <p className="text-xl font-bold text-primary-darkest">{metric.value}</p>
            </div>
            <div className="flex-shrink-0 ml-2">
              {metric.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Scholarships While You Sleep Card - Standalone */}
      <div className="mb-4">
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-3 md:p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 md:gap-0 hover:shadow-lg transition-all w-full">
          <div className="flex items-center gap-2 md:gap-3 flex-1">
            <Rocket size={24} className="text-blue-400 flex-shrink-0 md:w-7 md:h-7" />
            <div>
              <h3 className="text-white font-bold text-base md:text-lg leading-tight">
                Scholarships while you sleep
              </h3>
              <p className="text-gray-300 text-xs md:text-sm mt-0.5">
                Unlock effortless funding. Our AI finds & applies for you, even offline.
              </p>
            </div>
          </div>
          <button
            onClick={onActivateAutoApply}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 md:py-2.5 px-3 md:px-4 rounded-lg transition-colors shadow-md whitespace-nowrap w-full md:w-auto text-sm"
          >
            Activate Free Trial
          </button>
        </div>
      </div>
    </>
  );
};

export default MetricCards;
