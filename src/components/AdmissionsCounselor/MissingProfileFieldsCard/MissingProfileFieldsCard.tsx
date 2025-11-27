import React from 'react';
import { UserX, AlertCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface MissingProfileFieldsCardProps {
  missingFields: string[];
}

const MissingProfileFieldsCard: React.FC<MissingProfileFieldsCardProps> = ({ missingFields }) => {
  const formatFieldName = (field: string) => {
    return field
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  if (missingFields.length === 0) {
    return null;
  }

  return (
    <div className="bg-yellow-50 rounded-2xl shadow-sm border border-yellow-200 p-4 md:p-5">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-yellow-100 rounded-lg">
          <UserX size={20} className="text-yellow-700" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-bold text-yellow-800 mb-1">
            Complete Your Profile
          </h3>
          <p className="text-xs text-yellow-700 mb-3">
            The following fields are missing and may affect your recommendations:
          </p>
          <div className="flex flex-wrap gap-2 mb-3">
            {missingFields.map((field, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-md"
              >
                <AlertCircle size={12} />
                {formatFieldName(field)}
              </span>
            ))}
          </div>
          <Link
            to="/profile"
            className="inline-flex items-center gap-1 text-xs font-semibold text-yellow-800 hover:text-yellow-900 transition-colors"
          >
            Go to Profile
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MissingProfileFieldsCard;
