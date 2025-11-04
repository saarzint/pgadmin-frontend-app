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
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 md:p-6 lg:p-8 hover:shadow-md transition-shadow">
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr_1fr] gap-4 md:gap-6 lg:gap-8">
        {/* Left Column - 50% */}
        <div className="space-y-4">
          {/* Title and University */}
          <div>
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-xl md:text-2xl font-bold text-primary-darkest">
                {scholarship.title}
              </h3>
              <button
                onClick={() => onToggleFavorite?.(scholarship.id)}
                className="flex-shrink-0 p-1 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Toggle favorite"
              >
                <Heart
                  size={24}
                  className={isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}
                />
              </button>
            </div>
            <p className="text-neutral-gray text-base">{scholarship.university}</p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {scholarship.tags.map((tag, index) => {
              const isRenewable = tag.toLowerCase() === 'renewable';
              return (
                <span
                  key={index}
                  className={`px-3 py-1.5 text-sm font-medium ${isRenewable
                      ? 'bg-white text-green-700'
                      : 'bg-gray-100 text-gray-700'
                    }`}
                  style={{ borderRadius: '8px', border: '1px solid #E5E5E5' }}
                >
                  {tag}
                </span>
              );
            })}
          </div>

          {/* Description */}
          <p className="text-neutral-gray text-base">
            {scholarship.description}
          </p>

          {/* Details */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-3">
              <DollarSign size={20} className="text-neutral-gray" />
              <span className="text-base text-primary-darkest">{scholarship.amount}</span>
            </div>

            <div className="flex items-center gap-3">
              <Calendar size={20} className={scholarship.deadlinePassed ? 'text-red-500' : 'text-neutral-gray'} />
              <span className={`text-base ${scholarship.deadlinePassed ? 'text-red-500' : 'text-primary-darkest'}`}>
                {scholarship.deadlinePassed ? 'Deadline passed' : scholarship.deadline}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Users size={20} className="text-neutral-gray" />
              <span className="text-base text-primary-darkest">{scholarship.recipients}</span>
            </div>

            <div className="flex items-center gap-3">
              <Clock size={20} className="text-neutral-gray" />
              <span className="text-base text-primary-darkest">{scholarship.duration}</span>
            </div>
          </div>

          {/* Eligibility */}
          <div>
            <p className="text-base font-bold text-primary-darkest mb-2">Eligibility:</p>
            <div className="flex flex-wrap gap-2">
              {scholarship.eligibility.map((item, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 text-sm bg-white text-gray-700"
                  style={{ borderRadius: '8px', border: '1px solid #E5E5E5' }}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Middle Column - Requirements */}
        <div>
          <p className="text-base font-bold text-primary-darkest mb-3">Requirements:</p>
          <ul className="space-y-2">
            {scholarship.requirements.map((req, index) => (
              <li key={index} className="text-base text-neutral-gray flex items-start gap-2">
                <span className="text-primary-dark mt-1">•</span>
                <span>{req.label}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Right Column - Match and Actions */}
        <div className="flex flex-col">
          {/* Match Percentage with Progress Bar */}
          <div className="text-center lg:text-center">
            <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-darkest mb-1">
              {scholarship.matchPercentage}%
            </div>
            <p className="text-sm text-neutral-gray mb-3">AI Match</p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary-darkest h-2 rounded-full"
                style={{ width: `${scholarship.matchPercentage}%` }}
              ></div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2 mt-6">
            <button
              onClick={() => onApply?.(scholarship.id)}
              disabled={scholarship.deadlinePassed}
              className={`w-full py-2.5 px-4 rounded-lg font-semibold text-sm transition-colors ${scholarship.deadlinePassed
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-primary-darkest text-white hover:bg-primary-dark'
                }`}
            >
              Apply Now
            </button>
            <button
              onClick={() => onViewDetails?.(scholarship.id)}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 border border-gray-300 text-primary-darkest font-semibold text-sm rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ExternalLink size={16} />
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScholarshipCard;
