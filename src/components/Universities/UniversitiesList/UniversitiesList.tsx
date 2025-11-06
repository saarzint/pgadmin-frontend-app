import React, { useState } from 'react';
import { Search, SlidersHorizontal, ChevronDown } from 'lucide-react';
import UniversityCard, { UniversityData } from '../UniversityCard/UniversityCard';
import FilterModal, { FilterValues } from '../FilterModal/FilterModal';

interface UniversitiesListProps {
  universities?: UniversityData[];
  onApply?: (id: string) => void;
  onViewDetails?: (id: string) => void;
}

const UniversitiesList: React.FC<UniversitiesListProps> = ({
  universities = [
    {
      id: '1',
      name: 'Stanford University',
      location: 'Stanford, California',
      country: 'USA',
      ranking: '#3',
      tags: ['Private', 'Research', 'Top 10'],
      description:
        'Stanford University is a private research university in Stanford, California, known for its entrepreneurial spirit and proximity to Silicon Valley.',
      tuitionFee: '$55,000/year',
      acceptanceRate: '4.3%',
      studentPopulation: '17,000',
      programs: ['Computer Science', 'Engineering', 'Business', 'Medicine'],
      requirements: [
        { label: 'GPA: 3.9+' },
        { label: 'SAT: 1450+' },
        { label: 'TOEFL: 100+' },
        { label: '3 Letters of Recommendation' },
      ],
      matchPercentage: 95,
      applicationDeadline: 'Jan 5, 2025',
    },
    {
      id: '2',
      name: 'Massachusetts Institute of Technology',
      location: 'Cambridge, Massachusetts',
      country: 'USA',
      ranking: '#1',
      tags: ['Private', 'Technical', 'Top 10'],
      description:
        'MIT is a private research university focused on science and technology, known for its rigorous academics and innovation.',
      tuitionFee: '$57,000/year',
      acceptanceRate: '3.9%',
      studentPopulation: '11,500',
      programs: ['Computer Science', 'Engineering', 'Physics', 'Mathematics'],
      requirements: [
        { label: 'GPA: 4.0' },
        { label: 'SAT: 1520+' },
        { label: 'TOEFL: 100+' },
        { label: 'Strong Math Background' },
      ],
      matchPercentage: 92,
      applicationDeadline: 'Jan 1, 2025',
    },
  ],
  onApply,
  onViewDetails,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [sortBy, setSortBy] = useState('tuition-low');
  const [filters, setFilters] = useState<FilterValues | null>(null);

  const sortOptions = [
    { id: 'ai-match', label: 'AI Match Score' },
    { id: 'ranking', label: 'Global Ranking' },
    { id: 'tuition-low', label: 'Tuition (Low to High)' },
    { id: 'acceptance', label: 'Acceptance Rate' },
  ];

  const handleToggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(id)) {
        newFavorites.delete(id);
      } else {
        newFavorites.add(id);
      }
      return newFavorites;
    });
  };

  const handleApplyFilters = (newFilters: FilterValues) => {
    setFilters(newFilters);
  };

  const handleSortChange = (sortId: string) => {
    setSortBy(sortId);
    setIsSortOpen(false);
  };

  const filteredAndSortedUniversities = universities
    .filter((university) => {
      // Search filter
      const matchesSearch =
        university.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        university.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        university.country.toLowerCase().includes(searchQuery.toLowerCase());

      if (!filters) return matchesSearch;

      // University type filter
      const matchesType =
        filters.universityTypes.length === 0 ||
        university.tags.some((tag) => filters.universityTypes.includes(tag));

      // Country filter
      const matchesCountry =
        filters.countries.length === 0 || filters.countries.includes(university.country);

      // Match percentage filter
      const matchesCompatibility = university.matchPercentage >= filters.compatibilityMatch;

      return matchesSearch && matchesType && matchesCountry && matchesCompatibility;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'ai-match':
          return b.matchPercentage - a.matchPercentage;
        case 'ranking':
          return parseInt(a.ranking.replace('#', '')) - parseInt(b.ranking.replace('#', ''));
        case 'tuition-low':
          return (
            parseInt(a.tuitionFee.replace(/[^0-9]/g, '')) -
            parseInt(b.tuitionFee.replace(/[^0-9]/g, ''))
          );
        case 'acceptance':
          return parseFloat(a.acceptanceRate) - parseFloat(b.acceptanceRate);
        default:
          return 0;
      }
    });

  return (
    <div className="w-full">
      {/* Search and Filter Bar */}
      <div className="flex justify-between items-center gap-3 mb-4 px-8">
        <div className="relative max-w-2xl w-full">
          <Search
            size={18}
            className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-neutral-gray"
          />
          <input
            type="text"
            placeholder="Search by university name, location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        <div className="flex gap-2">
          {/* Sort Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsSortOpen(!isSortOpen)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors text-sm"
              style={{ backgroundColor: '#F4F4F5', border: 'none', outline: 'none' }}
            >
              <span className="font-medium">
                {sortOptions.find((opt) => opt.id === sortBy)?.label || 'Sort'}
              </span>
              <ChevronDown size={18} />
            </button>

            {/* Sort Dropdown Menu */}
            {isSortOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setIsSortOpen(false)}
                ></div>
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-20">
                  {sortOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => handleSortChange(option.id)}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center justify-between ${
                        sortBy === option.id
                          ? 'bg-gray-100 font-medium text-gray-900'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span>{option.label}</span>
                      {sortBy === option.id && (
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M13.3346 4L6.0013 11.3333L2.66797 8"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <button
            onClick={() => setIsFilterOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors text-sm"
            style={{ backgroundColor: '#F4F4F5', border: 'none', outline: 'none' }}
          >
            <SlidersHorizontal size={18} />
            <span className="font-medium">Filter</span>
          </button>
        </div>
      </div>

      {/* Filter Modal */}
      <FilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApplyFilters={handleApplyFilters}
      />

      {/* Universities Count */}
      <div className="mb-3 px-8">
        <p className="text-base font-semibold text-primary-darkest">
          {filteredAndSortedUniversities.length} Universities Found
        </p>
        <p className="text-xs text-neutral-gray">
          Sorted by {sortOptions.find((opt) => opt.id === sortBy)?.label.toLowerCase()}
        </p>
      </div>

      {/* Universities Grid */}
      <div className="space-y-4 px-8">
        {filteredAndSortedUniversities.length > 0 ? (
          filteredAndSortedUniversities.map((university) => (
            <UniversityCard
              key={university.id}
              university={university}
              onApply={onApply}
              onViewDetails={onViewDetails}
              onToggleFavorite={handleToggleFavorite}
              isFavorite={favorites.has(university.id)}
            />
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-neutral-gray font-medium text-sm">No universities found</p>
            <p className="text-xs text-neutral-gray mt-1">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UniversitiesList;
