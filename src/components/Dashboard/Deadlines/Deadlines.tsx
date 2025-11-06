import React from 'react';
import { Calendar } from 'lucide-react';
import DashboardCard, { DashboardCardItem } from '../DashboardCard/DashboardCard';

interface Deadline {
  id: string;
  title: string;
  university: string;
  date: string;
  type: 'application' | 'document' | 'interview' | 'decision';
  priority: 'high' | 'medium' | 'low';
  daysLeft: number;
}

interface DeadlinesProps {
  deadlines?: Deadline[];
  onViewDeadline?: (id: string) => void;
  onViewAll?: () => void;
}

const Deadlines: React.FC<DeadlinesProps> = ({
  deadlines = [
    {
      id: '1',
      title: 'Application Deadline',
      university: 'Stanford University',
      date: '2024-11-30',
      type: 'application',
      priority: 'high',
      daysLeft: 5,
    },
    {
      id: '2',
      title: 'Recommendation Letters',
      university: 'MIT',
      date: '2024-12-05',
      type: 'document',
      priority: 'high',
      daysLeft: 10,
    },
    {
      id: '3',
      title: 'Virtual Interview',
      university: 'UC Berkeley',
      date: '2024-12-10',
      type: 'interview',
      priority: 'medium',
      daysLeft: 15,
    }
  ],
  onViewDeadline,
  onViewAll,
}) => {
  const getDaysLeftChipClassName = (daysLeft: number) => {
    if (daysLeft <= 7) return 'bg-red-100 text-error-main';
    if (daysLeft <= 14) return 'bg-yellow-100 text-yellow-700';
    return 'bg-gray-100 text-neutral-gray';
  };

  const items: DashboardCardItem[] = deadlines.map((deadline) => ({
    id: deadline.id,
    icon: <Calendar size={20} className="text-primary-main" />,
    heading: deadline.title,
    subheading: deadline.university,
    chip: {
      label: `${deadline.daysLeft}d`,
      className: getDaysLeftChipClassName(deadline.daysLeft),
    },
    onClick: () => onViewDeadline?.(deadline.id),
  }));

  return (
    <DashboardCard
      title="Upcoming Deadlines"
      items={items}
      buttonText="View All Deadlines"
      onButtonClick={onViewAll}
      emptyState={{
        icon: <Calendar size={48} className="text-neutral-gray" />,
        title: 'No upcoming deadlines',
        description: 'Your deadlines will appear here as you add applications',
      }}
    />
  );
};

export default Deadlines;
