import React, { useState } from 'react';
import { X } from 'lucide-react';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: FilterValues) => void;
}

export interface FilterValues {
  universityTypes: string[];
  tuitionRange: [number, number];
  countries: string[];
  rankings: string[];
  acceptanceRate: number;
  compatibilityMatch: number;
  degreeLevels: string[];
}

const FilterModal: React.FC<FilterModalProps> = ({ isOpen, onClose, onApplyFilters }) => {
  const [universityTypes, setUniversityTypes] = useState<string[]>([]);
  const [tuitionRange, setTuitionRange] = useState<[number, number]>([0, 80000]);
  const [countries, setCountries] = useState<string[]>([]);
  const [rankings, setRankings] = useState<string[]>([]);
  const [acceptanceRate, setAcceptanceRate] = useState(100);
  const [compatibilityMatch, setCompatibilityMatch] = useState(100);
  const [degreeLevels, setDegreeLevels] = useState<string[]>([]);

  if (!isOpen) return null;

  const handleUniversityTypeToggle = (type: string) => {
    setUniversityTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleCountryToggle = (country: string) => {
    setCountries((prev) =>
      prev.includes(country) ? prev.filter((c) => c !== country) : [...prev, country]
    );
  };

  const handleRankingToggle = (ranking: string) => {
    setRankings((prev) =>
      prev.includes(ranking) ? prev.filter((r) => r !== ranking) : [...prev, ranking]
    );
  };

  const handleDegreeLevelToggle = (level: string) => {
    setDegreeLevels((prev) =>
      prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]
    );
  };

  const handleApply = () => {
    onApplyFilters({
      universityTypes,
      tuitionRange,
      countries,
      rankings,
      acceptanceRate,
      compatibilityMatch,
      degreeLevels,
    });
    onClose();
  };

  const handleReset = () => {
    setUniversityTypes([]);
    setTuitionRange([0, 80000]);
    setCountries([]);
    setRankings([]);
    setAcceptanceRate(100);
    setCompatibilityMatch(100);
    setDegreeLevels([]);
  };

  return (
    <div className="fixed inset-0 flex justify-end z-50 pointer-events-none">
      <div className="bg-white w-full max-w-md h-full overflow-y-auto shadow-2xl pointer-events-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <h2 className="text-lg font-bold text-primary-darkest">Filter</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="px-4 py-3 space-y-4">
          {/* University Type */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-4 h-4 bg-gray-100 rounded"></div>
              <h3 className="text-sm font-bold text-primary-darkest">University Type</h3>
            </div>
            <div className="space-y-1.5">
              {['Public', 'Private', 'Research', 'Liberal Arts', 'Technical'].map((type) => (
                <label key={type} className="flex items-center justify-between cursor-pointer">
                  <span className="text-sm text-gray-700">{type}</span>
                  <input
                    type="checkbox"
                    checked={universityTypes.includes(type)}
                    onChange={() => handleUniversityTypeToggle(type)}
                    className="w-5 h-5 bg-white text-primary-darkest focus:ring-primary"
                    style={{ borderRadius: '4px', border: '1px solid #E5E5E5', boxShadow: '0px 1px 2px 0px #0000000D' }}
                  />
                </label>
              ))}
            </div>
          </div>

          {/* Tuition Fee Range */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-4 h-4 bg-gray-100 rounded"></div>
              <h3 className="text-sm font-bold text-primary-darkest">Tuition Fee (per year)</h3>
            </div>
            <div className="flex justify-between text-sm text-gray-700 mb-2">
              <span>From ${tuitionRange[0].toLocaleString()}</span>
              <span>To ${tuitionRange[1].toLocaleString()}</span>
            </div>
            <div className="relative">
              <input
                type="range"
                min="0"
                max="80000"
                step="5000"
                value={tuitionRange[1]}
                onChange={(e) => setTuitionRange([0, parseInt(e.target.value)])}
                className="w-full h-2 bg-primary-darkest rounded-full appearance-none cursor-pointer range-slider"
              />
            </div>
          </div>

          {/* Countries */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-4 h-4 bg-gray-100 rounded"></div>
              <h3 className="text-sm font-bold text-primary-darkest">Countries</h3>
            </div>
            <div className="space-y-1.5">
              {['USA', 'UK', 'Canada', 'Australia', 'Germany'].map((country) => (
                <label key={country} className="flex items-center justify-between cursor-pointer">
                  <span className="text-sm text-gray-700">{country}</span>
                  <input
                    type="checkbox"
                    checked={countries.includes(country)}
                    onChange={() => handleCountryToggle(country)}
                    className="w-5 h-5 bg-white text-primary-darkest focus:ring-primary"
                    style={{ borderRadius: '4px', border: '1px solid #E5E5E5', boxShadow: '0px 1px 2px 0px #0000000D' }}
                  />
                </label>
              ))}
            </div>
          </div>

          {/* World Ranking */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-4 h-4 bg-gray-100 rounded"></div>
              <h3 className="text-sm font-bold text-primary-darkest">World Ranking</h3>
            </div>
            <div className="space-y-1.5">
              {['Top 10', 'Top 50', 'Top 100', 'Top 200', 'Top 500'].map((ranking) => (
                <label key={ranking} className="flex items-center justify-between cursor-pointer">
                  <span className="text-sm text-gray-700">{ranking}</span>
                  <input
                    type="checkbox"
                    checked={rankings.includes(ranking)}
                    onChange={() => handleRankingToggle(ranking)}
                    className="w-5 h-5 bg-white text-primary-darkest focus:ring-primary"
                    style={{ borderRadius: '4px', border: '1px solid #E5E5E5', boxShadow: '0px 1px 2px 0px #0000000D' }}
                  />
                </label>
              ))}
            </div>
          </div>

          {/* Acceptance Rate */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-4 h-4 bg-gray-100 rounded"></div>
              <h3 className="text-sm font-bold text-primary-darkest">Acceptance Rate</h3>
            </div>
            <div className="flex justify-between text-sm text-gray-700 mb-2">
              <span>0%</span>
              <span>100%</span>
            </div>
            <div className="relative">
              <input
                type="range"
                min="0"
                max="100"
                value={acceptanceRate}
                onChange={(e) => setAcceptanceRate(parseInt(e.target.value))}
                className="w-full h-2 bg-primary-darkest rounded-full appearance-none cursor-pointer range-slider"
              />
            </div>
          </div>

          {/* Compatibility Match */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-4 h-4 bg-gray-100 rounded"></div>
              <h3 className="text-sm font-bold text-primary-darkest">Compatibility Match</h3>
            </div>
            <div className="flex justify-between text-sm text-gray-700 mb-2">
              <span>0%</span>
              <span>100%</span>
            </div>
            <div className="relative">
              <input
                type="range"
                min="0"
                max="100"
                value={compatibilityMatch}
                onChange={(e) => setCompatibilityMatch(parseInt(e.target.value))}
                className="w-full h-2 bg-primary-darkest rounded-full appearance-none cursor-pointer range-slider"
              />
            </div>
          </div>

          {/* Degree Level */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-4 h-4 bg-gray-100 rounded"></div>
              <h3 className="text-sm font-bold text-primary-darkest">Degree Level</h3>
            </div>
            <div className="space-y-1.5">
              {['Bachelor', 'Master', 'PhD'].map((level) => (
                <label key={level} className="flex items-center justify-between cursor-pointer">
                  <span className="text-sm text-gray-700">{level}</span>
                  <input
                    type="radio"
                    name="degreeLevel"
                    checked={degreeLevels.includes(level)}
                    onChange={() => handleDegreeLevelToggle(level)}
                    className="w-5 h-5 border-gray-300 text-primary-darkest focus:ring-primary"
                  />
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-4 py-3 space-y-2">
          <button
            onClick={handleApply}
            className="w-full bg-primary-darkest text-white font-semibold py-2 px-3 rounded-lg hover:bg-primary-dark transition-colors text-sm"
          >
            Apply Filters
          </button>
          <button
            onClick={handleReset}
            className="w-full border border-gray-300 text-primary-darkest font-semibold py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors text-sm"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;
