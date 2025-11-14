import React, { useState, useEffect } from 'react';
import { Header, UniversitiesList } from '../../components/Universities';
import { UniversityData } from '../../components/Universities/UniversityCard/UniversityCard';
import { universityService } from '../../services/api';
import { ErrorHandler } from '../../utils/errorHandler';
import type { UniversityResult } from '../../services/api/types';

const Universities: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingProgress, setLoadingProgress] = useState<string>('');
  const [universities, setUniversities] = useState<UniversityData[]>([]);

  // Transform API result to UniversityData format
  const transformUniversityData = (result: UniversityResult): UniversityData => {
    // Calculate match percentage based on rank category
    const matchPercentage =
      result.rank_category === 'Safety' ? 85 :
      result.rank_category === 'Target' ? 70 :
      result.rank_category === 'Reach' ? 50 : 65;

    return {
      id: result.id.toString(),
      name: result.university_name,
      location: result.location,
      country: 'USA', // Default, could be parsed from location
      ranking: `Top ${Math.round(result.acceptance_rate * 100)}% Acceptance Rate`,
      tags: [result.rank_category, ...result.programs.slice(0, 2)],
      description: result.why_fit,
      tuitionFee: `$${result.tuition.toLocaleString()}/year`,
      acceptanceRate: `${Math.round(result.acceptance_rate * 100)}%`,
      studentPopulation: 'N/A', // Not in API response
      programs: result.programs,
      requirements: [
        { label: `Confidence: ${result.recommendation_metadata.recommendation_confidence}` },
        { label: `Data Quality: ${result.recommendation_metadata.data_completeness}` },
        ...(result.recommendation_metadata.preference_conflicts && Array.isArray(result.recommendation_metadata.preference_conflicts) ?
          result.recommendation_metadata.preference_conflicts.map((c: string) => ({ label: `⚠️ ${c}` })) : []
        ),
      ],
      matchPercentage,
      applicationDeadline: undefined,
    };
  };

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

      // Transform and set the universities data
      const transformedData = resultsResponse.results.map(transformUniversityData);
      setUniversities(transformedData);

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
        {!loading && universities.length > 0 && (
          <UniversitiesList
            universities={universities}
            onApply={handleApply}
            onViewDetails={handleViewDetails}
          />
        )}

        {/* No Results */}
        {!loading && universities.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No universities found. Try adjusting your search criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Universities;
