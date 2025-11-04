import React, { useState } from 'react';
import { X } from 'lucide-react';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: FilterValues) => void;
}

export interface FilterValues {
  scholarshipTypes: string[];
  awardAmountRange: [number, number];
  onlyOpenScholarships: boolean;
  acceptanceRate: number;
  compatibilityMatch: number;
  degreeLevels: string[];
  countries: string[];
}

const FilterModal: React.FC<FilterModalProps> = ({ isOpen, onClose, onApplyFilters }) => {
  const [scholarshipTypes, setScholarshipTypes] = useState<string[]>([]);
  const [awardAmountRange, setAwardAmountRange] = useState<[number, number]>([0, 50000]);
  const [onlyOpenScholarships, setOnlyOpenScholarships] = useState(false);
  const [acceptanceRate, setAcceptanceRate] = useState(100);
  const [compatibilityMatch, setCompatibilityMatch] = useState(100);
  const [degreeLevels, setDegreeLevels] = useState<string[]>([]);
  const [countries, setCountries] = useState<string[]>([]);

  if (!isOpen) return null;

  const handleScholarshipTypeToggle = (type: string) => {
    setScholarshipTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleDegreeLevelToggle = (level: string) => {
    setDegreeLevels((prev) =>
      prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]
    );
  };

  const handleCountryToggle = (country: string) => {
    setCountries((prev) =>
      prev.includes(country) ? prev.filter((c) => c !== country) : [...prev, country]
    );
  };

  const handleApply = () => {
    onApplyFilters({
      scholarshipTypes,
      awardAmountRange,
      onlyOpenScholarships,
      acceptanceRate,
      compatibilityMatch,
      degreeLevels,
      countries,
    });
    onClose();
  };

  const handleReset = () => {
    setScholarshipTypes([]);
    setAwardAmountRange([0, 50000]);
    setOnlyOpenScholarships(false);
    setAcceptanceRate(100);
    setCompatibilityMatch(100);
    setDegreeLevels([]);
    setCountries([]);
  };

  return (
    <div className="fixed inset-0 flex justify-end z-50 pointer-events-none">
      <div className="bg-white w-full max-w-md h-full overflow-y-auto shadow-2xl pointer-events-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-primary-darkest">Filter</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-4 space-y-6">
          {/* Scholarship Type */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-5 h-5 bg-gray-100 rounded"></div>
              <h3 className="text-base font-bold text-primary-darkest">Scholarship Type</h3>
            </div>
            <div className="space-y-2">
              {['Merit-based', 'Need-based', 'Research-based', 'Diversity', 'Leadership'].map(
                (type) => (
                  <label key={type} className="flex items-center justify-between cursor-pointer">
                    <span className="text-sm text-gray-700">{type}</span>
                    <input
                      type="checkbox"
                      checked={scholarshipTypes.includes(type)}
                      onChange={() => handleScholarshipTypeToggle(type)}
                      className="w-5 h-5 bg-white text-primary-darkest focus:ring-primary"
                      style={{ borderRadius: '4px', border: '1px solid #E5E5E5', boxShadow: '0px 1px 2px 0px #0000000D' }}
                    />
                  </label>
                )
              )}
            </div>
          </div>

          {/* Award Amount */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-5 h-5 bg-gray-100 rounded"></div>
              <h3 className="text-base font-bold text-primary-darkest">Award Amount</h3>
            </div>
            <div className="flex justify-between text-sm text-gray-700 mb-2">
              <span>From ${awardAmountRange[0].toLocaleString()}</span>
              <span>To ${awardAmountRange[1].toLocaleString()}</span>
            </div>
            <div className="relative">
              <input
                type="range"
                min="0"
                max="50000"
                step="1000"
                value={awardAmountRange[1]}
                onChange={(e) => setAwardAmountRange([0, parseInt(e.target.value)])}
                className="w-full h-2 bg-primary-darkest rounded-full appearance-none cursor-pointer range-slider"
              />
            </div>
          </div>

          {/* Availability */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-5 h-5 bg-gray-100 rounded"></div>
              <h3 className="text-base font-bold text-primary-darkest">Availability</h3>
            </div>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-gray-700">Only show currently open scholarships</span>
              <input
                type="checkbox"
                checked={onlyOpenScholarships}
                onChange={(e) => setOnlyOpenScholarships(e.target.checked)}
                className="w-5 h-5 bg-white text-primary-darkest focus:ring-primary"
                style={{ borderRadius: '4px', border: '1px solid #E5E5E5', boxShadow: '0px 1px 2px 0px #0000000D' }}
              />
            </label>
          </div>

          {/* Acceptance Rate */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-5 h-5 bg-gray-100 rounded"></div>
              <h3 className="text-base font-bold text-primary-darkest">Acceptance Rate</h3>
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
            <div className="flex items-center gap-3 mb-3">
              <div className="w-5 h-5 bg-gray-100 rounded"></div>
              <h3 className="text-base font-bold text-primary-darkest">Compatibility Match</h3>
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
            <div className="flex items-center gap-3 mb-3">
              <div className="w-5 h-5 bg-gray-100 rounded"></div>
              <h3 className="text-base font-bold text-primary-darkest">Degree Level</h3>
            </div>
            <div className="space-y-2">
              {['Bachelor', 'Master', 'Second Master'].map((level) => (
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

          {/* Countries */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-5 h-5 bg-gray-100 rounded"></div>
              <h3 className="text-base font-bold text-primary-darkest">Countries</h3>
            </div>
            <div className="space-y-2">
              {['USA', 'UK'].map((country) => (
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
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 space-y-3">
          <button
            onClick={handleApply}
            className="w-full bg-primary-darkest text-white font-semibold py-3 px-4 rounded-lg hover:bg-primary-dark transition-colors"
          >
            Apply Filters
          </button>
          <button
            onClick={handleReset}
            className="w-full border border-gray-300 text-primary-darkest font-semibold py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;
