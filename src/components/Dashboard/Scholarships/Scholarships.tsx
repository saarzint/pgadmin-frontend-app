import React from 'react';
import { DollarSign, Award } from 'lucide-react';
import DashboardCard, { DashboardCardItem } from '../DashboardCard/DashboardCard';

interface Scholarship {
  id: string;
  name: string;
  provider: string;
  amount: string;
  deadline: string;
  eligibility: string[];
  matchScore: number;
  isApplied?: boolean;
}

interface ScholarshipsProps {
  scholarships?: Scholarship[];
  onApplyScholarship?: (id: string) => void;
  onViewAll?: () => void;
}

const Scholarships: React.FC<ScholarshipsProps> = ({
  scholarships = [
    {
      id: '1',
      name: 'Merit-Based Scholarship',
      provider: 'Stanford University',
      amount: '$25,000',
      deadline: '2024-12-01',
      eligibility: ['GPA > 3.5', 'International Students'],
      matchScore: 92,
      isApplied: false,
    },
    {
      id: '2',
      name: 'Graduate Research Fellowship',
      provider: 'National Science Foundation',
      amount: '$34,000/year',
      deadline: '2024-11-15',
      eligibility: ['STEM Fields', 'US Citizens/Permanent Residents'],
      matchScore: 88,
      isApplied: true,
    },
    {
      id: '3',
      name: 'International Excellence Award',
      provider: 'MIT',
      amount: '$30,000',
      deadline: '2024-12-20',
      eligibility: ['International Students', 'Academic Excellence'],
      matchScore: 85,
      isApplied: false,
    },
  ],
  onApplyScholarship,
  onViewAll,
}) => {
  const items: DashboardCardItem[] = scholarships.map((scholarship) => ({
    id: scholarship.id,
    icon: <DollarSign size={20} className="text-secondary-main" />,
    heading: scholarship.name,
    subheading: `${scholarship.provider} • ${scholarship.amount}`,
    chip: scholarship.isApplied
      ? {
          label: 'Applied',
          className: 'bg-green-100 text-green-700',
        }
      : {
          label: `${scholarship.matchScore}% Match`,
          className: 'bg-secondary bg-opacity-20 text-primary-darkest',
        },
    onClick: () => !scholarship.isApplied && onApplyScholarship?.(scholarship.id),
  }));

  return (
    <DashboardCard
      title="Scholarships"
      items={items}
      buttonText="View All Scholarships"
      onButtonClick={onViewAll}
      emptyState={{
        icon: <DollarSign size={48} className="text-neutral-gray" />,
        title: 'No scholarships found',
        description: 'Complete your profile to discover funding opportunities',
      }}
    />
  );
};

export default Scholarships;
