import React from 'react';
import { RefreshCw } from 'lucide-react';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  lastUpdated?: string;
  onRefresh?: () => void;
  loading?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  title = 'Admissions Counselor',
  subtitle = 'Your personalized admissions dashboard with AI-powered guidance',
  lastUpdated,
  onRefresh,
  loading = false,
}) => {
  return (
    <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-primary-darkest mb-1">
          {title}
        </h1>
        <p className="text-neutral-gray text-sm md:text-base">{subtitle}</p>
      </div>
      <div className="flex items-center gap-3">
        {lastUpdated && (
          <span className="text-xs text-neutral-gray">
            Last updated: {new Date(lastUpdated).toLocaleString()}
          </span>
        )}
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-primary-darkest bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        )}
      </div>
    </div>
  );
};

export default Header;
