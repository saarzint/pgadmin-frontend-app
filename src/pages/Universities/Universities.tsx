import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Header, UniversitiesList } from '../../components/Universities';
import { UniversityData } from '../../components/Universities/UniversityCard/UniversityCard';
import { universityService } from '../../services/api';
import { ErrorHandler } from '../../utils/errorHandler';
import { useProfile } from '../../services/supabase/ProfileContext';
import type { UniversityResult } from '../../services/api/types';

const Universities: React.FC = () => {
  const { profileId } = useProfile();
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingProgress, setLoadingProgress] = useState<string>('');
  const [universities, setUniversities] = useState<UniversityData[]>([]);

  // Transform API result to UniversityData format
  const transformUniversityData = (result: UniversityResult): UniversityData => {
    // Build recommendation metadata as bullet points dynamically
    const metadataPoints: { label: string }[] = [];
    const metadata = result.recommendation_metadata;

    // Helper function to format field names (snake_case to Title Case)
    const formatFieldName = (field: string): string => {
      return field
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    };

    // Iterate through all metadata fields dynamically
    Object.entries(metadata).forEach(([key, value]) => {
      // Skip null or undefined values
      if (value === null || value === undefined) {
        return;
      }

      // Format the value based on its type
      let displayValue: string;
      if (typeof value === 'boolean') {
        displayValue = value ? 'Yes' : 'No';
      } else if (Array.isArray(value)) {
        displayValue = value.length > 0 ? value.join(', ') : 'None';
      } else {
        displayValue = String(value);
      }

      // Add to metadata points
      metadataPoints.push({
        label: `${formatFieldName(key)}: ${displayValue}`
      });
    });

    return {
      id: result.id.toString(),
      name: result.university_name,
      location: result.location,
      country: '', // Not provided in API
      ranking: result.rank_category, // Show rank category as-is
      tags: [result.rank_category, ...result.programs.slice(0, 2)],
      description: result.why_fit,
      tuitionFee: `$${result.tuition.toLocaleString()}/year`,
      acceptanceRate: `${result.acceptance_rate}%`, // Show acceptance rate as-is
      studentPopulation: '', // Not provided in API
      programs: result.programs,
      requirements: metadataPoints,
      matchPercentage: 0, // Not provided in API
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

  // State to track if search has been initiated
  const [searchInitiated, setSearchInitiated] = useState<boolean>(false);
  // State for search query input
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Handle start search button click
  const handleStartSearch = () => {
    if (!profileId) {
      console.error('No profile ID available');
      return;
    }
    const query = searchQuery.trim() || 'Find universities that match my profile';
    setSearchInitiated(true);
    fetchUniversities(profileId, query);
  };

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

        {/* Start Search Section - Shows when search hasn't been initiated */}
        {!searchInitiated && !loading && (
          <div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 mt-6">
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Search for Universities
              </h2>
              <p className="text-gray-600 max-w-md">
                Enter your search criteria below or leave empty to find universities that match your profile.
              </p>
            </div>
            
            {/* Search Input */}
            <div className="w-full max-w-lg px-4 mb-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="e.g., Computer Science programs in USA, Top engineering universities..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-gray-700 placeholder-gray-400"
                onKeyDown={(e) => e.key === 'Enter' && handleStartSearch()}
              />
            </div>
            
            <button
              onClick={handleStartSearch}
              className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-all duration-200 shadow-md hover:shadow-lg font-medium"
            >
              <Search className="w-5 h-5" />
              <span>Start University Search</span>
            </button>
          </div>
        )}

        {/* Loading Indicator */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
            <span className="ml-3 mt-3 text-gray-600">
              {loadingProgress || 'Loading universities...'}
            </span>
          </div>
        )}

        {/* Search Again Section - Shows after search is done */}
        {!loading && searchInitiated && (
          <div className="flex flex-col sm:flex-row items-center gap-3 mt-6 p-4 bg-gray-50 rounded-lg">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for universities..."
              className="flex-1 w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-gray-700 placeholder-gray-400"
              onKeyDown={(e) => e.key === 'Enter' && handleStartSearch()}
            />
            <button
              onClick={handleStartSearch}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-all duration-200 shadow-sm font-medium whitespace-nowrap"
            >
              <Search className="w-4 h-4" />
              <span>Search Again</span>
            </button>
          </div>
        )}

        {/* Universities List with Tabs */}
        {!loading && searchInitiated && universities.length > 0 && (
          <UniversitiesList
            universities={universities}
            onApply={handleApply}
            onViewDetails={handleViewDetails}
          />
        )}

        {/* No Results - Only show after search has been initiated */}
        {!loading && searchInitiated && universities.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No universities found. Try a different search query.</p>
            <button
              onClick={() => setSearchInitiated(false)}
              className="mt-4 px-4 py-2 text-primary hover:underline"
            >
              ← Back to search
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Universities;
