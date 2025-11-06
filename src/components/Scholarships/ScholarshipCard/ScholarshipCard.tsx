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
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-3 md:p-4 lg:p-5 hover:shadow-md transition-shadow">
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr_1fr] gap-3 md:gap-4 lg:gap-5">
        {/* Left Column - 50% */}
        <div className="space-y-3">
          {/* Title and University */}
          <div>
            <div className="flex items-start justify-between mb-1">
              <h3 className="text-lg md:text-xl font-bold text-primary-darkest">
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
            <p className="text-neutral-gray text-sm">{scholarship.university}</p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            {scholarship.tags.map((tag, index) => {
              const isRenewable = tag.toLowerCase() === 'renewable';
              return (
                <span
                  key={index}
                  className={`px-2 py-1 text-xs font-medium ${isRenewable
                      ? 'bg-white text-green-700'
                      : 'bg-gray-100 text-gray-700'
                    }`}
                  style={{ borderRadius: '6px', border: '1px solid #E5E5E5' }}
                >
                  {tag}
                </span>
              );
            })}
          </div>

          {/* Description */}
          <p className="text-neutral-gray text-sm">
            {scholarship.description}
          </p>

          {/* Details */}
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-2">
              <DollarSign size={16} className="text-neutral-gray" />
              <span className="text-sm text-primary-darkest">{scholarship.amount}</span>
            </div>

            <div className="flex items-center gap-2">
              <Calendar size={16} className={scholarship.deadlinePassed ? 'text-red-500' : 'text-neutral-gray'} />
              <span className={`text-sm ${scholarship.deadlinePassed ? 'text-red-500' : 'text-primary-darkest'}`}>
                {scholarship.deadlinePassed ? 'Deadline passed' : scholarship.deadline}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Users size={16} className="text-neutral-gray" />
              <span className="text-sm text-primary-darkest">{scholarship.recipients}</span>
            </div>

            <div className="flex items-center gap-2">
              <Clock size={16} className="text-neutral-gray" />
              <span className="text-sm text-primary-darkest">{scholarship.duration}</span>
            </div>
          </div>

          {/* Eligibility */}
          <div>
            <p className="text-sm font-bold text-primary-darkest mb-1.5">Eligibility:</p>
            <div className="flex flex-wrap gap-1.5">
              {scholarship.eligibility.map((item, index) => (
                <span
                  key={index}
                  className="px-2 py-1 text-xs bg-white text-gray-700"
                  style={{ borderRadius: '6px', border: '1px solid #E5E5E5' }}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Middle Column - Requirements */}
        <div>
          <p className="text-sm font-bold text-primary-darkest mb-2">Requirements:</p>
          <ul className="space-y-1.5">
            {scholarship.requirements.map((req, index) => (
              <li key={index} className="text-sm text-neutral-gray flex items-start gap-1.5">
                <span className="text-primary-dark mt-0.5">•</span>
                <span>{req.label}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Right Column - Match and Actions */}
        <div className="flex flex-col">
          {/* Match Percentage with Progress Bar */}
          <div className="text-center lg:text-center">
            <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary-darkest mb-0.5">
              {scholarship.matchPercentage}%
            </div>
            <p className="text-xs text-neutral-gray mb-2">AI Match</p>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div
                className="bg-primary-darkest h-1.5 rounded-full"
                style={{ width: `${scholarship.matchPercentage}%` }}
              ></div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-1.5 mt-4">
            <button
              onClick={() => onApply?.(scholarship.id)}
              disabled={scholarship.deadlinePassed}
              className={`w-full py-2 px-3 rounded-lg font-semibold text-sm transition-colors ${scholarship.deadlinePassed
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-primary-darkest text-white hover:bg-primary-dark'
                }`}
            >
              Apply Now
            </button>
            <button
              onClick={() => onViewDetails?.(scholarship.id)}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 border border-gray-300 text-primary-darkest font-semibold text-sm rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ExternalLink size={14} />
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScholarshipCard;
