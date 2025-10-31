import React from 'react';
import { FileText } from 'lucide-react';
import DashboardCard, { DashboardCardItem } from '../DashboardCard/DashboardCard';

interface Application {
  id: string;
  universityName: string;
  program: string;
  status: 'draft' | 'submitted' | 'accepted' | 'rejected';
  deadline: string;
}

interface ApplicationsProps {
  applications?: Application[];
  onViewApplication?: (id: string) => void;
  onViewAll?: () => void;
}

const Applications: React.FC<ApplicationsProps> = ({
  applications = [
    {
      id: '1',
      universityName: 'Stanford University',
      program: 'Computer Science MS',
      status: 'submitted',
      deadline: '2024-12-15',
    },
    {
      id: '2',
      universityName: 'MIT',
      program: 'Electrical Engineering PhD',
      status: 'draft',
      deadline: '2024-11-30',
    },
    {
      id: '3',
      universityName: 'UC Berkeley',
      program: 'Data Science MS',
      status: 'accepted',
      deadline: '2024-10-20',
    },
  ],
  onViewApplication,
  onViewAll,
}) => {
  const getStatusChipClassName = (status: Application['status']) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-neutral-gray';
      case 'submitted':
        return 'bg-primary-lightest text-primary-dark';
      case 'accepted':
        return 'bg-green-100 text-green-700';
      case 'rejected':
        return 'bg-red-100 text-error-main';
    }
  };

  const items: DashboardCardItem[] = applications.map((app) => ({
    id: app.id,
    icon: <FileText size={20} className="text-primary-main" />,
    heading: app.universityName,
    subheading: app.program,
    chip: {
      label: app.status.charAt(0).toUpperCase() + app.status.slice(1),
      className: getStatusChipClassName(app.status),
    },
    onClick: () => onViewApplication?.(app.id),
  }));

  return (
    <DashboardCard
      title="My Applications"
      items={items}
      buttonText="View All Applications"
      onButtonClick={onViewAll}
      emptyState={{
        icon: <FileText size={48} className="text-neutral-gray" />,
        title: 'No applications yet',
        description: 'Start your application journey today',
      }}
    />
  );
};

export default Applications;
