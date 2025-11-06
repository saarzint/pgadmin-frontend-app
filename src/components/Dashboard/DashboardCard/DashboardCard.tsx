import React from 'react';

export interface DashboardCardItem {
  id: string;
  icon?: React.ReactNode;
  heading: string;
  subheading: string;
  chip?: {
    label: string;
    className?: string;
  };
  onClick?: () => void;
}

interface DashboardCardProps {
  title: string;
  subtitle?: string;
  headerIcon?: React.ReactNode;
  items: DashboardCardItem[];
  buttonText?: string;
  onButtonClick?: () => void;
  emptyState?: {
    icon: React.ReactNode;
    title: string;
    description: string;
  };
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  subtitle,
  headerIcon,
  items,
  buttonText = 'View All',
  onButtonClick,
  emptyState,
}) => {
  return (
    <div className="w-full h-full bg-white rounded-2xl shadow-lg p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-primary-darkest mb-0.5">{title}</h2>
          {subtitle && <p className="text-xs text-neutral-gray">{subtitle}</p>}
        </div>
        {headerIcon && <div className="flex-shrink-0">{headerIcon}</div>}
      </div>

      {/* Items List */}
      <div className="space-y-2 mb-3">
        {items.length === 0 && emptyState ? (
          <div className="text-center py-8">
            <div className="flex justify-center mb-3 opacity-50">{emptyState.icon}</div>
            <p className="text-neutral-gray font-medium text-sm">{emptyState.title}</p>
            <p className="text-xs text-neutral-gray mt-1">{emptyState.description}</p>
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="border-b border-gray-200 p-3 hover:shadow-sm transition-shadow cursor-pointer"
              onClick={item.onClick}
            >
              <div className="flex items-start gap-3">
                {/* Icon */}
                {item.icon && (
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                    {item.icon}
                  </div>
                )}

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-primary-darkest mb-0.5 truncate text-sm">
                    {item.heading}
                  </h3>
                  <p className="text-xs text-neutral-gray truncate">{item.subheading}</p>
                </div>

                {/* Chip */}
                {item.chip && (
                  <div className="flex-shrink-0">
                    <span
                      className={`px-2 py-0.5 rounded-md text-xs font-semibold ${
                        item.chip.className || 'bg-gray-100 text-gray-700'
                      }`}
                      style={{ borderRadius: '6px' }}
                    >
                      {item.chip.label}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Button */}
      {items.length > 0 && buttonText && (
        <button
          onClick={onButtonClick}
          className="py-2 px-3 border-2 border-primary-main text-primary-dark font-semibold rounded-lg hover:bg-primary-dark hover:text-white transition-colors duration-200 text-sm"
        >
          {buttonText}
        </button>
      )}
    </div>
  );
};

export default DashboardCard;
