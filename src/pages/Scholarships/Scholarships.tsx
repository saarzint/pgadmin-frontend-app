import React from 'react';
import { Header, MetricCards, ScholarshipsList } from '../../components/Scholarships';

const Scholarships: React.FC = () => {
  const handleApply = (id: string) => {
    console.log('Applying to scholarship:', id);
    // Add your application logic here
  };

  const handleViewDetails = (id: string) => {
    console.log('Viewing details for scholarship:', id);
    // Add your view details logic here
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="w-full px-6">
        {/* Header */}
        <Header />

        {/* Metric Cards */}
        <MetricCards />

        {/* Scholarships List with Tabs */}
        <ScholarshipsList
          onApply={handleApply}
          onViewDetails={handleViewDetails}
        />
      </div>
    </div>
  );
};

export default Scholarships;
