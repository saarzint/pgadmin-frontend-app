import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Header, MetricCards, ScholarshipsList } from '../../components/Scholarships';
import { ScholarshipData } from '../../components/Scholarships/ScholarshipCard/ScholarshipCard';
import { scholarshipService } from '../../services/api';
import { ErrorHandler } from '../../utils/errorHandler';
import { useProfile } from '../../services/supabase';
import type { ScholarshipResult } from '../../services/api/types';

const Scholarships: React.FC = () => {
  const { profileId } = useProfile();
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingProgress, setLoadingProgress] = useState<string>('');
  const [scholarships, setScholarships] = useState<ScholarshipData[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Transform API result to ScholarshipData format
  const transformScholarshipData = (result: ScholarshipResult): ScholarshipData => {
    // Build requirements metadata from eligibility analysis
    const requirementPoints: { label: string }[] = [];
    const analysis = result.eligibility_summary.eligibility_analysis;

    // Add strengths as requirement points
    analysis.strengths.forEach(strength => {
      requirementPoints.push({ label: strength });
    });

    // Add highlights if available
    result.eligibility_summary.highlights.forEach(highlight => {
      requirementPoints.push({ label: highlight });
    });

    // Check if deadline has passed (only if deadline exists)
    let deadlinePassed = false;
    if (result.deadline) {
      const deadlineDate = new Date(result.deadline);
      const now = new Date();
      deadlinePassed = deadlineDate < now;
    }

    return {
      id: result.id.toString(),
      title: result.name,
      university: result.category,
      tags: result.eligibility_summary.scholarship_categories,
      description: result.eligibility_summary.why_match,
      amount: result.award_amount ? `$${result.award_amount}` : 'Amount varies',
      deadline: result.deadline || 'No deadline specified',
      deadlinePassed,
      recipients: result.renewable_flag ? 'Renewable scholarship' : 'One-time award',
      duration: result.deadline ? `${result.days_until_deadline} days remaining` : 'Rolling deadline',
      eligibility: analysis.strengths,
      requirements: requirementPoints,
      matchPercentage: result.eligibility_summary.match_score,
      // Additional API attributes
      sourceUrl: result.source_url,
      renewableFlag: result.renewable_flag,
      matchCategory: result.eligibility_summary.match_category,
      needBased: result.eligibility_summary.need_based,
      essayRequired: result.eligibility_summary.essay_required,
      gpaRequirement: result.eligibility_summary.gpa_requirement,
      daysUntilDeadline: result.days_until_deadline,
      demographicRequirements: result.eligibility_summary.demographic_requirements,
      majorRestrictions: result.eligibility_summary.major_restrictions,
      nearMissReasons: result.eligibility_summary.near_miss_reasons,
      eligibilityIssues: analysis.eligibility_issues,
    };
  };

  // Fetch scholarship search results
  const fetchScholarships = async (userProfileId: number) => {
    setLoading(true);
    setLoadingProgress('Initiating scholarship search...');

    try {
      console.log('=== Starting Scholarship Search ===');
      console.log('User Profile ID:', userProfileId);

      // Step 1 & 2: Search and get results
      // This calls /search_scholarships first, then fetches from the results_endpoint
      setLoadingProgress('Searching for scholarships...');
      const resultsResponse = await scholarshipService.searchAndGetResults({
        user_profile_id: userProfileId,
      });

      console.log('Results Response:', resultsResponse);
      console.log('Total Scholarships:', resultsResponse.summary.total_scholarships);
      console.log('=== Scholarship Search Complete ===');

      // Combine all scholarship groups (urgent, upcoming, future) into one array
      const allScholarships = [
        ...resultsResponse.scholarships.urgent,
        ...resultsResponse.scholarships.upcoming,
        ...resultsResponse.scholarships.future,
      ];

      // Transform and set the scholarships data
      const transformedData = allScholarships.map(transformScholarshipData);
      setScholarships(transformedData);

    } catch (err) {
      console.error('Error fetching scholarships:', err);
      ErrorHandler.log(err, 'Scholarships Page - Fetch');
      setLoadingProgress('Failed to load scholarships');
    } finally {
      setLoading(false);
      setLoadingProgress('');
    }
  };

  // State to track if search has been initiated
  const [searchInitiated, setSearchInitiated] = useState<boolean>(false);
  // State for search query input (for display purposes)
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Handle start search button click
  const handleStartSearch = () => {
    if (!profileId) {
      setError('Please complete your profile first.');
      return;
    }
    setSearchInitiated(true);
    setError(null);
    console.log('Searching scholarships with query:', searchQuery || 'Find scholarships matching my profile');
    fetchScholarships(profileId);
  };

  const handleApply = (id: string) => {
    console.log('Starting application for scholarship:', id);
  };

  // Commented out - View Details now uses sourceUrl directly
  // const handleViewDetails = (id: string) => {
  //   console.log('Viewing details for scholarship:', id);
  // };

  return (
    <div className="min-h-screen bg-white py-4">
      <div className="w-full px-6">
        {/* Header */}
        <Header />

        {/* Metric Cards */}
        <MetricCards />

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Start Search Section - Shows when search hasn't been initiated */}
        {!searchInitiated && !loading && (
          <div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 mt-6">
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Search for Scholarships
              </h2>
              <p className="text-gray-600 max-w-md">
                Enter your search criteria below or leave empty to find scholarships based on your profile.
              </p>
            </div>
            
            {/* Search Input */}
            <div className="w-full max-w-lg px-4 mb-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="e.g., STEM scholarships, need-based aid, international students..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-gray-700 placeholder-gray-400"
                onKeyDown={(e) => e.key === 'Enter' && handleStartSearch()}
              />
            </div>
            
            <button
              onClick={handleStartSearch}
              className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-all duration-200 shadow-md hover:shadow-lg font-medium"
            >
              <Search className="w-5 h-5" />
              <span>Start Scholarship Search</span>
            </button>
          </div>
        )}

        {/* Loading Indicator */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
            <span className="ml-3 mt-3 text-gray-600">
              {loadingProgress || 'Loading scholarships...'}
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
              placeholder="Search for scholarships..."
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

        {/* Scholarships List with Tabs */}
        {!loading && searchInitiated && scholarships.length > 0 && (
          <ScholarshipsList
            scholarships={scholarships}
            onApply={handleApply}
            // onViewDetails={handleViewDetails} // Commented out - using sourceUrl directly
          />
        )}

        {/* No Results - Only show after search has been initiated */}
        {!loading && searchInitiated && scholarships.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No scholarships found. Try a different search.</p>
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

export default Scholarships;
