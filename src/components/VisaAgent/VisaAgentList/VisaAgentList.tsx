import React, { useState } from 'react';
import { Search, SlidersHorizontal, ChevronDown } from 'lucide-react';
import VisaAgentCard, { VisaAgentData } from '../VisaAgentCard/VisaAgentCard';

interface VisaAgentListProps {
  visas?: VisaAgentData[];
}

const VisaAgentList: React.FC<VisaAgentListProps> = ({
  visas = [],
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredVisas = visas.filter((visa) => {
    const matchesSearch =
      visa.visaType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      visa.citizenshipCountry.toLowerCase().includes(searchQuery.toLowerCase()) ||
      visa.destinationCountry.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch;
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
            placeholder="Search by visa type or country..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors text-sm" style={{ backgroundColor: '#F4F4F5', border: 'none', outline: 'none' }}>
            <span className="font-medium">Sort</span>
            <ChevronDown size={18} />
          </button>
          <button
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors text-sm"
            style={{ backgroundColor: '#F4F4F5', border: 'none', outline: 'none' }}
          >
            <SlidersHorizontal size={18} />
            <span className="font-medium">Filter</span>
          </button>
        </div>
      </div>

      {/* Visa Count */}
      <div className="mb-3 px-8">
        <p className="text-base font-semibold text-primary-darkest">
          {filteredVisas.length} Visa {filteredVisas.length === 1 ? 'Result' : 'Results'} Found
        </p>
        <p className="text-xs text-neutral-gray">Showing visa requirements for your selected route</p>
      </div>

      {/* Visa Cards Grid */}
      <div className="space-y-4 px-8">
        {filteredVisas.length > 0 ? (
          filteredVisas.map((visa) => (
            <VisaAgentCard
              key={visa.id}
              visa={visa}
            />
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-neutral-gray font-medium text-sm">No visa information found</p>
            <p className="text-xs text-neutral-gray mt-1">
              Try adjusting your search criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VisaAgentList;
