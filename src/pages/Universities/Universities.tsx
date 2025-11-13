import React, { useState, useEffect } from 'react';
import { Header, UniversitiesList } from '../../components/Universities';
import { UniversityData } from '../../components/Universities/UniversityCard/UniversityCard';
import { universityService } from '../../services/api';
import { ErrorHandler } from '../../utils/errorHandler';
import type { UniversityResult } from '../../services/api/types';

const Universities: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch university search results
  const fetchUniversities = async (userProfileId: number, searchRequest: string) => {
    setLoading(true);

    try {
      console.log('=== Starting University Search ===');
      console.log('Request:', { userProfileId, searchRequest });

      // Step 1: Initiate search
      const searchResponse = await universityService.searchUniversities({
        user_profile_id: userProfileId,
        search_request: searchRequest,
      });

      console.log('Search Response:', searchResponse);

      // Step 2: Fetch results using the result_id
      const resultsResponse = await universityService.getResults(searchResponse.result_id);

      console.log('Results Response:', resultsResponse);
      console.log('Results Data:', JSON.stringify(resultsResponse, null, 2));
      console.log('=== University Search Complete ===');

    } catch (err) {
      console.error('Error fetching universities:', err);
      ErrorHandler.log(err, 'Universities Page - Fetch');
    } finally {
      setLoading(false);
    }
  };

  // Load universities on component mount
  useEffect(() => {
    // Fetch universities for user profile ID 1
    fetchUniversities(1, 'Find universities that match my profile');
  }, []);

  const handleApply = (id: string) => {
    console.log('Starting application for university:', id);
  };

  const handleViewDetails = (id: string) => {
    console.log('Viewing details for university:', id);
  };

  return (
    <div className="min-h-screen bg-white py-4">
      <div className="w-full px-6">
        {/* Header */}
        <Header />

        {/* Loading Indicator */}
        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
            <span className="ml-3 text-gray-600">Loading universities...</span>
          </div>
        )}

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
