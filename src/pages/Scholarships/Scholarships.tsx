import React, { useState, useEffect } from 'react';
import { Header, MetricCards, ScholarshipsList } from '../../components/Scholarships';
import { ScholarshipData } from '../../components/Scholarships/ScholarshipCard/ScholarshipCard';
import { scholarshipService } from '../../services/api';
import { ErrorHandler } from '../../utils/errorHandler';
import type { ScholarshipResult } from '../../services/api/types';

const Scholarships: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingProgress, setLoadingProgress] = useState<string>('');
  const [scholarships, setScholarships] = useState<ScholarshipData[]>([]);

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

  // Load scholarships on component mount
  useEffect(() => {
    // Fetch scholarships for user profile ID 1
    fetchScholarships(1);
  }, []);

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

        {/* Loading Indicator */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
            <span className="ml-3 mt-3 text-gray-600">
              {loadingProgress || 'Loading scholarships...'}
            </span>
          </div>
        )}

        {/* Scholarships List with Tabs */}
        {!loading && scholarships.length > 0 && (
          <ScholarshipsList
            scholarships={scholarships}
            onApply={handleApply}
            // onViewDetails={handleViewDetails} // Commented out - using sourceUrl directly
          />
        )}

        {/* No Results */}
        {!loading && scholarships.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No scholarships found. Try adjusting your profile or search criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Scholarships;
