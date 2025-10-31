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
  maxHeight?: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  subtitle,
  headerIcon,
  items,
  buttonText = 'View All',
  onButtonClick,
  emptyState,
  maxHeight = 'max-h-[calc(100%-8rem)]',
}) => {
  return (
    <div className="w-full h-full bg-white rounded-2xl shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-primary-darkest mb-1">{title}</h2>
          {subtitle && <p className="text-sm text-neutral-gray">{subtitle}</p>}
        </div>
        {headerIcon && <div className="flex-shrink-0">{headerIcon}</div>}
      </div>

      {/* Items List */}
      <div className={`space-y-3 overflow-y-auto ${maxHeight} mb-4`}>
        {items.length === 0 && emptyState ? (
          <div className="text-center py-12">
            <div className="flex justify-center mb-4 opacity-50">{emptyState.icon}</div>
            <p className="text-neutral-gray font-medium">{emptyState.title}</p>
            <p className="text-sm text-neutral-gray mt-2">{emptyState.description}</p>
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="border-b border-gray-200 p-4 hover:shadow-sm transition-shadow cursor-pointer"
              onClick={item.onClick}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                {item.icon && (
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                    {item.icon}
                  </div>
                )}

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-primary-darkest mb-1 truncate">
                    {item.heading}
                  </h3>
                  <p className="text-sm text-neutral-gray truncate">{item.subheading}</p>
                </div>

                {/* Chip */}
                {item.chip && (
                  <div className="flex-shrink-0">
                    <span
                      className={`px-2 py-1 rounded-md text-xs font-semibold ${
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
          className="py-3 px-4 border-2 border-primary-main text-primary-dark font-semibold rounded-lg hover:bg-primary-dark hover:text-white transition-colors duration-200"
        >
          {buttonText}
        </button>
      )}
    </div>
  );
};

export default DashboardCard;
