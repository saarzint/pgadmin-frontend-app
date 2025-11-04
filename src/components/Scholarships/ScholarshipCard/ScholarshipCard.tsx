import React from 'react';
import { Calendar, DollarSign, Clock, Users, Heart, ExternalLink } from 'lucide-react';

export interface ScholarshipData {
  id: string;
  title: string;
  university: string;
  tags: string[];
  description: string;
  amount: string;
  deadline: string;
  deadlinePassed?: boolean;
  recipients: string;
  duration: string;
  eligibility: string[];
  requirements: {
    label: string;
  }[];
  matchPercentage: number;
}

interface ScholarshipCardProps {
  scholarship: ScholarshipData;
  onApply?: (id: string) => void;
  onViewDetails?: (id: string) => void;
  onToggleFavorite?: (id: string) => void;
  isFavorite?: boolean;
}

const ScholarshipCard: React.FC<ScholarshipCardProps> = ({
  scholarship,
  onApply,
  onViewDetails,
  onToggleFavorite,
  isFavorite = false,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-xl font-bold text-primary-darkest truncate">
              {scholarship.title}
            </h3>
            <button
              onClick={() => onToggleFavorite?.(scholarship.id)}
              className="flex-shrink-0 p-1 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Toggle favorite"
            >
              <Heart
                size={20}
                className={isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}
              />
            </button>
          </div>
          <p className="text-neutral-gray mb-3">{scholarship.university}</p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {scholarship.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 text-xs font-medium rounded-md bg-primary-light bg-opacity-20 text-primary-dark"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Match Percentage */}
        <div className="flex-shrink-0 ml-4 text-right">
          <div className="text-3xl font-bold text-primary-darkest mb-1">
            {scholarship.matchPercentage}%
          </div>
          <p className="text-xs text-neutral-gray">AI Match</p>
        </div>
      </div>

      {/* Description */}
      <p className="text-neutral-gray text-sm mb-4 line-clamp-2">
        {scholarship.description}
      </p>

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <DollarSign size={16} className="text-neutral-gray" />
          <div>
            <p className="text-xs text-neutral-gray">Amount</p>
            <p className="font-semibold text-primary-darkest">{scholarship.amount}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Calendar size={16} className={scholarship.deadlinePassed ? 'text-error' : 'text-neutral-gray'} />
          <div>
            <p className="text-xs text-neutral-gray">Deadline</p>
            <p className={`font-semibold ${scholarship.deadlinePassed ? 'text-error' : 'text-primary-darkest'}`}>
              {scholarship.deadlinePassed ? 'Deadline passed' : scholarship.deadline}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Users size={16} className="text-neutral-gray" />
          <div>
            <p className="text-xs text-neutral-gray">Recipients</p>
            <p className="font-semibold text-primary-darkest">{scholarship.recipients}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Clock size={16} className="text-neutral-gray" />
          <div>
            <p className="text-xs text-neutral-gray">Duration</p>
            <p className="font-semibold text-primary-darkest">{scholarship.duration}</p>
          </div>
        </div>
      </div>

      {/* Eligibility */}
      <div className="mb-4">
        <p className="text-sm font-semibold text-primary-darkest mb-2">Eligibility:</p>
        <div className="flex flex-wrap gap-2">
          {scholarship.eligibility.map((item, index) => (
            <span
              key={index}
              className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* Requirements */}
      <div className="mb-4">
        <p className="text-sm font-semibold text-primary-darkest mb-2">Requirements:</p>
        <ul className="space-y-1">
          {scholarship.requirements.map((req, index) => (
            <li key={index} className="text-sm text-neutral-gray flex items-start gap-2">
              <span className="text-primary-dark mt-1">•</span>
              <span>{req.label}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={() => onApply?.(scholarship.id)}
          disabled={scholarship.deadlinePassed}
          className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-colors ${
            scholarship.deadlinePassed
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-primary-darkest text-white hover:bg-primary-dark'
          }`}
        >
          Apply Now
        </button>
        <button
          onClick={() => onViewDetails?.(scholarship.id)}
          className="flex items-center gap-2 py-3 px-4 border-2 border-primary text-primary-dark font-semibold rounded-lg hover:bg-primary-dark hover:text-white hover:border-primary-dark transition-colors"
        >
          <ExternalLink size={18} />
          View Details
        </button>
      </div>
    </div>
  );
};

export default ScholarshipCard;
