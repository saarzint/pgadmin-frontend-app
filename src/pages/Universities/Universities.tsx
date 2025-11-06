import React from 'react';
import { Header, UniversitiesList } from '../../components/Universities';

const Universities: React.FC = () => {
  const handleApply = (id: string) => {
    console.log('Starting application for university:', id);
    // Add your application logic here
  };

  const handleViewDetails = (id: string) => {
    console.log('Viewing details for university:', id);
    // Add your view details logic here
  };

  return (
    <div className="min-h-screen bg-white py-4">
      <div className="w-full px-6">
        {/* Header */}
        <Header />

        {/* Universities List with Tabs */}
        <UniversitiesList
          onApply={handleApply}
          onViewDetails={handleViewDetails}
        />
      </div>
    </div>
  );
};

export default Universities;
