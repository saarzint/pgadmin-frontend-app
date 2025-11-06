import React from 'react';
import { MapPin, Users, Award, BookOpen, Heart, ExternalLink, MessageSquare } from 'lucide-react';

export interface UniversityData {
  id: string;
  name: string;
  location: string;
  country: string;
  ranking: string;
  tags: string[];
  description: string;
  tuitionFee: string;
  acceptanceRate: string;
  studentPopulation: string;
  programs: string[];
  requirements: {
    label: string;
  }[];
  matchPercentage: number;
  applicationDeadline?: string;
}

interface UniversityCardProps {
  university: UniversityData;
  onApply?: (id: string) => void;
  onViewDetails?: (id: string) => void;
  onToggleFavorite?: (id: string) => void;
  isFavorite?: boolean;
}

const UniversityCard: React.FC<UniversityCardProps> = ({
  university,
  onApply,
  onViewDetails,
  onToggleFavorite,
  isFavorite = false,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex gap-6">
        {/* Left - Image Placeholder */}
        <div className="flex-shrink-0 w-80 h-44 bg-gray-100 rounded-xl flex items-center justify-center">
          <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
            <BookOpen size={32} className="text-gray-400" />
          </div>
        </div>

        {/* Middle - University Info */}
        <div className="flex-1 space-y-4">
          {/* Header with Name and Location */}
          <div>
            <div className="flex items-start justify-between mb-1">
              <h3 className="text-2xl font-bold text-primary-darkest">
                {university.name}
              </h3>
              <button
                onClick={() => onToggleFavorite?.(university.id)}
                className="flex-shrink-0 p-1.5 hover:bg-gray-50 rounded-full transition-colors"
                aria-label="Toggle favorite"
              >
                <Heart
                  size={24}
                  className={isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}
                />
              </button>
            </div>
            <div className="flex items-center gap-1.5 text-gray-600 text-base">
              <MapPin size={16} />
              <span>{university.location}</span>
            </div>
          </div>

          {/* Tags/Programs */}
          <div className="flex flex-wrap gap-2">
            {university.programs.slice(0, 3).map((program, index) => (
              <span
                key={index}
                className="px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-700 rounded-lg"
              >
                {program}
              </span>
            ))}
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Rank */}
            <div className="flex items-center gap-2">
              <Award size={18} className="text-gray-600" />
              <span className="text-base text-gray-900 font-medium">{university.ranking}</span>
            </div>

            {/* Tuition */}
            <div className="flex items-center gap-2">
              <span className="text-base text-gray-900 font-medium">{university.tuitionFee}</span>
            </div>

            {/* Acceptance Rate */}
            <div className="flex items-center gap-2">
              <Users size={18} className="text-gray-600" />
              <span className="text-base text-gray-900 font-medium">{university.acceptanceRate} acceptance</span>
            </div>

            {/* Student Population */}
            <div className="flex items-center gap-2">
              <BookOpen size={18} className="text-gray-600" />
              <span className="text-base text-gray-900 font-medium">{university.studentPopulation} students</span>
            </div>
          </div>

          {/* Key Highlights */}
          <div>
            <p className="text-sm font-semibold text-gray-900 mb-2">Key Highlights:</p>
            <ul className="space-y-1">
              {university.requirements.slice(0, 3).map((req, index) => (
                <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                  <span className="text-gray-400 mt-0.5">•</span>
                  <span>{req.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right - Match Score and Actions */}
        <div className="flex-shrink-0 w-64 flex flex-col items-center">
          {/* Match Score */}
          <div className="text-center mb-4">
            <div className="text-5xl font-bold text-primary-darkest mb-1">
              {university.matchPercentage}%
            </div>
            <p className="text-sm text-gray-600 mb-3">AI Match</p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-black h-2 rounded-full transition-all"
                style={{ width: `${university.matchPercentage}%` }}
              ></div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="w-full space-y-3">
            <button
              onClick={() => onViewDetails?.(university.id)}
              className="w-full py-3 px-4 rounded-lg font-semibold text-sm transition-colors bg-black text-white hover:bg-gray-800"
            >
              View Details
            </button>
            <button
              onClick={() => onViewDetails?.(university.id)}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-gray-300 text-gray-900 font-semibold text-sm rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ExternalLink size={16} />
              Visit Website
            </button>
            <button
              className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-gray-300 text-gray-900 font-semibold text-sm rounded-lg hover:bg-gray-50 transition-colors"
            >
              <MessageSquare size={16} />
              Chat with University
            </button>
          </div>

          {/* Compare Link */}
          <button className="mt-4 text-sm text-gray-600 hover:text-gray-900 underline">
            Compare Universities
          </button>
        </div>
      </div>
    </div>
  );
};

export default UniversityCard;
