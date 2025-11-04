import React, { useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import ScholarshipCard, { ScholarshipData } from '../ScholarshipCard/ScholarshipCard';

interface ScholarshipsListProps {
  scholarships?: ScholarshipData[];
  onApply?: (id: string) => void;
  onViewDetails?: (id: string) => void;
}

const ScholarshipsList: React.FC<ScholarshipsListProps> = ({
  scholarships = [
    {
      id: '1',
      title: 'Merit Excellence Scholarship',
      university: 'Stanford University',
      tags: ['Merit-based', 'USA', 'Undergraduate', 'Renewable'],
      description:
        'Full tuition scholarship for outstanding international students in STEM programs.',
      amount: '$25,000',
      deadline: '2024-12-01',
      deadlinePassed: true,
      recipients: '50 recipients',
      duration: '4 years',
      eligibility: ['GPA 3.5+', 'International Students', 'STEM Fields'],
      requirements: [
        { label: 'Academic Transcripts' },
        { label: 'Essay (500 words)' },
        { label: '2 Letters of Recommendation' },
      ],
      matchPercentage: 95,
    },
    {
      id: '2',
      title: 'STEM Excellence Award',
      university: 'MIT',
      tags: ['Merit-based', 'USA', 'Graduate', 'Need-based'],
      description:
        'Award for graduate students pursuing advanced degrees in STEM fields with demonstrated financial need.',
      amount: '$30,000',
      deadline: '2024-11-30',
      recipients: '30 recipients',
      duration: '2 years',
      eligibility: ['Graduate Students', 'STEM Fields', 'Financial Need'],
      requirements: [
        { label: 'Graduate Transcripts' },
        { label: 'Research Proposal' },
        { label: '3 Letters of Recommendation' },
        { label: 'Financial Need Documentation' },
      ],
      matchPercentage: 90,
    },
  ],
  onApply,
  onViewDetails,
}) => {
  const [activeTab, setActiveTab] = useState<string>('discover');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const tabs = [
    { id: 'discover', label: 'Discover Scholarships' },
    { id: 'applications', label: 'My Applications' },
    { id: 'planning', label: 'Financial Planning' },
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

  const filteredScholarships = scholarships.filter((scholarship) =>
    scholarship.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    scholarship.university.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full">
      {/* Tabs - iOS Style */}
      <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-lg">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 px-4 py-1.5 font-medium rounded-md transition-all ${
              activeTab === tab.id
                ? 'bg-white text-primary-darkest shadow-sm'
                : 'text-neutral-gray hover:text-primary-dark'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search and Filter Bar */}
      <div className="flex gap-4 mb-6 px-12">
        <div className="flex-1 relative">
          <Search
            size={20}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-gray"
          />
          <input
            type="text"
            placeholder="Search by name or provider..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          <SlidersHorizontal size={20} />
          <span className="font-medium">Filter</span>
        </button>
        <button className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          <span className="font-medium">Sort ▼</span>
        </button>
      </div>

      {/* Scholarships Count */}
      <div className="mb-4 px-12">
        <p className="text-lg font-semibold text-primary-darkest">
          {filteredScholarships.length} Scholarships Found
        </p>
        <p className="text-sm text-neutral-gray">Sorted by AI match score</p>
      </div>

      {/* Scholarships Grid */}
      <div className="space-y-6 px-12">
        {filteredScholarships.length > 0 ? (
          filteredScholarships.map((scholarship) => (
            <ScholarshipCard
              key={scholarship.id}
              scholarship={scholarship}
              onApply={onApply}
              onViewDetails={onViewDetails}
              onToggleFavorite={handleToggleFavorite}
              isFavorite={favorites.has(scholarship.id)}
            />
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-neutral-gray font-medium">No scholarships found</p>
            <p className="text-sm text-neutral-gray mt-2">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScholarshipsList;
