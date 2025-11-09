import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ResourceCardProps {
  title: string;
  icon: LucideIcon;
  url?: string;
  onClick?: () => void;
  children?: React.ReactNode;
}

const ResourceCard: React.FC<ResourceCardProps> = ({
  title,
  icon: Icon,
  url,
  onClick,
  children,
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col items-center justify-center hover:shadow-md transition-shadow min-h-[280px]">
      <div className="w-20 h-20 mb-4 flex items-center justify-center bg-primary-lightest rounded-xl">
        <Icon size={48} className="text-primary" strokeWidth={1.5} />
      </div>

      <h3 className="text-xl font-semibold text-primary-darkest mb-4 text-center">{title}</h3>

      {children ? (
        <div className="w-full">{children}</div>
      ) : (
        <button
          onClick={handleClick}
          className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm font-medium"
        >
          Go to Site
        </button>
      )}
    </div>
  );
};

export default ResourceCard;
