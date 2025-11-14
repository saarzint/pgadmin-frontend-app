import React, { useState, useEffect } from 'react';
import { Header, UniversitiesList } from '../../components/Universities';
import { UniversityData } from '../../components/Universities/UniversityCard/UniversityCard';
import { universityService } from '../../services/api';
import { ErrorHandler } from '../../utils/errorHandler';
import type { UniversityResult } from '../../services/api/types';

const Universities: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingProgress, setLoadingProgress] = useState<string>('');

  // Fetch university search results with polling
  const fetchUniversities = async (userProfileId: number, searchRequest: string) => {
    setLoading(true);
    setLoadingProgress('Initiating search...');

    try {
      console.log('=== Starting University Search ===');
      console.log('Request:', { userProfileId, searchRequest });

      // Use the searchAndWaitForResults method with polling
      const resultsResponse = await universityService.searchAndWaitForResults(
        {
          user_profile_id: userProfileId,
          search_request: searchRequest,
        },
        {
          maxAttempts: 60,
          intervalMs: 5000,
          onProgress: (attempt, maxAttempts) => {
            setLoadingProgress(`Fetching results... (${attempt}/${maxAttempts})`);
            console.log(`Polling attempt ${attempt}/${maxAttempts}`);
          },
        }
      );

      console.log('Results Response:', resultsResponse);
      console.log('Results Data:', JSON.stringify(resultsResponse, null, 2));
      console.log('=== University Search Complete ===');

    } catch (err) {
      console.error('Error fetching universities:', err);
      ErrorHandler.log(err, 'Universities Page - Fetch');
      setLoadingProgress('Failed to load universities');
    } finally {
      setLoading(false);
      setLoadingProgress('');
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
          <div className="flex flex-col items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
            <span className="ml-3 mt-3 text-gray-600">
              {loadingProgress || 'Loading universities...'}
            </span>
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
